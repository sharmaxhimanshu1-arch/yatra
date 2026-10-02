export default [
  // ---- story ----
  {
    id: 'coast_intro', deck: 'intro', art: '🌊',
    title: 'The Sea',
    text: 'You come down out of the green hills and there it is, filling half the world: the sea. You’ve heard of it all your life. Nobody told you it would be so loud, or that it would move like something breathing, or that it would smell like this. You just stand there.',
    choices: [
      { label: 'Run into the waves', pass: [{ gain: { prana: 4 } }], passText: 'You run in with your clothes on, shrieking. A wave knocks you flat. You get up laughing.' },
      { label: 'Taste it, just to know', pass: [{ gain: { punya: 1 } }, { buff: { stat: 'any', amount: 1 } }], passText: 'Salt! All of it! A fisherman watching you laughs and laughs.' },
    ],
  },
  {
    id: 'coast_shoretemple', deck: 'landmark', art: '🛕',
    title: 'The Shore Temple',
    text: 'Granite towers stand right at the edge of the waves, spray bursting over their carved lions. Fishermen say that six more temples like this one lie under the sea, drowned in an ancient flood, and that at low tide you can see their tops.',
    choices: [
      { label: 'Pray to the sea-facing god', pass: [{ gain: { prana: 4, punya: 1 } }], passText: 'Waves boom against the walls like a drum. Your prayer feels very small and very heard.' },
      { label: 'Look for the drowned temples', test: { stat: 'gati', dc: 6 }, pass: [{ gain: { mudra: 6 } }, { stat: { gati: 1 } }], passText: 'You dive at low tide. Down in the green you touch a carved stone face, and find old coins in its mouth.', fail: [{ lose: { prana: 2 } }], failText: 'The surf throws you back onto the rocks.' },
    ],
  },
  {
    id: 'coast_reef', deck: 'landmark', art: '🗼',
    title: 'Lighthouse Point',
    text: 'At the tip of the reef stands a stone lighthouse, dark and silent. Below it the sea foams over the ribs of wrecked boats. Inside, stairs spiral up to a great brass lamp, cold for years.',
    choices: [
      { label: 'Fill and light the great lamp', requires: { hasItem: 'oil' }, pass: [{ removeItem: 'oil' }, { setFlag: 'lighthouse_lit' }, { gain: { punya: 1 } }], passText: 'The wick catches. The flame swells and the brass mirror throws a beam of gold far out to sea. Out in the dark, someone on a boat shouts for joy.' },
      { label: 'Watch the sunset from the top', pass: [{ gain: { prana: 3 } }], passText: 'You can see the curve of the world from up here.' },
    ],
  },
  {
    id: 'coast_gate', deck: 'gate', art: '🐚',
    title: 'Varuna’s Tide Gate',
    text: 'At low tide a stone arch rises from the sea, crusted with shells and weed. Between its pillars, half-buried in sand, lies a great white conch shell. As you approach, the sea itself stands up in the shape of a giant crowned man, riding a Makara: Varuna, lord of the waters. "The Conch of Tides calls the oceans. Why should I let a land-walker take it?"',
    choices: [
      { label: 'Dive for it before the tide turns', test: { stat: 'gati', dc: 7 }, pass: [{ token: 'tide_conch' }, { completeRegion: true }], passText: 'You race the returning tide, snatch the conch, and surface as the water closes over the arch. Varuna roars with laughter.', fail: [{ lose: { prana: 3 } }, { moveBack: 2 }], failText: 'The tide comes in faster than anyone could run. It rolls you back onto the beach.' },
      { label: 'Ask humbly, as a guest of the sea', test: { stat: 'karuna', dc: 7 }, pass: [{ token: 'tide_conch' }, { completeRegion: true }], passText: '"Humility. Rare in land-walkers." Varuna sets the conch in your hands himself.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'A wave answers you. It is not a gentle wave.' },
      { label: 'Answer: "Because the sea gives to all"', test: { stat: 'buddhi', dc: 7 }, pass: [{ token: 'tide_conch' }, { completeRegion: true }], passText: '"And takes from all," says Varuna. "But today, it gives." The conch rolls to your feet on a wave.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'The sea god is not interested in clever sayings.' },
      { label: 'Tarkshya carries you over the waves', hide: { companion: 'tarkshya' }, pass: [{ token: 'tide_conch' }, { completeRegion: true }], passText: 'The young Garuda grabs your shoulders and flaps madly. You skim the waves, snatch the conch and tumble onto the beach. Varuna claps, and the sea applauds.' },
      { label: 'Meen sings the fishers’ prayer', hide: { companion: 'meen' }, pass: [{ token: 'tide_conch' }, { completeRegion: true }, { gain: { punya: 1 } }], passText: 'Meen sings the song her people sing to Varuna before every voyage. The god softens, and lays the conch in her hands, and she lays it in yours.' },
    ],
  },

  // ---- companion story ----
  {
    id: 'coast_moti', deck: 'event', art: '🐕', once: true, weight: 8,
    when: { companion: 'moti', notFlag: 'moti_brave' },
    title: 'Moti and the Wave',
    text: 'A shriek from the beach. A little girl has been dragged out by a wave and is struggling in the surf. Before you can move, Moti, who will not even step in puddles, who whimpers at baths, races into the sea.',
    choices: [{ label: 'Run in after him', pass: [{ setFlag: 'moti_brave' }, { gain: { punya: 1 } }], passText: 'By the time you reach them, Moti has the girl by her dress and is paddling furiously for shore. Her whole village carries Moti around on their shoulders. He looks embarrassed, and enormously proud.' }],
  },
  {
    id: 'coast_meen_father', deck: 'event', art: '🏝️', once: true, weight: 8,
    when: { companion: 'meen', notFlag: 'meen_father' },
    title: 'Smoke on the Island',
    text: 'Meen grabs your arm and points: a thin line of smoke from a little island beyond the reef. "Nobody lives there," she whispers. She borrows a boat before you can say anything.',
    choices: [
      { label: 'Row together', test: { stat: 'shakti', dc: 5 }, pass: [{ setFlag: 'meen_father' }], passText: 'On the island, thin as a stick and grinning, a man is waving both arms. Meen leaps out before the boat touches sand. You stay in the boat a while, looking at the sky, to give them a moment.', fail: [{ setFlag: 'meen_father' }, { lose: { prana: 2 } }], failText: 'The current nearly takes you, but you make it, blistered and soaked. Meen’s father is on the island, alive.' },
      { label: 'Read the currents with her', test: { stat: 'buddhi', dc: 5 }, pass: [{ setFlag: 'meen_father' }], passText: 'You ride the tide in like a gift. Meen’s father is on the beach, alive, waving his shirt.', fail: [{ setFlag: 'meen_father' }, { lose: { prana: 2 } }], failText: 'You get there the hard way, but you get there. He’s alive.' },
    ],
  },
  {
    id: 'coast_pearl', deck: 'encounter', art: '🐲', creature: 'makara', once: true, weight: 8,
    when: { companion: 'ulupi', flag: 'pearl_trail', notFlag: 'pearl_recovered' },
    title: 'The Moon Pearl',
    text: 'In the port you learn the thief sold the pearl to a pirate, and the pirate’s ship was sunk by a Makara, which now wears the pearl on its forehead. It basks in a sea cave, the pearl glowing silver on its brow. Ulupi is shaking with fury.',
    choices: [
      { label: 'Let Ulupi speak to it, serpent to serpent', test: { stat: 'karuna', dc: 5 }, pass: [{ setFlag: 'pearl_recovered' }, { befriend: 'makara' }], passText: 'They talk for an hour in hisses. At last the Makara bows its great head, and Ulupi takes the pearl. "It only wanted something beautiful," she says. "I understand that."', fail: [{ lose: { prana: 3 } }], failText: 'It thrashes. You both scramble out. You’ll have to try again.' },
      { label: 'Snatch it while it sleeps', test: { stat: 'gati', dc: 6 }, pass: [{ setFlag: 'pearl_recovered' }], passText: 'You creep in, slide the pearl free and sprint. The Makara wakes up to an empty forehead and a very loud complaint.', fail: [{ lose: { prana: 4 } }], failText: 'One eye opens. You have never run faster.' },
    ],
  },
  {
    id: 'coast_garuda', deck: 'encounter', art: '🦅', creature: 'garuda', once: true, weight: 5,
    when: { notCompanion: 'tarkshya' },
    title: 'Tangled in the Nets',
    text: 'On the rocks, a bird the size of a child is thrashing in a fishing net: golden feathers, a curved beak and, startlingly, human arms. A Garuda fledgling. "Get it OFF me!" it squawks. "I am a GARUDA. I am the KING OF BIRDS. Probably! Eventually! Help!"',
    choices: [
      { label: 'Cut the nets carefully', test: { stat: 'gati', dc: 4 }, pass: [{ befriend: 'garuda' }, { recruit: 'tarkshya' }], passText: 'Free, he shakes out his feathers with enormous dignity. "I am Tarkshya. I owe you a life-debt, which is very inconvenient. I shall have to accompany you. I can almost fly, you know."', fail: [{ lose: { prana: 1 } }, { befriend: 'garuda' }, { recruit: 'tarkshya' }], failText: 'He pecks you twice in the panic, but you get him out. "Sorry. Sorry! I owe you. I’m coming with you."' },
      { label: 'Calm him first', test: { stat: 'karuna', dc: 4 }, pass: [{ befriend: 'garuda' }, { recruit: 'tarkshya' }, { gain: { punya: 1 } }], passText: 'You hum until he stops thrashing, then untangle him. He decides on the spot that you are his best friend.', fail: [{ lose: { prana: 2 } }], failText: 'He bites, panics, tears free and flaps off, crashing into a palm tree.' },
    ],
  },

  // ---- events ----
  {
    id: 'coast_lighthouse_oil', deck: 'event', art: '🗼', once: true, weight: 6,
    when: { quest: 'q_lighthouse', hasItem: 'oil', notFlag: 'lighthouse_lit' },
    title: 'A Dark Tower on the Point',
    text: 'You spot it from the beach: the old lighthouse, a black finger against the evening sky. A fishing boat is struggling home past the reef in the failing light.',
    choices: [{ label: 'Run and light the lamp', test: { stat: 'gati', dc: 4 }, pass: [{ removeItem: 'oil' }, { setFlag: 'lighthouse_lit' }], passText: 'You take the stairs three at a time. The beam blazes out just in time, and the boat turns away from the rocks.', fail: [{ removeItem: 'oil' }, { setFlag: 'lighthouse_lit' }, { lose: { prana: 2 } }], failText: 'You trip twice on the stairs, but the lamp lights, and the boat comes home.' }],
  },
  {
    id: 'coast_boatrace', deck: 'event', art: '🚣',
    title: 'The Snake-Boat Race',
    text: 'On the backwaters, a hundred rowers sit in a boat as long as a temple, its prow curling up like a cobra’s hood. One rower is down sick. "You! You have arms! Row!"',
    choices: [
      { label: 'Grab an oar', test: { stat: 'shakti', dc: 5 }, pass: [{ gain: { mudra: 5 } }, { stat: { shakti: 1 } }], passText: 'A hundred oars, one heartbeat, the boat flying. Victory! They carry you through the village.', fail: [{ lose: { prana: 2 } }, { gain: { anna: 2 } }], failText: 'You lose the rhythm and get an oar in the back. You come third. They feed you anyway.' },
      { label: 'Cheer from the bank', pass: [{ gain: { prana: 2 } }], passText: 'The vanchipattu boat songs echo across the water.' },
    ],
  },
  {
    id: 'coast_fishmarket', deck: 'event', art: '🐟',
    title: 'Morning Fish Market',
    text: 'The boats come in at dawn, and the beach becomes a shouting, splashing market: kingfish, sardines, crabs, prawns. A fisherwoman with silver bangles eyes your empty hands.',
    choices: [
      { label: 'Help haul the nets', test: { stat: 'shakti', dc: 4 }, pass: [{ gain: { anna: 3, mudra: 1 } }], passText: 'Heave! Heave! Silver fish pour onto the sand. You’re paid in fish curry and coins.', fail: [{ gain: { anna: 1 } }], failText: 'You mostly get tangled. They give you a fish out of pity.' },
      { label: 'Buy a meal (1 Mudra)', requires: { mudra: 1 }, pass: [{ lose: { mudra: 1 } }, { gain: { anna: 3 } }], passText: 'Fish fried in coconut oil, on a banana leaf. Heaven.' },
    ],
  },
  {
    id: 'coast_kathakali', deck: 'event', art: '🎭', when: { night: true },
    title: 'The All-Night Kathakali',
    text: 'In a temple courtyard by oil-lamp light, dancers in enormous skirts and green-painted faces act out the war of gods and demons. Drums thunder. The show will last until dawn.',
    choices: [
      { label: 'Watch until dawn', pass: [{ gain: { punya: 1 } }, { buff: { stat: 'any', amount: 2 } }], passText: 'The demon king dies at sunrise. You walk out blinking, full of stories.' },
      { label: 'Learn the eye movements backstage', test: { stat: 'gati', dc: 5 }, pass: [{ stat: { gati: 1 } }], passText: 'An old dancer drills you until your eyes ache. "Every emotion lives in the eyes," he says.', fail: [{ gain: { prana: 1 } }], failText: 'You can’t make your eyebrows do that.' },
    ],
  },
  {
    id: 'coast_coconut', deck: 'event', art: '🥥',
    title: 'Coconut Grove',
    text: 'Coconut palms lean over the sand, heavy with green nuts. A toddy-tapper is shinning up one with a loop of rope round his ankles.',
    choices: [
      { label: 'Climb one yourself', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { anna: 3, prana: 2 } }], passText: 'Coconut water, cool and sweet, straight from the nut.', fail: [{ lose: { prana: 2 } }], failText: 'Halfway up you discover you are afraid of heights.' },
      { label: 'Ask the tapper for one', pass: [{ gain: { anna: 1, prana: 1 } }], passText: 'He drops one down to you with a grin.' },
    ],
  },
  {
    id: 'coast_spices', deck: 'event', art: '🌶️',
    title: 'The Pepper Merchant',
    text: 'A spice merchant’s porters are sick with fever, and a ship to Arabia is waiting. Sacks of black pepper, "black gold", are piled on the quay.',
    choices: [
      { label: 'Carry sacks to the ship', test: { stat: 'shakti', dc: 5 }, pass: [{ gain: { mudra: 6 } }], passText: 'The ship sails on time and the merchant pays in silver.', fail: [{ lose: { prana: 2 } }, { gain: { mudra: 2 } }], failText: 'You drop a sack in the harbour. He pays you a little anyway.' },
      { label: 'Tend the sick porters', test: { stat: 'karuna', dc: 4 }, pass: [{ gain: { punya: 2 } }, { stat: { karuna: 1 } }], passText: 'Wet cloths, cool water, steady hands. By evening the fever breaks.', fail: [{ gain: { punya: 1 } }, { lose: { prana: 1 } }], failText: 'You catch a little of the fever yourself, but they recover.' },
    ],
  },

  // ---- encounters ----
  {
    id: 'coast_turtle', deck: 'encounter', art: '🐢', creature: 'kurma',
    title: 'The Night of the Turtles',
    text: 'Under the moon, a giant sea turtle, wider than a cartwheel, hauls herself up the beach to lay her eggs. Ghost crabs and jackals are already gathering.',
    choices: [
      { label: 'Guard her nest till dawn', test: { stat: 'shakti', dc: 4 }, pass: [{ befriend: 'kurma' }, { gain: { punya: 2 } }, { stat: { karuna: 1 } }], passText: 'You chase off the jackals all night. At dawn she looks at you with ancient eyes before sliding back into the sea.', fail: [{ befriend: 'kurma' }, { lose: { prana: 2 } }], failText: 'A jackal bites you, but the nest is safe.' },
      { label: 'Watch from a distance', pass: [{ gain: { prana: 2 } }], passText: 'A hundred-million-year-old ritual, under the moon.' },
    ],
  },
  {
    id: 'coast_crabs', deck: 'encounter', art: '🦀', creature: 'kekda',
    title: 'The Hermit Crab Council',
    text: 'On a flat rock, two dozen hermit crabs sit in a circle, clicking furiously. Two crabs in the middle are fighting over a beautiful spiral shell. They all turn and look at you. They seem to want a judge.',
    choices: [
      { label: 'Judge wisely', test: { stat: 'buddhi', dc: 5 }, pass: [{ befriend: 'kekda' }, { gain: { mudra: 3 } }], passText: 'You find a second shell, just as nice, and give one to each. The council clacks in approval and presents you with a gold coin from a shipwreck.', fail: [], failText: 'Your verdict starts a crab riot.' },
      { label: 'Give the shell to the smaller crab', pass: [{ gain: { punya: 1 } }], passText: 'The big crab grumbles. The little one is so happy it does a sideways dance.' },
    ],
  },
  {
    id: 'coast_matsya', deck: 'encounter', art: '🧜', creature: 'matsya',
    title: 'Singers on the Rocks',
    text: 'Fish-tailed maidens sit on the rocks off the point, singing. Their song is so sweet that a fisherman is rowing straight toward the reef with a dreamy smile.',
    choices: [
      { label: 'Sing louder than them', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'matsya' }, { gain: { punya: 2 } }], passText: 'Your voice breaks their spell. The matsya-kanyas, startled, burst out laughing, and teach you a song for calling fish.', fail: [{ lose: { prana: 2 } }], failText: 'You start rowing toward the reef too.' },
      { label: 'Swim out and turn the boat', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { punya: 2, mudra: 2 } }], passText: 'You reach the boat just in time. The fisherman wakes up, horrified, and pays you in his catch.', fail: [{ lose: { prana: 3 } }], failText: 'The waves are too much.' },
    ],
  },
  {
    id: 'coast_timingila', deck: 'encounter', art: '🐋', creature: 'timingila',
    title: 'The Island That Breathed',
    text: 'You rest on a small, smooth, grey island just offshore. Then the island exhales. A fountain of spray. It’s not an island. It’s Timingila, the fish that swallows whales, and it is waking up.',
    choices: [
      { label: 'Stay perfectly still', test: { stat: 'buddhi', dc: 5 }, pass: [{ befriend: 'timingila' }, { gain: { punya: 1 } }], passText: 'It carries you gently along the coast for a mile and leaves you in a sheltered bay. You may be the first human it has ever not eaten.', fail: [{ lose: { prana: 3 } }], failText: 'It dives. You swim for your life.' },
      { label: 'Jump and swim for it', test: { stat: 'gati', dc: 5 }, pass: [], passText: 'You make the beach before it fully wakes.', fail: [{ lose: { prana: 3 } }], failText: 'Its wake rolls you up the beach like a pebble.' },
    ],
  },
  {
    id: 'coast_makara', deck: 'encounter', art: '🐲', creature: 'makara',
    title: 'Varuna’s Steed',
    text: 'In a tidal lagoon a creature with a crocodile’s head, an elephant’s trunk and a fish’s tail is snapping at the fishermen’s boats. It’s a Makara, and it seems to have a fishhook stuck in its lip.',
    choices: [
      { label: 'Remove the hook', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'makara' }, { gain: { punya: 2 } }], passText: 'It lets you, after much snapping. It leaves you a single shining scale: a gift from the stables of a god.', fail: [{ lose: { prana: 3 } }], failText: 'It does not let you.' },
      { label: 'Wrestle it still', test: { stat: 'shakti', dc: 7 }, pass: [{ befriend: 'makara' }, { stat: { shakti: 1 } }], passText: 'You get a headlock on a creature of myth. The fishermen get the hook out. The Makara seems to respect you.', fail: [{ lose: { prana: 4 } }], failText: 'You get a lesson in the strength of mythical creatures.' },
      { label: 'Warn the fishermen and move on', pass: [], passText: 'Probably wise.' },
    ],
  },

  // ---- hazards ----
  {
    id: 'coast_cyclone', deck: 'hazard', art: '🌀',
    title: 'Cyclone',
    text: 'The sky turns green. The palms bend flat. The sea rises in a grey wall and comes toward the land. Everyone is running for the temple on the hill.',
    choices: [
      { label: 'Help the old ones up the hill', test: { stat: 'shakti', dc: 6 }, pass: [{ gain: { punya: 3 } }], passText: 'You carry a grandmother on your back through the howling rain. Everyone is safe.', fail: [{ lose: { prana: 3 } }, { gain: { punya: 1 } }], failText: 'The wind throws you down twice, but you get her there.' },
      { label: 'Run for shelter', test: { stat: 'gati', dc: 5 }, pass: [], passText: 'You make it just before the surge.', fail: [{ lose: { prana: 4 } }], failText: 'The surge catches your legs.' },
    ],
  },
  {
    id: 'coast_riptide', deck: 'hazard', art: '🌊',
    title: 'The Rip',
    text: 'You’re wading in the shallows when the sea grabs your legs and pulls. In a breath you’re fifty yards out and moving fast.',
    choices: [
      { label: 'Swim parallel to the beach', test: { stat: 'buddhi', dc: 5 }, pass: [], passText: 'A fisherman told you this once. Out of the current, then in.', fail: [{ lose: { prana: 3 } }], failText: 'You fight it head on until you’re spent, and wash up a mile away.' },
      { label: 'Fight straight back', test: { stat: 'shakti', dc: 7 }, pass: [], passText: 'Pure stubbornness.', fail: [{ lose: { prana: 4 } }], failText: 'You can’t outswim the sea.' },
    ],
  },
  {
    id: 'coast_pirates', deck: 'hazard', art: '🏴',
    title: 'Pirates of the Malabar',
    text: 'A ship with a red sail is drawn up on the beach, and its crew are raiding the village. A pirate with a gold earring grabs your collar. "You’re not from here. Ransom!"',
    choices: [
      { label: 'Fight free', test: { stat: 'shakti', dc: 6 }, pass: [{ gain: { mudra: 4 } }], passText: 'You knock him into the surf and snatch his purse.', fail: [{ lose: { prana: 3, mudra: 3 } }], failText: 'They take your coins and throw you in the sea.' },
      { label: 'Talk your way out', test: { stat: 'buddhi', dc: 6 }, pass: [], passText: 'You convince him your family is poor and that your uncle is a famous pirate-hunter. He lets go fast.', fail: [{ lose: { mudra: 4 } }], failText: 'He doesn’t buy it.' },
      { label: 'Pay them off', requires: { mudra: 3 }, pass: [{ lose: { mudra: 3 } }], passText: 'Money talks.' },
    ],
  },

  // ---- mysteries ----
  {
    id: 'coast_glowing_sea', deck: 'mystery', art: '💙', when: { night: true },
    title: 'The Sea of Stars',
    text: 'On a moonless night, every wave breaks in electric blue light. Your footprints glow. When you wade in, your hands drip blue fire.',
    choices: [
      { label: 'Swim in the light', pass: [{ gain: { prana: 10, punya: 1 } }], passText: 'You swim through liquid stars. You will never quite believe this happened.' },
      { label: 'Sit and wonder', test: { stat: 'buddhi', dc: 5 }, pass: [{ stat: { buddhi: 1 } }, { gain: { pranaMax: 1 } }], passText: 'Tiny living things, a billion of them, making light together. You think about friends.', fail: [{ gain: { prana: 4 } }], failText: 'You don’t understand it at all. That’s fine.' },
    ],
  },
  {
    id: 'coast_dwarka', deck: 'mystery', art: '🏛️',
    title: 'The Drowned City',
    text: 'The tide goes out further than you have ever seen, and the sea floor shows walls, streets and a great gate. The fishermen whisper: Dwarka, Krishna’s golden city, taken by the sea when he left the world.',
    choices: [
      { label: 'Walk the drowned streets', test: { stat: 'gati', dc: 6 }, pass: [{ gain: { mudra: 8, punya: 1 } }], passText: 'You walk Krishna’s streets as the tide turns, and find a gold coin stamped with a flute. You make it back with water at your knees.', fail: [{ lose: { prana: 3 } }], failText: 'The tide returns like a horse at a gallop.' },
      { label: 'Watch from the shore', pass: [{ gain: { punya: 2 } }, { randomStat: 1 }], passText: 'You watch the city drown again, slowly, in the evening light. Somewhere, very faintly, you hear a flute.' },
    ],
  },

  // ---- shrine ----
  {
    id: 'coast_shrine', deck: 'shrine', art: '🌅',
    title: 'The Maiden at Land’s End',
    text: 'At the very tip of the land, where three seas meet, stands the temple of the virgin goddess, who waits forever on the shore for a bridegroom who never came. Her diamond nose-ring, they say, shines so bright that ships mistake it for a lighthouse.',
    choices: [
      { label: 'Watch the sun set and the moon rise together', pass: [{ gain: { prana: 4, punya: 1 } }], passText: 'From here you can watch both at once. The goddess has waited ten thousand years. Your journey suddenly feels short.' },
      { label: 'Light incense', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { randomStat: 1 }, { gain: { punya: 1 } }], passText: 'The smoke blows out over three seas.' },
    ],
  },
];
