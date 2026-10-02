export default [
  // ---- story ----
  {
    id: 'himalaya_intro', deck: 'intro', art: '🏔️',
    title: 'The Abode of Snow',
    text: 'Himalaya: the abode of snow. For days you’ve watched the white line on the northern horizon grow, and now you’re among the foothills and the mountains fill the sky. The air is thin and cold and so clean it hurts. Somewhere up there, past the last pass, is the road to Meru.',
    choices: [
      { label: 'Bow to the mountains', pass: [{ gain: { punya: 1, prana: 2 } }], passText: 'An old porter sees you bow and nods approvingly. "They notice," he says.' },
      { label: 'Climb fast while you’re fresh', pass: [{ buff: { stat: 'any', amount: 2 } }], passText: 'You set off at a brisk pace. The mountains don’t care how fast you go.' },
    ],
  },
  {
    id: 'himalaya_manasa', deck: 'landmark', art: '🦢', creature: 'hamsa',
    title: 'Lake Manasa',
    text: 'The sacred lake, born from the mind of Brahma. It is so blue that the sky looks pale beside it. Snow peaks stand in its mirror upside-down. And on the water float swans, larger and whiter than any swan should be: the Hamsa, birds of the gods, who can separate milk from water and truth from lies.',
    choices: [
      { label: 'Bathe in the icy water', test: { stat: 'shakti', dc: 5 }, pass: [{ gain: { prana: 10, punya: 2 } }], passText: 'The cold stops your heart, then restarts it brand new.', fail: [{ gain: { prana: 4 } }], failText: 'You last three seconds. It was still worth it.' },
      { label: 'Speak only truth to the swans', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'hamsa' }, { stat: { karuna: 1 } }, { gain: { punya: 1 } }], passText: 'You tell them everything: your fears, your mistakes, why you really left home. They listen without judgement. When you finish, one lays its neck along your shoulder.', fail: [{ gain: { prana: 3 } }], failText: 'You can’t quite bring yourself to say it all. The swans drift away, unoffended.' },
    ],
  },
  {
    id: 'himalaya_cliff', deck: 'landmark', art: '🧗',
    title: 'Garuda’s Cliff',
    text: 'A wall of rock falls away beneath you, a mile straight down into cloud. Eagles hang in the updraft below you. This is where Garuda, king of birds, is said to have perched before stealing the nectar of immortality from the gods.',
    choices: [
      { label: 'Tarkshya, it’s time to fly', hide: { companion: 'tarkshya' }, pass: [{ setFlag: 'tarkshya_soared' }], passText: 'He stands at the edge for a long time, trembling. "What if I can’t?" "Then I’ll catch you," you lie. He jumps. He falls, and falls, and then his wings snap open and he is soaring, screaming with joy, over the whole Himalaya.' },
      { label: 'Sit on the edge and look', pass: [{ gain: { prana: 3 } }, { buff: { stat: 'any', amount: 2 } }], passText: 'You can see the whole road you’ve walked, a thin thread winding back into the haze. It’s very far.' },
    ],
  },
  {
    id: 'himalaya_bell_recast', deck: 'visit', art: '🔔',
    when: { hasItem: 'bronze', quest: 'q_bell' },
    title: 'The Bell Sings Again',
    text: 'The abbot holds the bronze up to the light and smiles all the way to his ears. The monks build a fire in the courtyard and melt the old cracked bell with your bronze, chanting all night.',
    choices: [{ label: 'Ring the new bell', pass: [{ removeItem: 'bronze' }, { setFlag: 'bell_recast' }], passText: 'BONNNNG. The note rolls out across the valleys. Far away, an echo, and then another, as if the mountains are answering.' }],
  },
  {
    id: 'himalaya_kesar', deck: 'visit', art: '📿',
    when: { companion: 'kesar', notFlag: 'kesar_ending' },
    title: 'The Old Nun',
    text: 'At the monastery, an ancient nun with one tooth is spinning a prayer wheel. Kesar sits beside her and starts, hesitantly, to tell "The Girl Who Walked to the Sky." The nun’s hands stop. "My grandmother told me that story," she says. "Do you want to know how it ends?"',
    choices: [{ label: 'Listen with Kesar', pass: [{ setFlag: 'kesar_ending' }], passText: 'You will not write the ending here. It belongs to Kesar. But she cries, and laughs, and that night she tells you the whole story from beginning to end, and it is the most beautiful thing you have ever heard.' }],
  },
  {
    id: 'himalaya_gate', deck: 'gate', art: '❄️',
    title: 'The Snow-Lotus Gate',
    text: 'At the top of the last pass stands a gate of blue ice, and before it lies a lion as big as a yak, white as snow, with a mane of turquoise flames. Behind the gate, frozen in the ice, is a single lotus of glass: the Snow-Lotus Key. The lion opens one eye. "Beyond this gate is the road to Meru. Everyone who comes here wants to pass. Few should."',
    choices: [
      { label: 'Climb the ice wall beside the gate', test: { stat: 'shakti', dc: 8 }, pass: [{ token: 'snow_key' }, { completeRegion: true }], passText: 'You climb with frozen fingers. At the top the lion is waiting, amused. It breathes on the ice and the lotus falls free into your hand.', fail: [{ lose: { prana: 3 } }, { moveBack: 2 }], failText: 'You fall into a snowdrift. The lion watches without comment.' },
      { label: 'Sit with the lion in silence', test: { stat: 'karuna', dc: 7 }, pass: [{ token: 'snow_key' }, { befriend: 'simha' }, { completeRegion: true }], passText: 'You sit beside it all through the freezing night. At dawn it rises, touches its nose to your forehead and opens the gate.', fail: [{ lose: { prana: 3 } }, { moveBack: 2 }], failText: 'The cold defeats you before the silence does.' },
      { label: 'Answer the lion’s question', test: { stat: 'buddhi', dc: 7 }, pass: [{ token: 'snow_key' }, { completeRegion: true }], passText: '"Why do you want to see the world as it truly is?" You think of everyone you’ve met. "So I can love it properly." The lion is silent a long time. Then it opens the gate.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'Your answer is about you. The lion closes its eye.' },
      { label: 'Wrap up warm and outlast the cold', requires: { hasItem: 'shawl' }, test: { stat: 'shakti', dc: 6 }, pass: [{ token: 'snow_key' }, { completeRegion: true }], passText: 'In your pashmina you wait out the lion’s patience. At last it snorts with laughter and lets you through.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'Even the best shawl has limits.' },
      { label: 'Sur sings to the snow lion', hide: { companion: 'sur' }, pass: [{ token: 'snow_key' }, { befriend: 'simha' }, { completeRegion: true }], passText: 'Sur sings, and the snow lion’s ears go up, and then it begins to rumble along, a sound like a glacier purring. The ice gate melts like sugar.' },
    ],
  },

  // ---- companion story ----
  {
    id: 'himalaya_tarkshya', deck: 'event', art: '🦅', once: true, weight: 8,
    when: { companion: 'tarkshya', notFlag: 'tarkshya_soared' },
    title: 'The Updraft',
    text: 'On a high ridge the wind roars up from the valley, strong enough to lean on. Tarkshya stands on the edge, feathers ruffling, and looks at you. "This is it, isn’t it?"',
    choices: [
      { label: '"You were born for this."', test: { stat: 'karuna', dc: 4 }, pass: [{ setFlag: 'tarkshya_soared' }], passText: 'He jumps. The wind takes him, and he SOARS, a golden speck circling higher and higher. When he lands he can’t speak. He just holds onto you.', fail: [{ setFlag: 'tarkshya_soared' }, { lose: { prana: 2 } }], failText: 'He jumps, flails, and you dive to grab his foot. You both nearly go over. Then his wings catch the wind and he hauls you both up. He flew! Sort of! He flew!' },
    ],
  },
  {
    id: 'himalaya_kinnara', deck: 'encounter', art: '🎶', creature: 'kinnara', once: true, weight: 6,
    when: { notCompanion: 'sur' },
    title: 'The Lonely Singer',
    text: 'In an alpine meadow full of blue poppies, Kinnara musicians are dancing in pairs: bird-winged, human-faced, always in couples. All but one. She sits apart, singing half of a duet, leaving gaps where another voice should be.',
    choices: [
      { label: 'Sing the other half', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'kinnara' }, { recruit: 'sur' }], passText: 'Your voice is nothing like her lost partner’s, but you fill the gaps. When you finish she’s weeping. "I am Sur. He died in the snow. I want to sing his song at the top of the world. Will you take me?"', fail: [{ befriend: 'kinnara' }], failText: 'You can’t find the melody. She smiles sadly and thanks you.' },
      { label: 'Ask her why she sings alone', test: { stat: 'buddhi', dc: 4 }, pass: [{ befriend: 'kinnara' }, { recruit: 'sur' }], passText: 'She tells you about the avalanche, and the song. "You are going to Meru? Then I am going with you."', fail: [], failText: 'She doesn’t want to talk about it.' },
    ],
  },

  // ---- events ----
  {
    id: 'himalaya_bronze', deck: 'event', art: '🔔', once: true, weight: 8,
    when: { quest: 'q_bell', notItem: 'bronze', notFlag: 'bell_recast' },
    title: 'The Buried Shrine',
    text: 'A landslide has torn open a hillside, and in the rubble you see the green gleam of old bronze: the remains of a wayside shrine buried centuries ago. A broken temple bell lies among the stones.',
    choices: [
      { label: 'Dig out the bronze', test: { stat: 'shakti', dc: 4 }, pass: [{ addItem: 'bronze' }], passText: 'It hums faintly as you lift it, as though it remembers being a bell.', fail: [{ addItem: 'bronze' }, { lose: { prana: 2 } }], failText: 'The slope shifts and you slide with it, but you hang on to the bronze.' },
    ],
  },
  {
    id: 'himalaya_flags', deck: 'event', art: '🎏',
    title: 'Prayer Flags',
    text: 'Strings of flags in five colours snap and flutter across the pass. Each is printed with a prayer, and every time the wind moves them, the prayer is said. The whole mountainside is praying.',
    choices: [
      { label: 'Hang your own flag', requires: { mudra: 1 }, pass: [{ lose: { mudra: 1 } }, { gain: { punya: 2 } }, { shield: true }], passText: 'You write the names of everyone you love on it. The wind takes the prayer instantly.' },
      { label: 'Rest under them', pass: [{ gain: { prana: 2 } }], passText: 'The sound is like a hundred birds taking off at once, forever.' },
    ],
  },
  {
    id: 'himalaya_hotspring', deck: 'event', art: '♨️',
    title: 'The Hot Spring',
    text: 'Steam rises from a pool among the rocks. The water is blood-warm, smells of sulphur, and is ringed with snow.',
    choices: [{ label: 'Soak your aching bones', pass: [{ gain: { prana: 6 } }], passText: 'Your toes thaw. Your shoulders thaw. You thaw.' }],
  },
  {
    id: 'himalaya_herders', deck: 'event', art: '🐂', creature: 'yak',
    title: 'The Yak Herders',
    text: 'A family of herders is moving their yaks to summer pasture. One shaggy yak has wandered onto a ledge and won’t come down.',
    choices: [
      { label: 'Coax it down', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'yak' }, { gain: { anna: 3 } }, { addItem: 'shawl' }], passText: 'It follows you down like a puppy. The family gives you yak-butter tea, tsampa, and an old shawl.', fail: [{ lose: { prana: 1 } }, { gain: { anna: 1 } }], failText: 'It comes down on its own, eventually. They feed you anyway.' },
      { label: 'Haul it down', test: { stat: 'shakti', dc: 6 }, pass: [{ befriend: 'yak' }, { gain: { anna: 3, mudra: 2 } }], passText: 'You and a yak have a contest of wills. You win, narrowly.', fail: [{ lose: { prana: 3 } }], failText: 'You and a yak have a contest of wills. The yak wins.' },
    ],
  },
  {
    id: 'himalaya_mani', deck: 'event', art: '🪨',
    title: 'The Mani Stone Carver',
    text: 'An old man sits by a wall of carved stones, chiselling the same six syllables into another, as he has every day for fifty years. "Om mani padme hum." He offers you the chisel.',
    choices: [
      { label: 'Carve a stone with him', test: { stat: 'buddhi', dc: 4 }, pass: [{ gain: { punya: 2 } }, { stat: { buddhi: 1 } }], passText: 'It takes you all day to carve one stone. He says you’ve understood something important. You’re not sure what, but you feel it too.', fail: [{ gain: { punya: 1 } }], failText: 'You chip off more than you carve. He laughs and keeps it anyway.' },
      { label: 'Ask him why', pass: [{ gain: { prana: 2 } }, { buff: { stat: 'buddhi', amount: 2 } }], passText: '"So that when I die, the mountain keeps praying for me." He shrugs. "Also I like it."' },
    ],
  },
  {
    id: 'himalaya_cham', deck: 'event', art: '👺',
    title: 'The Masked Dance',
    text: 'In a monastery courtyard, monks in huge painted masks of skulls, stags and wrathful deities are dancing to long horns and cymbals: the Cham, a dance to destroy evil.',
    choices: [
      { label: 'Join the crowd', pass: [{ gain: { prana: 2, anna: 2 } }], passText: 'There’s a feast afterwards. There’s always a feast.' },
      { label: 'Volunteer to carry a mask', test: { stat: 'shakti', dc: 5 }, pass: [{ gain: { punya: 2 } }, { buff: { stat: 'shakti', amount: 2 } }], passText: 'The mask is heavier than a child. You dance a little, by accident. The abbot blesses you.', fail: [{ gain: { prana: 1 } }], failText: 'You can’t see out of it and walk into a pillar.' },
    ],
  },

  // ---- encounters ----
  {
    id: 'himalaya_snowlion', deck: 'encounter', art: '🦁', creature: 'simha',
    title: 'Turquoise Mane',
    text: 'On a high ridge, against the sky, stands a lion of the snows, mane like blue fire. It roars, and far across the valley a cornice of snow breaks off and thunders down.',
    choices: [
      { label: 'Roar back', test: { stat: 'shakti', dc: 7 }, pass: [{ befriend: 'simha' }, { stat: { shakti: 1 } }], passText: 'Your roar is pathetic, but brave. The snow lion seems to laugh, and leaps down to walk beside you a while.', fail: [{ lose: { prana: 2 } }], failText: 'Your roar sets off a small avalanche on you.' },
      { label: 'Bow low', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'simha' }, { gain: { punya: 2 } }], passText: 'It bows its great head in return. Snow lions only bow to the fearless.', fail: [], failText: 'It turns and disappears over the ridge.' },
    ],
  },
  {
    id: 'himalaya_yeti', deck: 'encounter', art: '❄️', creature: 'yeti',
    title: 'Footprints in the Snow',
    text: 'Enormous footprints, twice as long as yours, lead round a boulder. Behind it, something huge and shaggy is crouching, covering its face. It’s... shy?',
    choices: [
      { label: 'Sit down and wait', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'yeti' }, { gain: { anna: 3, prana: 2 } }], passText: 'After an hour a big hairy hand pushes a pile of wild berries toward you. You share them. It’s the most awkward and lovely meal of your life.', fail: [], failText: 'It runs off, leaving a perfect cloud of snow.' },
      { label: 'Leave it a gift of food', requires: { anna: 1 }, pass: [{ lose: { anna: 1 } }, { befriend: 'yeti' }, { gain: { punya: 1 } }], passText: 'In the morning your food is gone and a beautiful crystal sits in its place.' },
    ],
  },
  {
    id: 'himalaya_leopard', deck: 'encounter', art: '🐆', creature: 'hima_chita',
    title: 'The Grey Ghost',
    text: 'You feel watched. On a rock just above you, grey on grey, a snow leopard is crouched, its thick tail curled around its feet. Its eyes are pale green. It hasn’t decided about you yet.',
    choices: [
      { label: 'Meet its eyes, calm', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'hima_chita' }, { gain: { punya: 2 } }], passText: 'It blinks slowly, which in cat means friend. Then it’s gone.', fail: [{ lose: { prana: 3 } }], failText: 'It springs. Claws graze you, and it’s gone.' },
      { label: 'Back away quickly', test: { stat: 'gati', dc: 5 }, pass: [], passText: 'It lets you go.', fail: [{ lose: { prana: 2 } }], failText: 'You slip on scree.' },
    ],
  },
  {
    id: 'himalaya_hermit', deck: 'encounter', art: '🧙',
    title: 'The Cave Yogi',
    text: 'In a cave above the snowline sits a yogi wearing nothing but a loincloth, completely warm, ice melting around him. He has not eaten in years, he says. He opens one eye. "Ah. The traveller with the map. I knew your rishi."',
    choices: [
      { label: 'Ask him to teach you', test: { stat: 'buddhi', dc: 6 }, pass: [{ randomStat: 1 }, { gain: { pranaMax: 2 } }], passText: 'He teaches you the inner fire, the breath that warms. You will never be truly cold again.', fail: [{ gain: { prana: 3 } }], failText: 'You can’t still your mind. He lets you sit by his warmth anyway.' },
      { label: 'Ask about Rishi Atreya', pass: [{ gain: { punya: 1 } }, { buff: { stat: 'any', amount: 3 } }], passText: '"He came here too, at your age. He turned back at the snow gate. He was not a coward, only alone." The yogi looks at you. "You are not alone."' },
    ],
  },
  {
    id: 'himalaya_hamsa', deck: 'encounter', art: '🦢', creature: 'hamsa',
    title: 'The Judging Swan',
    text: 'A great white swan lands in front of you, blocking the trail. It tilts its head and looks right into you, the way a jeweller looks at a stone.',
    choices: [
      { label: 'Stand still and be seen', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'hamsa' }, { gain: { prana: 4, punya: 1 } }], passText: 'Whatever it sees, it approves. It walks with you a mile, then flies toward Manasa.', fail: [], failText: 'It looks unimpressed and flies away.' },
      { label: 'Offer it water and milk', requires: { hasItem: 'milk' }, pass: [{ removeItem: 'milk' }, { befriend: 'hamsa' }, { stat: { buddhi: 1 } }], passText: 'It drinks only the milk and leaves the water in the bowl, perfectly separated. You understand something about choosing.' },
    ],
  },
  {
    id: 'himalaya_garuda_elder', deck: 'encounter', art: '🦅', creature: 'garuda',
    title: 'The King of Birds',
    text: 'A shadow covers the whole valley. A Garuda, a full-grown one, lands on a crag in a storm of wind. Its feathers are gold and red. It looks down at you with eyes like suns.',
    choices: [
      { label: 'Introduce Tarkshya', hide: { companion: 'tarkshya' }, pass: [{ gain: { punya: 2 } }, { addItem: 'feather' }], passText: '"Grandfather!" squawks Tarkshya. The great Garuda inspects him, then you. "You have kept my grandson alive. That is not easy." He drops a golden feather at your feet.' },
      { label: 'Speak with respect', test: { stat: 'karuna', dc: 6 }, pass: [{ befriend: 'garuda' }, { gain: { prana: 10 } }], passText: 'He beats his wings once, and the wind fills you with strength.', fail: [], failText: 'He leaps into the sky and is gone.' },
    ],
  },

  // ---- hazards ----
  {
    id: 'himalaya_avalanche', deck: 'hazard', art: '🏔️',
    title: 'Avalanche!',
    text: 'A sound like a gunshot high above. Then a roar. Half the mountainside is coming down toward you in a white wave.',
    choices: [
      { label: 'Run sideways', test: { stat: 'gati', dc: 6 }, pass: [], passText: 'You sprint across the slope and the snow thunders past behind you.', fail: [{ lose: { prana: 4 } }, { moveBack: 1 }], failText: 'It catches your legs and carries you down.' },
      { label: 'Shelter behind a boulder', test: { stat: 'buddhi', dc: 6 }, pass: [], passText: 'The snow splits around the rock. You dig yourself out.', fail: [{ lose: { prana: 4 } }], failText: 'Wrong boulder.' },
    ],
  },
  {
    id: 'himalaya_frost', deck: 'hazard', art: '🥶',
    title: 'The Killing Cold',
    text: 'The wind on the pass cuts through everything you’re wearing. Your fingers go white, then grey. A traveller’s body lies frozen beside the trail, smiling.',
    choices: [
      { label: 'Wrap yourself in your shawl', requires: { hasItem: 'shawl' }, pass: [], passText: 'Warm wool, close to your skin. You keep walking.' },
      { label: 'Keep moving no matter what', test: { stat: 'shakti', dc: 6 }, pass: [{ lose: { prana: 1 } }], passText: 'You stamp and swing your arms for hours. You live.', fail: [{ lose: { prana: 4 } }], failText: 'You stumble into the next shelter barely conscious.' },
    ],
  },
  {
    id: 'himalaya_crevasse', deck: 'hazard', art: '🕳️',
    title: 'Crevasse',
    text: 'The snow under your feet gives way with a soft whump. You’re hanging by your arms over a blue crack in the glacier with no bottom.',
    choices: [
      { label: 'Use your rope', requires: { hasItem: 'rope' }, pass: [], passText: 'You loop the rope over an ice horn and climb out.' },
      { label: 'Haul yourself up', test: { stat: 'shakti', dc: 7 }, pass: [], passText: 'Inch by inch, onto the ice.', fail: [{ lose: { prana: 5 } }], failText: 'You slip further before catching a ledge. It takes hours to climb out.' },
      { label: 'Swing to the far edge', test: { stat: 'gati', dc: 6 }, pass: [], passText: 'One swing. Two. Land.', fail: [{ lose: { prana: 4 } }], failText: 'Close. Not close enough.' },
    ],
  },

  // ---- mysteries ----
  {
    id: 'himalaya_gyanganj', deck: 'mystery', art: '🌄',
    title: 'The Hidden Valley',
    text: 'You follow a stream through a crack in the rock and come out into a valley that should not exist: green, warm, full of fruit trees and flowers, with snow peaks all around. Ancient sages walk here who look no older than thirty. This is Gyanganj, the hidden land of the immortals.',
    choices: [
      { label: 'Stay a while', pass: [{ gain: { prana: 20, anna: 4, pranaMax: 2 } }], passText: 'You stay what feels like a day. When you leave, the snow is a month deeper. You feel like you could walk forever.' },
      { label: 'Ask the immortals for wisdom', test: { stat: 'buddhi', dc: 6 }, pass: [{ stat: { buddhi: 1, karuna: 1 } }], passText: 'One of them sits with you by a stream. What she tells you, you can’t repeat. But you understand it.', fail: [{ gain: { prana: 6 } }], failText: 'They smile and give you fruit.' },
    ],
  },
  {
    id: 'himalaya_mirror', deck: 'mystery', art: '🪞',
    title: 'The Ice Mirror',
    text: 'Deep in a blue ice cave there is a wall as smooth as glass. Your reflection in it is you, but older. Much older. The reflection is smiling, and wants to tell you something.',
    choices: [
      { label: 'Listen to your older self', pass: [{ gain: { punya: 2 } }, { randomStat: 1 }], passText: '"It was worth it," says the old you. "All of it. Keep going." When you look again, it’s only ice.' },
      { label: 'Walk away', pass: [{ gain: { prana: 2 } }], passText: 'Some things you’d rather find out for yourself.' },
    ],
  },

  // ---- shrine ----
  {
    id: 'himalaya_shrine', deck: 'shrine', art: '🛕',
    title: 'The Stone Temple in the Snow',
    text: 'At the head of the valley, among glaciers, a squat stone temple a thousand years old. Pilgrims walk weeks to reach it, some on their knees. Inside, butter lamps flicker around a natural rock shaped like a bull’s hump.',
    choices: [
      { label: 'Pray with the pilgrims', pass: [{ gain: { prana: 5, punya: 1 } }], passText: 'Their chanting warms the frozen air.' },
      { label: 'Light incense', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { randomStat: 1 }, { gain: { punya: 2 } }], passText: 'At the top of the world, smoke rises very straight.' },
    ],
  },
];
