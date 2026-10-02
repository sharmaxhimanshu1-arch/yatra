import '@fontsource/marcellus';
import '@fontsource/lora/400.css';
import '@fontsource/lora/600.css';
import '@fontsource/lora/400-italic.css';
import './ui/theme.css';

import { newGame, dispatch, IllegalAction, canRoll, choiceView, saves } from './engine/index.js';
import { REGION_BY_ID, CARDS } from './data/index.js';
import { h, clear, wait, storage } from './ui/dom.js';
import { Board } from './ui/board.js';
import { renderTopbar, renderSidebar } from './ui/hud.js';
import { renderCard, animateTest } from './ui/card.js';
import { renderVillage } from './ui/village.js';
import { renderJournal, renderWorldMap, renderMenu, renderHelp, renderRegionDone, renderEnding, renderForkBar } from './ui/panels.js';
import { renderTitle } from './ui/title.js';
import { tumble, dieFace, toast, noteKind } from './ui/fx.js';
import { sound } from './ui/sound.js';

const app = document.getElementById('app');

let state = null;
let slot = null;
let busy = false;
const ui = { panel: null, journalTab: 'Quests', selectedItem: null, confirmDismiss: null };

// ---- screens --------------------------------------------------------------------

function showTitle() {
  state = null;
  slot = null;
  document.title = 'Yatra';
  renderTitle(clear(app), storage, {
    onNew(n, name) {
      startGame(newGame({ name, seed: `${name}-${Date.now()}` }), n);
      saves.saveGame(storage, n, state);
    },
    onContinue(n) {
      try {
        startGame(saves.loadGame(storage, n), n);
      } catch (e) {
        toast(`Could not load that journey: ${e.message}`, 'bad');
      }
    },
    onImport(text, redraw) {
      try {
        const loaded = saves.deserialize(text);
        const free = saves.listSlots(storage).find((sl) => sl.empty);
        if (!free) return toast('All three journey slots are full. Delete one first.', 'bad');
        saves.saveGame(storage, free.slot, loaded);
        toast(`Imported into Journey ${free.slot}.`, 'good');
        redraw();
      } catch (e) {
        toast(`That file isn't a Yatra save (${e.message}).`, 'bad');
      }
    },
  });
}

const els = {};
let board = null;

function startGame(loaded, n) {
  state = loaded;
  slot = n;
  Object.assign(ui, { panel: null, selectedItem: null, confirmDismiss: null });
  els.topbar = h('header', { class: 'topbar' });
  els.dice = h('div', { class: 'die-host', 'aria-live': 'polite' }, dieFace(1));
  els.controls = h('div', { class: 'controls' });
  els.boardWrap = h('div', { class: 'board-wrap' });
  els.sidebar = h('aside', { class: 'sidebar' });
  els.layer = h('div', { class: 'layer' });
  clear(app).append(
    h('div', { class: 'game' }, els.topbar, h('main', { class: 'stage' }, els.boardWrap, els.controls), els.sidebar),
    els.layer,
  );
  board = new Board(els.boardWrap, { onPick: (id) => act({ type: 'CHOOSE_FORK', to: id }) });
  render();
}

// ---- the action loop -------------------------------------------------------------

async function act(action) {
  if (busy || !state) return;
  let result;
  try {
    result = dispatch(state, action);
  } catch (e) {
    if (e instanceof IllegalAction) return toast(e.message, 'bad');
    throw e;
  }
  busy = true;
  app.classList.add('busy');
  state = result.state;
  try {
    await play(result.events);
  } finally {
    busy = false;
    app.classList.remove('busy');
  }
  render();
  saves.saveGame(storage, slot, state);
}

async function play(events) {
  for (const e of events) {
    switch (e.type) {
      case 'roll':
        if (e.chosen) els.dice.replaceChildren(dieFace(e.value, 'die die-landed'));
        else await tumble(els.dice, e.value);
        await wait(150);
        break;
      case 'step':
        sound.step();
        await board.hop(e.to);
        break;
      case 'resolve':
        if (e.test) await animateTest(els.layer, e.test);
        break;
      case 'card':
        sound.card();
        break;
      case 'faint':
        sound.fail();
        els.boardWrap.classList.add('faint');
        await wait(700);
        els.boardWrap.classList.remove('faint');
        break;
      case 'travel':
        els.boardWrap.classList.add('fading');
        await wait(450);
        board.build(REGION_BY_ID[e.region]);
        board.update(state);
        els.boardWrap.classList.remove('fading');
        splash(REGION_BY_ID[e.region]);
        break;
      case 'notes':
        e.notes.forEach((n) => toast(n, noteKind(n)));
        if (e.notes.some((n) => /^Quest complete|Sacred Token/.test(n))) sound.fanfare();
        else if (e.notes.length) sound.gain();
        break;
      case 'place':
        toast(`📍 New place: ${e.name}`, 'good');
        break;
      case 'hungry':
        toast('🍚 No food! −1 Prana', 'bad');
        break;
      case 'quiet':
        toast(e.text);
        break;
    }
  }
}

function splash(region) {
  const el = h('div', { class: 'splash' }, h('div', { class: 'splash-sub' }, 'You enter'), h('div', { class: 'splash-title' }, region.name), h('div', { class: 'splash-sub' }, region.subtitle));
  document.body.append(el);
  sound.bell();
  setTimeout(() => el.classList.add('out'), 2200);
  setTimeout(() => el.remove(), 3000);
}

// ---- rendering -------------------------------------------------------------------

function render() {
  if (!state) return;
  const region = REGION_BY_ID[state.region];
  document.title = `Yatra · ${region.name}`;
  if (board.region?.id !== state.region) board.build(region);
  board.update(state);
  renderTopbar(els.topbar, state, {
    onJournal: () => openPanel('journal'),
    onMap: () => openPanel('map'),
    onMenu: () => openPanel('menu'),
  });
  renderSidebar(els.sidebar, state, {
    act,
    selectedItem: ui.selectedItem,
    selectItem: (i) => { ui.selectedItem = i; render(); },
    confirmDismiss: ui.confirmDismiss,
    setConfirmDismiss: (c) => { ui.confirmDismiss = c; render(); },
  });
  renderControls();
  renderLayer();
}

function renderControls() {
  if (state.pending?.kind === 'fork') return renderForkBar(els.controls, state, board, { act });
  const ready = canRoll(state);
  els.controls.replaceChildren(
    h('div', { class: 'rollbar' },
      els.dice,
      state.chooseRoll && ready
        ? h('div', { class: 'choose-roll' },
          h('span', {}, '🪶 Choose how far to fly:'),
          [1, 2, 3, 4, 5, 6].map((v) => h('button', { class: 'btn-small', onClick: () => act({ type: 'ROLL', value: v }) }, v)))
        : h('button', { class: 'btn-roll', disabled: !ready, onClick: () => act({ type: 'ROLL' }), title: 'Roll the die (Space)' }, '🎲 Roll'),
      h('div', { class: 'roll-hint' }, ready ? hint() : ''),
    ),
  );
}

function hint() {
  if (state.anna === 0) return 'You are out of food. Buy some at a village, or each roll costs Prana.';
  if (state.prana <= 3) return 'Prana is low. Rest at a village or use herbs.';
  return 'Roll to walk on. Hover a tile to see what it is.';
}

function renderLayer() {
  const L = els.layer;
  const close = () => { ui.panel = null; render(); };
  if (ui.panel === 'journal') return renderJournal(L, state, { tab: ui.journalTab, setTab: (t) => { ui.journalTab = t; render(); }, onClose: close });
  if (ui.panel === 'map') return renderWorldMap(L, state, { onClose: close });
  if (ui.panel === 'help') return renderHelp(L, { onClose: close });
  if (ui.panel === 'menu') {
    return renderMenu(L, {
      onClose: close,
      onHelp: () => openPanel('help'),
      onToggleSound: () => { sound.toggle(); render(); },
      muted: sound.muted,
      onExport: exportSave,
      onSaveQuit: () => { saves.saveGame(storage, slot, state); showTitle(); },
    });
  }
  const p = state.pending;
  if (p?.kind === 'card') return renderCard(L, state, { act });
  if (p?.kind === 'village') return renderVillage(L, state, { act });
  if (p?.kind === 'regionDone') return renderRegionDone(L, state, { act });
  if (p?.kind === 'ending') return renderEnding(L, state, { onTitle: showTitle });
  clear(L);
}

function openPanel(name) {
  ui.panel = ui.panel === name ? null : name;
  render();
}

function exportSave() {
  const blob = new Blob([saves.serialize(state)], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `yatra-${state.name.replace(/\W+/g, '-').toLowerCase()}-day${state.day}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Save file downloaded.', 'good');
}

// ---- keyboard ----------------------------------------------------------------------

document.addEventListener('keydown', (e) => {
  if (!state || busy || (e.target instanceof Element && e.target.closest('input, textarea')) || e.ctrlKey || e.metaKey || e.altKey) return;
  const p = state.pending;
  const key = e.key;
  if (key === 'Escape') {
    e.preventDefault();
    if (ui.panel) {
      ui.panel = null;
      render();
    } else openPanel('menu');
    return;
  }
  if (ui.panel) return;
  if (key === 'j' || key === 'J') return openPanel('journal');
  if (key === 'm' || key === 'M') return openPanel('map');
  const digit = Number(key);
  if (key === ' ' || key === 'Enter') {
    if (e.target instanceof Element && e.target.closest('button') && key === 'Enter') return; // let focused buttons handle Enter
    e.preventDefault();
    if (canRoll(state) && !state.chooseRoll) act({ type: 'ROLL' });
    else if (p?.kind === 'card' && p.result) act({ type: 'CONTINUE' });
    else if (p?.kind === 'regionDone') act({ type: 'TRAVEL' });
  } else if (digit >= 1 && digit <= 6) {
    if (state.chooseRoll && canRoll(state)) act({ type: 'ROLL', value: digit });
    else if (p?.kind === 'fork' && p.options[digit - 1]) act({ type: 'CHOOSE_FORK', to: p.options[digit - 1] });
    else if (p?.kind === 'card' && !p.result) {
      const opt = choiceView(state, p.card)[digit - 1];
      if (opt?.available) act({ type: 'CHOOSE_OPTION', index: opt.index });
    }
  }
});

// Expose a tiny debug hook in dev builds.
if (import.meta.env?.DEV) window.yatra = { get state() { return state; }, get board() { return board; }, act, CARDS, REGION_BY_ID };

showTitle();
