export default {
  id: 'meru',
  name: 'Mount Meru',
  subtitle: 'The golden mountain at the centre of the world',
  token: null,
  waypoints: [[500, 585], [270, 555], [110, 450], [140, 310], [290, 205], [500, 165], [710, 205], [860, 310], [880, 445], [730, 520], [560, 470], [470, 380], [520, 295]],
  track: [
    'start#foot:Foot of Meru',
    'mystery', 'encounter', 'event',
    'landmark#jambu:The Jambu Tree',
    'event', 'encounter', 'shrine', 'event',
    'village#gandharva:Gardens of the Gandharvas',
    'mystery', 'encounter', 'event', 'hazard',
    'gate#summit:The Summit',
  ],
  nodes: {
    foot: { card: 'meru_intro', text: 'Where the five tokens opened a road that was not there before.' },
    jambu: { card: 'meru_jambu', text: 'A rose-apple tree so vast that the whole human world is named after it.' },
    gandharva: {
      text: 'Celestial gardens where the musicians of heaven rest between songs.',
      shop: ['herbs', 'laddoo', 'incense'],
      visits: ['meru_sur'],
      restCost: 0,
    },
    summit: { card: 'meru_final', text: 'The top of the world.' },
  },
};
