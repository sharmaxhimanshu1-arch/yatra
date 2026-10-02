// Ability kinds: reroll (passive, a failed test once per region) · heal · forage · insight · shield · wings · song
export const COMPANIONS = {
  moti: {
    name: 'Moti', creature: 'dog', icon: '🐕', title: 'Loyal village dog',
    text: 'A spotted stray who decided, years ago, that you belong to him.',
    bonus: { karuna: 1 },
    ability: { kind: 'forage', name: 'Sniff Out Food', text: 'Once per region: +3 Anna.' },
    quest: 'q_moti',
  },
  hanu: {
    name: 'Hanu', creature: 'vanara', icon: '🐒', title: 'Vanara scout',
    text: 'A young monkey-warrior separated from his troop, too proud to admit he’s lost.',
    bonus: { gati: 1 },
    ability: { kind: 'reroll', name: 'Second Chance', text: 'Passive, once per region: re-rolls a failed test.' },
    quest: 'q_hanu',
  },
  ulupi: {
    name: 'Ulupi', creature: 'naga', icon: '🐍', title: 'Naga princess',
    text: 'Heir of the lotus-pond palace, travelling in disguise to recover her mother’s pearl.',
    bonus: { buddhi: 1 },
    ability: { kind: 'heal', name: 'Naga Balm', text: 'Once per region: restore 4 Prana.' },
    quest: 'q_ulupi',
  },
  kesar: {
    name: 'Kesar', creature: null, icon: '🧕', title: 'Desert storyteller',
    text: 'A caravan girl who has memorised four hundred stories and is still missing one ending.',
    bonus: { karuna: 1 },
    ability: { kind: 'insight', name: 'Old Wisdom', text: 'Once per region: +3 to your next test.' },
    quest: 'q_kesar',
    recruitWhen: null,
  },
  meen: {
    name: 'Meen', creature: null, icon: '🎣', title: 'Fisher girl',
    text: 'Fearless, sunburnt, and able to read a storm a day before it comes.',
    bonus: { shakti: 1 },
    ability: { kind: 'shield', name: 'Read the Weather', text: 'Once per region: the next harm to your Prana is prevented.' },
    quest: 'q_meen',
  },
  tarkshya: {
    name: 'Tarkshya', creature: 'garuda', icon: '🦅', title: 'Young Garuda',
    text: 'A Garuda fledgling who can’t yet fly far, and talks about it constantly.',
    bonus: { shakti: 1 },
    ability: { kind: 'wings', name: 'Carry You Aloft', text: 'Once per region: choose your next move instead of rolling.' },
    quest: 'q_tarkshya',
  },
  sur: {
    name: 'Sur', creature: 'kinnara', icon: '🎶', title: 'Kinnara musician',
    text: 'Lost her partner’s song in an avalanche and wants to sing it again at the top of the world.',
    bonus: { karuna: 1, buddhi: 1 },
    ability: { kind: 'song', name: 'Mountain Song', text: 'Once per region: +2 Prana and +1 Punya.' },
    quest: 'q_sur',
  },
};
