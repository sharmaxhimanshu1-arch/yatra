# Yatra

A solo, browser-based adventure board game. You follow a dying rishi's half-burnt map across five mythic lands: the Ganga Plains, the Dandaka Forest, the Maru Desert, the Southern Coast and the Himalaya. Along the way you befriend creatures, recruit companions and take on quests. Each land guards a Sacred Token, and with all five you can climb Mount Meru.

## Run it

```
npm install
npm run dev        # opens http://localhost:5180
```

Other commands:

| Command | What it does |
|---|---|
| `npm test` | Engine, content, save and board-layout tests |
| `npm run sim -- 500` | Plays 500 seeded games with a bot. Reports turns per region, faints, Punya, friends and endings |
| `npm run build` | Static build in `dist/`, served from relative paths so it can be wrapped in Electron later |

## How it plays

- **Each turn:**
  - Roll a d6 and walk that many tiles. You choose the branch at forks.
  - Villages and Gates always stop you.
  - Every roll eats 1 Anna (food). With no food, it costs 1 Prana instead.
- **Tiles:** event ✨, encounter 🐾, hazard ⚡, mystery ❔, shrine 🪔, village 🏘️, landmark 🏛️, gate 🔱
- **Tests:** roll d6 + stat (Shakti, Buddhi, Karuna or Gati) against a difficulty number. A natural 6 always succeeds, and every choice shows your odds.
- **Companions:** up to 3 travel with you. Each gives a stat bonus and has an ability usable once per land.
- **Fainting:** at 0 Prana you wake in the last village with half your coins. There is no game over.
- **Endings:** four, depending on your Punya, your creature friends and who walks with you.
- **Saving:** the game autosaves after every move into one of 3 slots in the browser. You can export and import save files from the menu and the title screen.
- **Keys:** Space rolls or continues, 1–6 choose, J opens the journal, M the map, Esc the menu.

## Code layout

```
src/engine/   pure rules: no DOM, fully testable
  actions.js    dispatch(state, action) → { state, events }  (the only way state changes)
  effects.js    card outcome interpreter (gain, lose, addItem, befriend, recruit, startQuest, token, …)
  conditions.js requirement checks (hasItem, flag, companion, night, mudra, …)
  layout.js     turns a region "track" into board coordinates
  rng.js        seeded dice; the seed lives in the save, so loading continues with the same rolls
src/data/     all content as plain JS objects
  regions/*.js  board track, waypoints and village shops, quests and recruits
  cards/*.js    event, encounter, hazard, mystery, shrine, landmark and gate cards
  items.js, creatures.js, companions.js, quests.js (with tokens and endings)
src/ui/       DOM and SVG rendering (board, cards, village, HUD, journal, map, sound)
```

## Adding content

Add a card to the right `src/data/cards/<region>.js` file:

```js
{
  id: 'maru_oasis_thief', deck: 'encounter', art: '🦊', creature: 'lomri',
  when: { night: true },                  // optional: when it can be drawn
  title: '…', text: '…',
  choices: [
    { label: 'Chase it', test: { stat: 'gati', dc: 5 },
      pass: [{ gain: { mudra: 3 } }], passText: '…',
      fail: [{ lose: { prana: 2 } }], failText: '…' },
    { label: 'Let it go', pass: [{ gain: { punya: 1 } }], passText: '…' },
  ],
}
```

Then run `npm test`. The content test checks every id, item, creature and quest reference, every effect and condition key, and that each card has at least one choice that is always available. The layout test checks that region boards have no crossing paths.
