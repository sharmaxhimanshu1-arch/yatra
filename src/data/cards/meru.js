export default [
  {
    id: 'meru_intro', deck: 'intro', art: '✨',
    title: 'The Road Appears',
    text: 'Beyond the Snow-Lotus Gate there is only cloud. You stand at the edge, not knowing what to do, and the five tokens in your bag begin to glow: the lotus seed, the heartwood, the sun shard, the conch, the snow-lotus key. The clouds part. There, where no mountain stood, rises a mountain of gold, so tall its peak is lost among the stars. A road of light runs to its foot. Mount Meru.',
    choices: [
      { label: 'Step onto the road of light', pass: [{ gain: { prana: 20 } }], passText: 'It holds. Of course it holds. You’ve come too far for it not to.' },
      { label: 'Look back the way you came', pass: [{ gain: { prana: 20, punya: 1 } }], passText: 'From up here you can see it all: the plains, the forest, the desert, the coast, the mountains. Every footstep. You turn back to Meru with tears freezing on your face.' },
    ],
  },
  {
    id: 'meru_jambu', deck: 'landmark', art: '🌳',
    title: 'The Jambu Tree',
    text: 'On the slope of Meru grows the Jambu tree, as tall as a mountain itself. Its fruits are the size of elephants, and when they fall and burst, their juice becomes a river that circles the world. Jambudvipa, the land of the rose-apple tree: this is where your whole world got its name.',
    choices: [
      { label: 'Taste a fallen fruit', pass: [{ gain: { prana: 10, pranaMax: 2 } }], passText: 'It tastes like every good meal you’ve ever had, all at once. Mother’s laddoos. Wedding sweets. Desert dates. Coconut water. Home.' },
      { label: 'Rest in its shade', pass: [{ gain: { punya: 2 } }, { buff: { stat: 'any', amount: 3 } }], passText: 'You sleep, and dream of everyone you’ve met.' },
    ],
  },
  {
    id: 'meru_sur', deck: 'visit', art: '🎶',
    when: { companion: 'sur', notFlag: 'sur_sang' },
    title: 'Sur’s Song',
    text: 'The gandharvas, heaven’s musicians, have heard of Sur. They gather in the garden, hundreds of them, and fall silent. Sur stands. She closes her eyes. She begins her partner’s song, the one lost in the avalanche, and this time, from every direction, the gandharvas sing the other half.',
    choices: [{ label: 'Listen', pass: [{ setFlag: 'sur_sang' }], passText: 'It is the most beautiful thing that has ever happened. When it is over, Sur is smiling, the first true smile you’ve seen on her face. "Thank you for bringing me," she says.' }],
  },
  {
    id: 'meru_final', deck: 'gate', art: '🏔️',
    title: 'The Summit of Meru',
    text: 'You climb the last step. The summit is a wide golden plain under a sky full of stars, though it is noon. From here you can see the whole world laid out like a lotus: seven rings of land and seven rings of sea. And sitting on a rock at the very top, as if he’d been waiting all along, is Rishi Atreya. He doesn’t look old any more. "You went," he says, and his voice breaks. "You went." He looks at you, and at your friends, and at everything you carry. "Now. You can see the world as it truly is. What will you do with it?"',
    choices: [
      { label: 'Stay and guard the world from here', requires: { punya: 36 }, pass: [{ ending: 'guardian' }], passText: 'The rishi bows to you. Below, the world turns on, watched over.' },
      { label: 'Listen to every creature you’ve befriended', requires: { friends: 12 }, pass: [{ ending: 'seer' }], passText: 'The voices of the world rise to meet you.' },
      { label: 'Keep wandering, with your friends', requires: { party: 2 }, pass: [{ ending: 'wanderer' }], passText: 'Your friends are already grinning.' },
      { label: 'Go home', pass: [{ ending: 'home' }], passText: 'Home is where the journey was going all along.' },
    ],
  },

  // ---- events ----
  {
    id: 'meru_river', deck: 'event', art: '🌌', region: 'meru',
    title: 'The River from Heaven',
    text: 'A river falls out of the sky onto Meru’s slopes: the heavenly Ganga, the same river you grew up beside, before she came down to earth. She splits into four streams that flow toward the four corners of the world.',
    choices: [
      { label: 'Drink from the river you know', pass: [{ gain: { prana: 10, punya: 1 } }], passText: 'It tastes like Sonpur.' },
      { label: 'Send a blessing downstream', pass: [{ gain: { punya: 3 } }], passText: 'You think of everyone along the river: your mother, Kevat, the pilgrims, the dolphin. The water carries it all the way down.' },
    ],
  },
  {
    id: 'meru_stars', deck: 'event', art: '⭐',
    title: 'Among the Stars',
    text: 'The road climbs so high that stars drift past at arm’s length, humming. The seven rishis of the Great Bear circle the peak. One of them waves.',
    choices: [
      { label: 'Wave back', pass: [{ gain: { punya: 1 } }, { buff: { stat: 'any', amount: 3 } }], passText: 'He shouts something about "Atreya’s student!" and the others turn to look.' },
      { label: 'Ask them for guidance', test: { stat: 'buddhi', dc: 6 }, pass: [{ randomStat: 1 }], passText: 'They tell you that the summit is not the end. You suspected as much.', fail: [{ gain: { prana: 4 } }], failText: 'They speak in a language of light you can’t follow, but it’s warm.' },
    ],
  },
  {
    id: 'meru_devas', deck: 'event', art: '🎆',
    title: 'The Feast of the Devas',
    text: 'The gods are throwing a feast on a cloud. Indra waves a thunderbolt at you. "Mortal! Come! Anyone who walks to Meru eats with us!"',
    choices: [{ label: 'Eat with the gods', pass: [{ gain: { prana: 20, anna: 6 } }], passText: 'Amrita, sweet as dawn. Agni tells terrible jokes. Lakshmi asks after her owl.' }],
  },
  // ---- encounters ----
  {
    id: 'meru_airavata', deck: 'encounter', art: '🐘', creature: 'airavata',
    title: 'Airavata',
    text: 'A white elephant with seven trunks and four tusks blocks the road, flapping its ears like clouds. Airavata, mount of Indra, born from the churning of the ocean.',
    choices: [
      { label: 'Bow and offer a laddoo', requires: { hasItem: 'laddoo' }, pass: [{ removeItem: 'laddoo' }, { befriend: 'airavata' }, { gain: { punya: 2 } }], passText: 'Seven trunks reach for one laddoo. Airavata is delighted, and lifts you up the next stretch of road.' },
      { label: 'Speak to it', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'airavata' }, { gain: { punya: 1 } }], passText: 'It trumpets seven notes at once, a chord, and steps aside.', fail: [], failText: 'It rumbles and wanders off on its own business.' },
    ],
  },
  {
    id: 'meru_kamadhenu', deck: 'encounter', art: '🐄', creature: 'kamadhenu',
    title: 'Kamadhenu',
    text: 'A white cow with a woman’s face and peacock wings stands in a meadow. All the gods, they say, live inside her. She is the wish-granting cow. "One wish," she says gently, "but not for yourself."',
    choices: [
      { label: 'Wish for your mother’s happiness', pass: [{ befriend: 'kamadhenu' }, { gain: { punya: 3 } }], passText: 'Far away in Sonpur, a woman making laddoos suddenly laughs out loud for no reason.' },
      { label: 'Wish for your friends’ safety', pass: [{ befriend: 'kamadhenu' }, { gain: { punya: 3 } }], passText: 'Wherever they are, whatever road they take, they will be safe. You feel it settle like a blanket.' },
    ],
  },
  // ---- hazard, mystery, shrine ----
  {
    id: 'meru_wind', deck: 'hazard', art: '🌬️',
    title: 'The Wind of the Gods',
    text: 'Vayu, the wind god, is testing you: a gale strong enough to blow mountains away screams down the golden road.',
    choices: [
      { label: 'Lean into it', test: { stat: 'shakti', dc: 7 }, pass: [], passText: 'Step by step, you walk through the wind of the gods.', fail: [{ lose: { prana: 4 } }, { moveBack: 1 }], failText: 'It blows you back down the road like a leaf.' },
      { label: 'Laugh at it', test: { stat: 'karuna', dc: 6 }, pass: [{ gain: { punya: 1 } }], passText: 'Vayu laughs too, and the gale becomes a breeze at your back.', fail: [{ lose: { prana: 3 } }], failText: 'Vayu is not amused.' },
    ],
  },
  {
    id: 'meru_past', deck: 'mystery', art: '🌀',
    title: 'Echoes of the Road',
    text: 'The mist on the mountain shapes itself into scenes from your journey: the wedding procession, the tiger, the vetala, the drowning girl, the swans. You watch yourself, and you barely recognise the nervous child who left Sonpur.',
    choices: [{ label: 'Thank them all', pass: [{ gain: { punya: 2, prana: 5 } }], passText: 'You say thank you out loud, to every one of them. The mist glows gold.' }],
  },
  {
    id: 'meru_mirror_lake', deck: 'mystery', art: '💎',
    title: 'The Lake of Diamonds',
    text: 'A lake whose bed is made of jewels. Anyone can take as many as they want. Nobody ever does, because by the time you reach Meru, you no longer want them.',
    choices: [
      { label: 'Take one, for your mother', pass: [{ gain: { mudra: 10 } }], passText: 'Just one. It’s for her.' },
      { label: 'Take nothing', pass: [{ gain: { punya: 3 } }], passText: 'You smile at the diamonds and walk on.' },
    ],
  },
  {
    id: 'meru_shrine', deck: 'shrine', art: '🪷',
    title: 'The Thousand-Petalled Lotus',
    text: 'A lotus as big as a house blooms on the mountainside, each petal a different colour. In the centre, a small flame burns without fuel.',
    choices: [{ label: 'Sit in the lotus', pass: [{ randomStat: 1 }, { gain: { prana: 10, punya: 1 } }], passText: 'You sit in the flower and the flower holds you.' }],
  },
];
