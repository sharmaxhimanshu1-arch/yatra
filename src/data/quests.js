// A quest advances one step each time its step's `done` condition becomes true.
export const QUESTS = {
  // ---- side quests ----
  q_calf: {
    title: 'Gauri the Lost Calf', giver: 'A worried cowherd at the Ghat',
    text: 'Little Gauri wandered off during the evening aarti. She has a bell with a red thread.',
    steps: [
      { text: 'Find Gauri somewhere on the Ganga plains.', done: { flag: 'calf_found' } },
      { text: 'Bring Gauri to the cowherd’s family at the Mela Grounds.', done: { flag: 'calf_returned' } },
    ],
    reward: [{ gain: { mudra: 4, punya: 2 } }, { addItem: 'laddoo' }],
  },
  q_letter: {
    title: 'A Letter for Savitri', giver: 'Old Kamla at the Mela Grounds',
    text: 'Kamla’s daughter Savitri left to study at a forest ashram. Kamla cannot read or travel, but she can hope.',
    onStart: [{ addItem: 'letter' }],
    steps: [{ text: 'Carry the letter to the Ashram of Agastya in the Dandaka forest.', done: { flag: 'letter_delivered' } }],
    reward: [{ gain: { punya: 3 } }, { stat: { buddhi: 1 } }],
  },
  q_yaksha: {
    title: 'The Bound Yaksha', giver: 'Forest folk of Dandaka',
    text: 'A yaksha has been chained to a sal tree by a greedy sorcerer, and the forest has gone quiet with grief.',
    steps: [
      { text: 'Find the black iron key the sorcerer dropped.', done: { flag: 'key_found' } },
      { text: 'Free the yaksha from the sal tree.', done: { flag: 'yaksha_freed' } },
    ],
    reward: [{ gain: { punya: 2 } }, { addItem: 'yaksha_coin' }],
  },
  q_well: {
    title: 'Water for Rohi', giver: 'The headwoman of Rohi',
    text: 'Rohi’s well is failing. Legends speak of a buried stepwell somewhere in the dunes.',
    steps: [
      { text: 'Find the lost stepwell in the Maru desert.', done: { flag: 'well_found' } },
      { text: 'Bring the news back to Rohi.', done: { flag: 'well_reported' } },
    ],
    reward: [{ gain: { punya: 3, mudra: 3 } }, { stat: { karuna: 1 } }],
  },
  q_lighthouse: {
    title: 'Light the Lighthouse', giver: 'The fishing families of Kanyapuri',
    text: 'The old lighthouse has been dark since the keeper died, and boats are lost on the reef.',
    steps: [
      { text: 'Get a jar of lamp oil (sold in coastal villages).', done: { hasItem: 'oil' } },
      { text: 'Light the lighthouse on the reef point.', done: { flag: 'lighthouse_lit' } },
    ],
    reward: [{ gain: { punya: 3, mudra: 5 } }, { addItem: 'conch_shell' }],
  },
  q_bell: {
    title: 'The Silent Bell', giver: 'The abbot of Tsering Gompa',
    text: 'The monastery bell cracked in the great frost. Without it, travellers lost in snow cannot find the gate.',
    steps: [
      { text: 'Find bell bronze somewhere in the high passes.', done: { hasItem: 'bronze' } },
      { text: 'Bring the bronze to Tsering Gompa.', done: { flag: 'bell_recast' } },
    ],
    reward: [{ gain: { punya: 3 } }, { stat: { buddhi: 1 } }, { gain: { pranaMax: 2 } }],
  },
  // ---- companion quests ----
  q_moti: {
    title: 'Moti’s Courage', giver: 'Moti',
    text: 'Moti is terrified of deep water. Someday he may have to be braver than he is.',
    steps: [{ text: 'Somewhere by the sea, Moti will face his fear.', done: { flag: 'moti_brave' } }],
    reward: [{ gain: { punya: 2 } }, { stat: { shakti: 1 } }],
  },
  q_hanu: {
    title: 'Hanu’s Lost Troop', giver: 'Hanu',
    text: 'Hanu’s troop moved south into the forest when the river flooded.',
    steps: [
      { text: 'Look for signs of the troop in the Dandaka forest.', done: { flag: 'hanu_signs' } },
      { text: 'Reunite Hanu with his troop.', done: { flag: 'hanu_reunited' } },
    ],
    reward: [{ gain: { punya: 2 } }, { stat: { gati: 1 } }],
  },
  q_ulupi: {
    title: 'The Stolen Pearl', giver: 'Ulupi',
    text: 'The Moon Pearl of the naga queen was stolen by a thief who fled west.',
    steps: [
      { text: 'Pick up the thief’s trail in the Maru desert.', done: { flag: 'pearl_trail' } },
      { text: 'Recover the Moon Pearl.', done: { flag: 'pearl_recovered' } },
    ],
    reward: [{ gain: { punya: 2 } }, { addItem: 'naga_ring' }],
  },
  q_kesar: {
    title: 'The Missing Ending', giver: 'Kesar',
    text: 'Kesar’s grandmother died before telling the end of "The Girl Who Walked to the Sky".',
    steps: [{ text: 'Find someone in the mountains who knows how the story ends.', done: { flag: 'kesar_ending' } }],
    reward: [{ gain: { punya: 2 } }, { stat: { buddhi: 1, karuna: 1 } }],
  },
  q_meen: {
    title: 'Meen’s Father', giver: 'Meen',
    text: 'Meen’s father sailed for the pearl islands two monsoons ago and never returned.',
    steps: [{ text: 'Search the islands off the southern coast.', done: { flag: 'meen_father' } }],
    reward: [{ gain: { punya: 3, mudra: 4 } }],
  },
  q_tarkshya: {
    title: 'Learning to Soar', giver: 'Tarkshya',
    text: 'A Garuda earns its name by flying over the high Himalaya.',
    steps: [{ text: 'Find a cliff high enough for Tarkshya’s first true flight.', done: { flag: 'tarkshya_soared' } }],
    reward: [{ gain: { punya: 2 } }, { addItem: 'feather' }],
  },
  q_sur: {
    title: 'A Song at the Summit', giver: 'Sur',
    text: 'Sur means to sing her lost partner’s song where heaven touches earth.',
    steps: [{ text: 'Reach Mount Meru with Sur at your side.', done: { flag: 'sur_sang' } }],
    reward: [{ gain: { punya: 3 } }],
  },
};

export const TOKENS = {
  lotus_seed: { name: 'Lotus Seed of the Ganga', icon: '🪷', region: 'ganga' },
  heartwood: { name: 'Sandal Heartwood', icon: '🪵', region: 'dandaka' },
  sun_shard: { name: 'Sun Shard', icon: '🔆', region: 'maru' },
  tide_conch: { name: 'Conch of Tides', icon: '🐚', region: 'coast' },
  snow_key: { name: 'Snow-Lotus Key', icon: '❄️', region: 'himalaya' },
};

export const ENDINGS = {
  guardian: {
    title: 'Guardian of Meru', icon: '🏔️',
    text: 'The devas offer you a place among the guardians of the world-mountain. You accept, and from the summit you watch every road you walked, every friend you made, keeping them safe for as long as the mountain stands.',
  },
  home: {
    title: 'Home, Changed', icon: '🏡',
    text: 'You carry a single snow-lotus back to Sonpur. The village is exactly as you left it, but you are not. In the evenings children gather to hear about nagas and deserts and the boy-bird who learned to fly, and some of them, you notice, have started looking at the horizon.',
  },
  wanderer: {
    title: 'The Endless Road', icon: '🌄',
    text: 'At the summit your friends look at you, and you look at them, and nobody needs to say it. The world is bigger than one journey. You turn around together and choose a road none of you has ever walked.',
  },
  seer: {
    title: 'Seer of All Creatures', icon: '👁️',
    text: 'Every creature you befriended along the road speaks within you at once: the dolphin’s song, the yaksha’s riddle, the swan’s clear judgement. You come down the mountain able to hear the world, and you spend your life translating it for those who cannot.',
  },
};
