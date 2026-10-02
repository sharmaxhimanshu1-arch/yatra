// Tiny DOM helpers: h('div', { class: 'x', onClick }, ...children)
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  setProps(el, props);
  append(el, children);
  return el;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
export function s(tag, props = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  setProps(el, props);
  append(el, children);
  return el;
}

function setProps(el, props) {
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export const clear = (el) => {
  el.replaceChildren();
  return el;
};

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// localStorage that never throws (private windows, blocked storage).
export const storage = {
  getItem(k) {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem(k, v) {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  },
  removeItem(k) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  },
};
