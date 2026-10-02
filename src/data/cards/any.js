// Cards that can turn up in any region (drawn at half weight beside the region's own).
export default [
  {
    id: 'any_trader', deck: 'event', art: '🛒',
    title: 'The Wandering Trader',
    text: 'A trader with a donkey so loaded it looks like a walking hill. Pots, bangles, herbs, umbrellas, a parrot (not for sale). "Special price, for you only!"',
    choices: [
      { label: 'Buy healing herbs (2 Mudra)', requires: { mudra: 2 }, pass: [{ lose: { mudra: 2 } }, { addItem: 'herbs' }], passText: '"Very good choice. Very good. My grandmother picked them." (She did not.)' },
      { label: 'Buy food (1 Mudra)', requires: { mudra: 1 }, pass: [{ lose: { mudra: 1 } }, { gain: { anna: 2 } }], passText: 'Roasted chana and jaggery. Simple, perfect.' },
      { label: 'Haggle for fun', test: { stat: 'buddhi', dc: 5 }, pass: [{ gain: { mudra: 2 } }], passText: 'Somehow, at the end of an hour, he’s paying you. He seems delighted by this.', fail: [], failText: 'He out-haggles you so badly you almost buy the donkey.' },
    ],
  },
  {
    id: 'any_lost_child', deck: 'event', art: '🧒',
    title: 'A Lost Child',
    text: 'A small boy sits crying at a crossroads. He has lost his family, and also one shoe.',
    choices: [
      { label: 'Help him find his family', test: { stat: 'karuna', dc: 4 }, pass: [{ gain: { punya: 2, anna: 2 } }], passText: 'His mother finds you both an hour later and weeps, and feeds you, and weeps some more.', fail: [{ gain: { punya: 1 } }, { lose: { anna: 1 } }], failText: 'It takes all day, and he eats most of your food, but he gets home.' },
      { label: 'Point him to the nearest temple', pass: [], passText: 'The priests will know what to do. You hope.' },
    ],
  },
  {
    id: 'any_diwali', deck: 'event', art: '🪔', when: { night: true },
    title: 'A Night of Lamps',
    text: 'Every doorway in the hamlet is lit with clay lamps tonight. Rangoli patterns bloom on the thresholds. Children run past with sparklers. It’s Diwali.',
    choices: [
      { label: 'Celebrate with the villagers', pass: [{ gain: { prana: 3, anna: 1, punya: 1 } }], passText: 'Sweets, fireworks and a hundred new friends.' },
      { label: 'Light a lamp for those you left behind', pass: [{ gain: { punya: 2 } }, { buff: { stat: 'karuna', amount: 2 } }], passText: 'You think of your mother, and of the rishi. The flame burns very steady.' },
    ],
  },
  {
    id: 'any_cow', deck: 'event', art: '🐄',
    title: 'The Unmovable Cow',
    text: 'A cow is lying in the exact middle of the narrow path. She regards you calmly. She is not going to move. She has never moved. She may never move again.',
    choices: [
      { label: 'Wait patiently', pass: [{ lose: { anna: 1 } }, { gain: { punya: 1 } }], passText: 'She gets up at sunset, moos once, and wanders off. You feel you have passed some kind of test.' },
      { label: 'Climb around her', test: { stat: 'gati', dc: 3 }, pass: [], passText: 'You scramble around through the thorns. She doesn’t even look.', fail: [{ lose: { prana: 1 } }], failText: 'Thorns. So many thorns.' },
    ],
  },
  {
    id: 'any_night_sky', deck: 'event', art: '🌌', when: { night: true },
    title: 'The River of Stars',
    text: 'No moon tonight, and the sky is so full of stars that it seems to sag. The Akash Ganga, the river of heaven, pours across it from one horizon to the other.',
    choices: [
      { label: 'Find the Seven Rishis in the stars', test: { stat: 'buddhi', dc: 4 }, pass: [{ stat: { buddhi: 1 } }], passText: 'You trace the seven sages and the faint star of Arundhati beside them. Now you will never be lost at night.', fail: [{ gain: { prana: 2 } }], failText: 'You fall asleep counting stars.' },
      { label: 'Just lie back and look', pass: [{ gain: { prana: 3 } }], passText: 'You feel very small and very lucky.' },
    ],
  },
  // ---- shrines ----
  {
    id: 'any_shrine_ganesha', deck: 'shrine', art: '🐘',
    title: 'Roadside Ganesha',
    text: 'A tiny shrine under a tree: an orange-painted Ganesha with a broken tusk, a mouse at his feet, and a single fresh flower someone left this morning.',
    choices: [
      { label: 'Ask him to remove obstacles', pass: [{ buff: { stat: 'any', amount: 2 } }, { gain: { prana: 1 } }], passText: 'The flower trembles. Your road feels clearer.' },
      { label: 'Offer incense', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { randomStat: 1 }, { gain: { punya: 1 } }], passText: 'Ganesha, remover of obstacles, patron of beginnings. You’re sure he winked.' },
    ],
  },
  {
    id: 'any_shrine_devi', deck: 'shrine', art: '🌺',
    title: 'Shrine of the Village Goddess',
    text: 'A red-painted stone under a neem tree, hung with bangles and tiny cradles. This is the gramadevi, the goddess who guards this place and everyone passing through.',
    choices: [
      { label: 'Ask for protection', pass: [{ shield: true }], passText: 'You tie a red thread around your wrist. You feel watched over.' },
      { label: 'Offer food', requires: { anna: 1 }, pass: [{ lose: { anna: 1 } }, { gain: { punya: 2, pranaMax: 1 } }], passText: 'A crow takes the offering, which is a very good sign.' },
    ],
  },
  {
    id: 'any_shrine_hanuman', deck: 'shrine', art: '🙌',
    title: 'Hanuman’s Shrine',
    text: 'An orange idol of Hanuman, the monkey god, carrying a mountain in one hand. Pilgrims rub sindoor on his feet for strength.',
    choices: [
      { label: 'Pray for strength', pass: [{ buff: { stat: 'shakti', amount: 3 } }, { gain: { prana: 2 } }], passText: 'You feel you could lift a mountain too. A small one.' },
      { label: 'Light incense', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { stat: { shakti: 1 } }], passText: 'The idol’s face seems to smile.' },
    ],
  },
];
