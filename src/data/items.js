// price: village shop cost · bonus: passive stat bonus while carried · use: effects when used
export const ITEMS = {
  herbs: { name: 'Healing Herbs', icon: '🌿', price: 3, consumable: true, use: [{ gain: { prana: 4 } }], text: 'Tulsi, neem and ashwagandha, bundled tight. Restores 4 Prana.' },
  laddoo: { name: 'Box of Laddoos', icon: '🟠', price: 2, consumable: true, use: [{ gain: { anna: 3, prana: 1 } }], text: 'Sweet, heavy, and made by someone who loves you. +3 Anna, +1 Prana.' },
  dates: { name: 'Bag of Dates', icon: '🟤', price: 2, consumable: true, use: [{ gain: { anna: 3 } }], text: 'Desert food that keeps for months. +3 Anna.' },
  milk: { name: 'Pot of Milk', icon: '🥛', price: 2, text: 'An offering the serpent folk cannot refuse.' },
  incense: { name: 'Incense Sticks', icon: '🕯️', price: 1, text: 'Sandalwood smoke for shrines and spirits.' },
  rope: { name: 'Coir Rope', icon: '🪢', price: 3, text: 'Thirty cubits of coconut-fibre rope. For cliffs, wells and rivers.' },
  lamp: { name: 'Clay Lamp', icon: '🪔', price: 3, text: 'A small diya with a steady flame. Dark places hold fewer terrors.' },
  waterskin: { name: 'Water Skin', icon: '💧', price: 2, text: 'Goat-hide, sealed with wax. The desert forgives those who carry water.' },
  shawl: { name: 'Pashmina Shawl', icon: '🧣', price: 4, text: 'Warm as an embrace. Keeps the mountain cold at bay.' },
  staff: { name: 'Walking Staff', icon: '🦯', price: 4, bonus: { shakti: 1 }, text: 'Seasoned bamboo, iron-shod. +1 Shakti.' },
  sandals: { name: 'Sturdy Chappals', icon: '🩴', price: 4, bonus: { gati: 1 }, text: 'Stitched buffalo leather. +1 Gati.' },
  manuscript: { name: 'Palm-leaf Manuscript', icon: '📜', price: 5, bonus: { buddhi: 1 }, text: 'Riddles, star charts and old verses. +1 Buddhi.' },
  flute: { name: 'Bamboo Flute', icon: '🎋', price: 4, bonus: { karuna: 1 }, text: 'Seven holes, one sweet sound. +1 Karuna.' },
  oil: { name: 'Jar of Lamp Oil', icon: '🫙', price: 2, text: 'Thick coconut oil, enough for a great flame.' },
  // Found or earned, never sold.
  letter: { name: 'Sealed Letter', icon: '✉️', price: 0, text: 'For Savitri, at the Ashram of Agastya in the Dandaka forest.' },
  iron_key: { name: 'Black Iron Key', icon: '🗝️', price: 0, text: 'Cold to the touch. Something in the forest is locked with this.' },
  bronze: { name: 'Bell Bronze', icon: '🔔', price: 0, text: 'A lump of temple bronze, humming faintly.' },
  naga_ring: { name: 'Ring of the Naga Queen', icon: '💍', price: 0, bonus: { buddhi: 1, karuna: 1 }, text: 'Coiled silver set with a river pearl. +1 Buddhi, +1 Karuna.' },
  feather: { name: 'Garuda Feather', icon: '🪶', price: 0, bonus: { gati: 1 }, use: [{ buff: { stat: 'any', amount: 2 } }], text: 'Gold at the tip. +1 Gati.' },
  sun_amulet: { name: 'Sun Amulet', icon: '☀️', price: 0, bonus: { shakti: 1 }, text: 'Warm even at night. +1 Shakti.' },
  yaksha_coin: { name: 'Yaksha Gold', icon: '🪙', price: 0, consumable: true, use: [{ gain: { mudra: 8 } }], text: 'Treasure of Kubera’s folk. Spend it for 8 Mudra.' },
  conch_shell: { name: 'Singing Conch', icon: '🐚', price: 0, bonus: { karuna: 1 }, consumable: true, use: [{ gain: { prana: 6 } }], text: 'Hold it to your ear and hear the sea. +1 Karuna, or blow it to restore 6 Prana.' },
};

export const FOOD = { price: 2, amount: 3 };
