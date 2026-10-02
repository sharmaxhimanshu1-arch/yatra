export default [
  // ---- story ----
  {
    id: 'ganga_intro', deck: 'intro', art: '🗺️',
    title: 'The Half-Burnt Map',
    text: 'Old Rishi Atreya has lived under Sonpur’s neem tree for longer than anyone remembers. Tonight he called for you, and only you. With shaking hands he gives you a map, its edges blackened by fire. "Five lands," he whispers. "Five sacred tokens. And beyond them, Meru, the mountain at the centre of everything. Whoever stands on it sees the world as it truly is. I was too afraid to go. Don’t be." By morning the rishi is gone. Your mother presses a box of laddoos into your hands. At the edge of the village, Moti the spotted dog is waiting, tail thumping.',
    choices: [
      { label: 'Let Moti come along', pass: [{ recruit: 'moti' }, { befriend: 'dog' }], passText: 'Moti barks once, as if to say "obviously," and trots ahead of you down the road.' },
      { label: 'Send Moti home', pass: [{ gain: { punya: 1 } }], passText: 'Moti whines, then sits. You don’t look back. A good dog should guard the village, you tell yourself.' },
    ],
  },
  {
    id: 'ganga_banyan', deck: 'landmark', art: '🌳',
    title: 'The Thousand-Root Banyan',
    text: 'The tree is so vast that a market, a school and three shrines fit under its branches. Old men play pachisi in its shade, and children swing from the hanging roots. Someone has tied ten thousand red threads around its trunk, each one a wish.',
    choices: [
      { label: 'Rest in the shade', pass: [{ gain: { prana: 3 } }], passText: 'You sleep like a child. When you wake someone has left a cup of tea beside you.' },
      { label: 'Join the pachisi game', test: { stat: 'buddhi', dc: 4 }, pass: [{ gain: { mudra: 4 } }], passText: 'You roll the cowries and win! The old men grumble and pay up.', fail: [{ lose: { mudra: 1 } }], failText: 'The old men have been playing for sixty years. You never stood a chance.' },
      { label: 'Tie a thread and make a wish', pass: [{ gain: { punya: 1 } }, { buff: { stat: 'any', amount: 2 } }], passText: 'You wish to come back home someday, changed. The tree rustles, though there is no wind.' },
    ],
  },
  {
    id: 'ganga_sangam', deck: 'landmark', art: '🌊',
    title: 'The Sangam',
    text: 'Here the muddy Ganga and the blue Yamuna meet, and the priests say the hidden river Saraswati rises from below to join them. Pilgrims wade out on wooden platforms. The water is cold and the air smells of marigolds.',
    choices: [
      { label: 'Take a dip at the confluence', pass: [{ gain: { prana: 10, punya: 2 } }], passText: 'The cold takes your breath. When you surface you feel washed clean of everything, even the dust of the road.' },
      { label: 'Ask a priest about Meru', test: { stat: 'karuna', dc: 4 }, pass: [{ stat: { buddhi: 1 } }], passText: 'The priest draws the world in wet sand: seven island-continents in rings, with Meru at the centre like the seed of a lotus. "Its roots are in the underworld," he says, "and its peak is in heaven. Go carefully."', fail: [{ gain: { prana: 1 } }], failText: 'The priest is busy with a hundred pilgrims. He gives you a sweet and a blessing, and that is something.' },
    ],
  },
  {
    id: 'ganga_calf_return', deck: 'visit', art: '🐄',
    when: { flag: 'calf_found', notFlag: 'calf_returned' },
    title: 'Gauri Comes Home',
    text: 'The moment Gauri hears her family’s voices she breaks into a clumsy run, bell clanging. A little girl throws her arms around the calf’s neck and won’t let go.',
    choices: [{ label: 'Accept their thanks', pass: [{ setFlag: 'calf_returned' }], passText: 'They make you stay for dinner. You eat four rotis and are threatened with a fifth.' }],
  },
  {
    id: 'ganga_gate', deck: 'gate', art: '⛵',
    title: 'Kevat’s Ferry',
    text: 'The river here is a mile wide and the colour of tea. Kevat the ferryman, whose ancestor once ferried Lord Rama himself, leans on his pole. "The forests of Dandaka are on the far bank," he says. "I don’t take just anyone. Give me a reason."',
    choices: [
      { label: 'Pay the fare (4 Mudra)', requires: { mudra: 4 }, pass: [{ lose: { mudra: 4 } }, { token: 'lotus_seed' }, { completeRegion: true }], passText: 'Kevat pockets the coins. Halfway across, a pink lotus floats up against the hull. He scoops it out and hands you the seed-pod from its heart. "The river wants you to have this. Rare thing. Keep it."' },
      { label: 'Tell him why you travel', test: { stat: 'karuna', dc: 4 }, pass: [{ token: 'lotus_seed' }, { completeRegion: true }, { gain: { punya: 1 } }], passText: 'He listens to the whole story, then laughs. "A dead rishi’s map! My grandfather would have loved you. Get in." Mid-river he fishes a lotus seed from the water and presses it into your palm.', fail: [{ lose: { prana: 1 } }, { moveBack: 2 }], failText: '"Everyone has a story," he shrugs. "Come back with a better one, or with coins."' },
      { label: 'Offer to pole the boat', test: { stat: 'shakti', dc: 5 }, pass: [{ token: 'lotus_seed' }, { completeRegion: true }], passText: 'Your arms burn but the boat glides true. Kevat nods, impressed, and gives you the lotus seed he found tangled in the pole.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'The current spins the boat back to shore. Kevat is laughing too hard to help.' },
      { label: 'Answer the river’s riddle', test: { stat: 'buddhi', dc: 5 }, pass: [{ token: 'lotus_seed' }, { completeRegion: true }], passText: '"What flows but never leaves?" You answer: "Time, and this river." He grins and pulls a lotus seed from behind your ear like a street magician.', fail: [{ lose: { prana: 1 } }, { moveBack: 2 }], failText: 'Wrong. "Think on it a while," he says, and pushes off without you.' },
    ],
  },

  // ---- events ----
  {
    id: 'ganga_wedding', deck: 'event', art: '💃',
    title: 'A Wedding Procession',
    text: 'Drums! Trumpets! A groom on a white horse, a brass band out of tune, and two hundred relatives dancing in the dust. Someone grabs your hand and pulls you into the baraat.',
    choices: [
      { label: 'Dance like nobody’s watching', test: { stat: 'gati', dc: 4 }, pass: [{ gain: { anna: 3, punya: 1 } }], passText: 'You dance so well the groom’s uncle adopts you on the spot. You are fed until you can barely walk.', fail: [{ gain: { anna: 1 } }], failText: 'You trip over a trumpet player. Everyone cheers anyway and someone hands you a samosa.' },
      { label: 'Help carry the bride’s palanquin', test: { stat: 'shakti', dc: 4 }, pass: [{ gain: { mudra: 3 } }], passText: 'The bride’s father presses three coins into your hand. "For strong shoulders."', fail: [{ lose: { prana: 1 } }], failText: 'The palanquin is heavier than it looks. Your back will remember this wedding.' },
      { label: 'Slip away quietly', pass: [], passText: 'You leave them to their joy. The drums follow you for a mile.' },
    ],
  },
  {
    id: 'ganga_mango', deck: 'event', art: '🥭',
    title: 'The Mango Orchard',
    text: 'Rows of ancient mango trees, branches bowed with golden fruit. A sleepy watchman dozes on a charpai at the far end.',
    choices: [
      { label: 'Wake the watchman and ask', test: { stat: 'karuna', dc: 3 }, pass: [{ gain: { anna: 3 } }], passText: '"Take, take, there are too many anyway," he yawns, and fills your cloth.', fail: [{ gain: { anna: 1 } }], failText: 'He is grumpy about being woken, but gives you one mango to go away.' },
      { label: 'Climb a tree quietly', test: { stat: 'gati', dc: 4 }, pass: [{ gain: { anna: 4 } }, { lose: { punya: 1 } }], passText: 'The sweetest mangoes are always the stolen ones. Your conscience twinges.', fail: [{ lose: { prana: 2 } }], failText: 'A branch snaps. The watchman’s dogs are very awake. You run.' },
      { label: 'Walk on', pass: [], passText: 'The smell follows you for a long time.' },
    ],
  },
  {
    id: 'ganga_storyteller', deck: 'event', art: '📖',
    title: 'The Kathakar',
    text: 'Under a peepal tree, a storyteller with a painted scroll is telling the tale of the Ramayana to a crowd of children and goats. He unrolls the next panel: a monkey leaping across the ocean.',
    choices: [
      { label: 'Listen closely', test: { stat: 'buddhi', dc: 4 }, pass: [{ stat: { buddhi: 1 } }], passText: 'You notice things in the story you never noticed before: how every hero needed friends. You walk away wiser.', fail: [{ gain: { prana: 1 } }], failText: 'You fall asleep halfway through, but it is the best nap you’ve had in days.' },
      { label: 'Drop a coin in his bowl', requires: { mudra: 1 }, pass: [{ lose: { mudra: 1 } }, { gain: { punya: 1, prana: 2 } }], passText: 'He winks and adds a verse about a brave traveller with a half-burnt map. The children stare at you.' },
    ],
  },
  {
    id: 'ganga_kites', deck: 'event', art: '🪁',
    title: 'Kite Festival',
    text: 'It is Sankranti! The sky is full of paper kites, and on every rooftop people are trying to cut each other’s strings. A boy offers you his spare kite.',
    choices: [
      { label: 'Join the kite battle', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { mudra: 4 } }, { gain: { punya: 1 } }], passText: 'You cut eleven kites and become a local legend. The rooftop pays out its bets in coins and sesame sweets.', fail: [{ lose: { mudra: 1 } }], failText: 'Your kite is cut in eight seconds. You owe the boy a coin.' },
      { label: 'Help the children make kites', pass: [{ gain: { prana: 2, anna: 1 } }], passText: 'Glue, paper and laughter. They share their til-gud ladoos with you.' },
    ],
  },
  {
    id: 'ganga_rain', deck: 'event', art: '🌧️', creature: 'mayura',
    title: 'The First Rain',
    text: 'The sky turns the colour of a bruise. Then the first monsoon rain comes down, fat warm drops on burning earth, and the whole land smells of hope. In the field beside you a peacock spreads its tail and begins to dance.',
    choices: [
      { label: 'Dance with the peacock', test: { stat: 'karuna', dc: 4 }, pass: [{ befriend: 'mayura' }, { gain: { prana: 3 } }], passText: 'You dance in the rain until you’re soaked to the bone. The peacock drops a single feather at your feet before it leaves.', fail: [{ gain: { prana: 1 } }], failText: 'The peacock eyes you with deep contempt and struts off. The rain still feels wonderful.' },
      { label: 'Shelter and watch', pass: [{ gain: { prana: 2 } }], passText: 'You sit under an awning and watch the world turn green before your eyes.' },
    ],
  },
  {
    id: 'ganga_pilgrims', deck: 'event', art: '🙏',
    title: 'Pilgrims to Kashi',
    text: 'A family of pilgrims is walking to the holy city. Grandmother rides in a cart. They have walked for a month and their food bag is nearly empty, but they still invite you to sit with them.',
    choices: [
      { label: 'Share your food', requires: { anna: 1 }, pass: [{ lose: { anna: 1 } }, { gain: { punya: 2 } }], passText: 'The grandmother blesses you with both hands on your head. You feel it in your bones for days.' },
      { label: 'Join their evening prayer', pass: [{ gain: { prana: 2 } }], passText: 'Their bhajans are off-key and beautiful.' },
      { label: 'Ask about the road ahead', test: { stat: 'buddhi', dc: 4 }, pass: [{ buff: { stat: 'any', amount: 2 } }], passText: 'The grandfather walked this road sixty years ago and remembers every turn. His advice will help you.', fail: [], failText: 'Grandfather’s memories are mostly about a cow he once owned.' },
    ],
  },
  {
    id: 'ganga_calf_found', deck: 'event', art: '🔔',
    when: { quest: 'q_calf', notFlag: 'calf_found' }, once: true, weight: 6,
    title: 'A Bell with a Red Thread',
    text: 'You hear a small, sad bell. In a muddy irrigation ditch a white calf is stuck up to her knees, a red thread tied round her bell. Gauri!',
    choices: [
      { label: 'Haul her out', test: { stat: 'shakti', dc: 4 }, pass: [{ setFlag: 'calf_found' }, { befriend: 'gaja' }], passText: 'With one heave, Gauri pops out of the mud like a cork. A temple elephant passing by trumpets approval and sprays you both clean.', fail: [{ setFlag: 'calf_found' }, { lose: { prana: 2 } }], failText: 'You both end up covered in mud, but Gauri is free and follows you happily.' },
      { label: 'Coax her out gently', test: { stat: 'karuna', dc: 3 }, pass: [{ setFlag: 'calf_found' }], passText: 'You talk to her softly and she picks her way out, one hoof at a time.', fail: [{ setFlag: 'calf_found' }, { lose: { prana: 1 } }], failText: 'She panics and kicks, but eventually she’s out.' },
    ],
  },

  // ---- encounters ----
  {
    id: 'ganga_vanara', deck: 'encounter', art: '🐒', creature: 'vanara',
    when: { notCompanion: 'hanu' }, once: true, weight: 5,
    title: 'The Thief in the Tamarind',
    text: 'A blur of fur, and your food bundle is gone! Up in a tamarind tree a young monkey in a tiny red waistcloth is eating your roti and grinning. "Too slow, plains-walker! I am Hanu of the Kishkindha Vanaras, and I am very hungry and only slightly lost."',
    choices: [
      { label: 'Chase him through the branches', test: { stat: 'gati', dc: 5 }, pass: [{ befriend: 'vanara' }, { recruit: 'hanu' }], passText: 'You actually catch his tail. Hanu is so impressed that he swears a life-debt. "No plains-walker has ever caught me! I will come with you, until you’re fast enough to need me less."', fail: [{ lose: { anna: 1 } }], failText: 'He bounces off three trees and disappears, still laughing.' },
      { label: 'Offer him a laddoo', requires: { hasItem: 'laddoo' }, pass: [{ removeItem: 'laddoo' }, { befriend: 'vanara' }, { recruit: 'hanu' }, { gain: { punya: 1 } }], passText: 'His eyes go wide. "You give food to a thief? You are either a saint or a fool. I will come along and find out which."' },
      { label: 'Challenge him to a riddle', test: { stat: 'buddhi', dc: 4 }, pass: [{ befriend: 'vanara' }, { recruit: 'hanu' }], passText: '"What has roots nobody sees, is taller than trees, up it goes, and yet never grows?" He thinks for an hour. "...A mountain! Fine. You win. I’m coming with you."', fail: [{ lose: { anna: 1 } }], failText: 'He answers your riddle in one second and leaves with your roti.' },
      { label: 'Let him keep it', pass: [{ lose: { anna: 1 } }, { gain: { punya: 1 } }], passText: 'He looks surprised, then a little ashamed, and is gone.' },
    ],
  },
  {
    id: 'ganga_susu', deck: 'encounter', art: '🐬', creature: 'susu',
    title: 'The Blind Dolphin',
    text: 'Where the river bends, a grey-pink shape rolls in the brown water and blows a fine spray. A Ganga dolphin, blind from birth. It clicks and whistles, singing the shape of the world.',
    choices: [
      { label: 'Sing back to it', test: { stat: 'karuna', dc: 4 }, pass: [{ befriend: 'susu' }, { gain: { prana: 3 } }], passText: 'It answers, and for a while the two of you hold a conversation in a language older than words.', fail: [{ gain: { prana: 1 } }], failText: 'It listens politely, then sinks out of sight. You feel oddly comforted.' },
      { label: 'Wade in beside it', test: { stat: 'gati', dc: 4 }, pass: [{ befriend: 'susu' }, { gain: { punya: 1 } }], passText: 'It circles you once, nudges your hand, and leads you to a shallow bank of river mussels: dinner.', fail: [{ lose: { prana: 1 } }], failText: 'The current is stronger than it looks. You scramble back, coughing.' },
    ],
  },
  {
    id: 'ganga_gharial', deck: 'encounter', art: '🐊', creature: 'gharial',
    title: 'Sunbather on the Sandbank',
    text: 'The path crosses a sandbank, and on it, eyes half-closed, lies a gharial as long as a boat. Its thin snout is lined with a hundred teeth. It does not look interested in moving.',
    choices: [
      { label: 'Wait for it to leave', pass: [{ lose: { anna: 1 } }], passText: 'It leaves at sunset, in its own time, like a retired king.' },
      { label: 'Sneak around through the shallows', test: { stat: 'gati', dc: 4 }, pass: [], passText: 'You tiptoe past. One golden eye opens, then closes.', fail: [{ lose: { prana: 2 } }], failText: 'A lazy swipe of the tail sends you sprawling into the river.' },
      { label: 'Offer it a fish and a bow', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'gharial' }, { gain: { punya: 1 } }], passText: 'It accepts the fish with immense dignity and lets you sit beside it a while. You both enjoy the sun.', fail: [{ lose: { anna: 1 } }], failText: 'It eats the fish and ignores the bow.' },
    ],
  },
  {
    id: 'ganga_shuka', deck: 'encounter', art: '🦜', creature: 'shuka',
    title: 'The Parrot Who Knew Too Much',
    text: 'In a fortune-teller’s cage sits a green parrot. "Help!" it says clearly. "He makes me pick cards all day! Also, he cheats. Also, the man three stalls down is a spy for the dacoits!"',
    choices: [
      { label: 'Buy its freedom (3 Mudra)', requires: { mudra: 3 }, pass: [{ lose: { mudra: 3 } }, { befriend: 'shuka' }, { gain: { punya: 2 } }, { buff: { stat: 'any', amount: 2 } }], passText: 'The parrot flies to your shoulder. Before it leaves it tells you three useful secrets about the road ahead.' },
      { label: 'Chat with it', test: { stat: 'buddhi', dc: 4 }, pass: [{ gain: { mudra: 2 } }], passText: 'It tells you where the fortune-teller hides his "lucky" coins. You decide to only take two.', fail: [], failText: 'It mostly wants to talk about seeds.' },
    ],
  },
  {
    id: 'ganga_gaja', deck: 'encounter', art: '🐘', creature: 'gaja',
    title: 'Thorn in the Foot',
    text: 'A temple elephant stands trumpeting in pain at the roadside, one foot lifted. Her mahout is wringing his hands. "A thorn, a great acacia thorn, and she won’t let me near!"',
    choices: [
      { label: 'Calm her and pull it out', test: { stat: 'karuna', dc: 4 }, pass: [{ befriend: 'gaja' }, { gain: { punya: 2 } }], passText: 'She lets you near. One pull, and the thorn is out. She lays her trunk across your shoulders like a blessing.', fail: [{ lose: { prana: 2 } }], failText: 'She shoves you aside, not unkindly, but firmly. Her mahout manages it in the end.' },
      { label: 'Hold her foot steady', test: { stat: 'shakti', dc: 5 }, pass: [{ befriend: 'gaja' }, { gain: { mudra: 3 } }], passText: 'You hold steady while the mahout works. The temple pays you for your trouble.', fail: [{ lose: { prana: 3 } }], failText: 'Holding an elephant’s foot is exactly as hard as it sounds.' },
    ],
  },
  {
    id: 'ganga_sadhu', deck: 'encounter', art: '🧘',
    title: 'The Naked Sadhu',
    text: 'A sadhu smeared in ash sits by the road, one arm raised. He says he has kept it raised for twelve years. "Traveller! Answer my question. What is heavier than a mountain?"',
    choices: [
      { label: 'Think carefully', test: { stat: 'buddhi', dc: 4 }, pass: [{ stat: { buddhi: 1 } }], passText: '"A promise," you say. He laughs so hard he nearly lowers his arm. "Good, good. Keep yours."', fail: [{ gain: { prana: 1 } }], failText: '"An elephant on a mountain?" He sighs and blesses you anyway.' },
      { label: 'Answer from the heart', test: { stat: 'karuna', dc: 4 }, pass: [{ gain: { punya: 2 } }], passText: '"Grief," you say quietly, thinking of the rishi. He nods slowly and gives you a little of his ash for luck.', fail: [], failText: 'He shrugs. "Come back in twelve years."' },
    ],
  },
  {
    id: 'ganga_wrestler', deck: 'encounter', art: '🤼',
    title: 'The Akhara',
    text: 'In a pit of red earth, wrestlers slick with mustard oil are grappling. Their guru spots you. "You! Traveller! You look weak. Wrestle my newest pupil. If you win, you eat with us."',
    choices: [
      { label: 'Step into the pit', test: { stat: 'shakti', dc: 5 }, pass: [{ stat: { shakti: 1 } }, { gain: { anna: 2 } }], passText: 'You pin him! The guru roars with laughter and makes you eat three bowls of dal and ghee. You leave stronger.', fail: [{ lose: { prana: 2 } }, { gain: { anna: 1 } }], failText: 'You are thrown into the dirt eleven times. They feed you anyway, out of pity.' },
      { label: 'Politely decline', pass: [], passText: 'The wrestlers flex at you as you walk away.' },
    ],
  },

  // ---- hazards ----
  {
    id: 'ganga_flood', deck: 'hazard', art: '🌊',
    title: 'River in Spate',
    text: 'Upstream rains have swollen a side-stream into a brown torrent. Uprooted trees spin past. The ford is gone.',
    choices: [
      { label: 'Swim across', test: { stat: 'shakti', dc: 5 }, pass: [], passText: 'You fight the current and drag yourself out on the far bank, gasping.', fail: [{ lose: { prana: 3 } }], failText: 'The river tumbles you a hundred yards downstream before spitting you out.' },
      { label: 'Use your rope', requires: { hasItem: 'rope' }, pass: [], passText: 'You lash the rope to a tree and cross hand over hand.' },
      { label: 'Wait for the water to fall', pass: [{ lose: { anna: 2 } }], passText: 'Two days of waiting and eating.' },
    ],
  },
  {
    id: 'ganga_dacoits', deck: 'hazard', art: '🗡️',
    title: 'Dacoits of the Ravines',
    text: 'Three men step out of the ravine, faces wrapped in cloth, holding lathis. "Your coins, traveller. Or your teeth."',
    choices: [
      { label: 'Fight', test: { stat: 'shakti', dc: 6 }, pass: [{ gain: { mudra: 3 } }], passText: 'You fight like a tiger. They flee, dropping a pouch of their own.', fail: [{ lose: { prana: 3, mudra: 2 } }], failText: 'They beat you soundly and take what they want.' },
      { label: 'Run', test: { stat: 'gati', dc: 5 }, pass: [], passText: 'You’re gone before they finish their threat.', fail: [{ lose: { prana: 1, mudra: 2 } }], failText: 'They catch you at the next bend.' },
      { label: 'Talk to them', test: { stat: 'karuna', dc: 5 }, pass: [{ gain: { punya: 2 } }, { lose: { anna: 1 } }], passText: 'They’re not dacoits really, just hungry farmers whose fields drowned. You share your food and they walk you safely to the next village.', fail: [{ lose: { mudra: 3 } }], failText: 'They’re not interested in conversation.' },
    ],
  },
  {
    id: 'ganga_loo', deck: 'hazard', art: '🔥',
    title: 'The Loo Wind',
    text: 'At noon a hot wind blows out of the west like breath from a furnace. Birds drop silent. The road shimmers.',
    choices: [
      { label: 'Push on through', test: { stat: 'shakti', dc: 4 }, pass: [], passText: 'You tie a wet cloth over your head and walk on stubbornly.', fail: [{ lose: { prana: 2 } }], failText: 'You stagger into the next village half-dead from the heat.' },
      { label: 'Rest in the shade until evening', pass: [{ lose: { anna: 1 } }], passText: 'You sleep through the worst of it beneath a neem tree.' },
    ],
  },

  // ---- mysteries ----
  {
    id: 'ganga_apsara', deck: 'mystery', art: '💫', weight: 1,
    title: 'Dancer on the Water',
    text: 'At midnight, mist rises off the river. A woman dances on the surface of the water, her anklets ringing, her body made of moonlight. An apsara, one of the celestial dancers of Indra’s court. She has seen you.',
    choices: [
      { label: 'Watch in silence', pass: [{ gain: { prana: 10, punya: 2 } }], passText: 'When she finishes, she bows to you, and is gone. You feel as if you have slept for a week.' },
      { label: 'Join the dance', test: { stat: 'gati', dc: 5 }, pass: [{ stat: { gati: 1 } }, { gain: { punya: 1 } }], passText: 'You can’t believe it, but your feet find the water and hold. You dance until dawn. Something of her grace stays with you.', fail: [{ gain: { prana: 2 } }], failText: 'You sink immediately. She laughs like bells and helps you out.' },
    ],
  },
  {
    id: 'ganga_kumbh', deck: 'mystery', art: '🎪',
    title: 'Lost in the Kumbh',
    text: 'You turn a corner and find yourself in the greatest gathering of humans on earth: the Kumbh Mela. Ten million pilgrims. Ash-covered naga sadhus. Elephants. Tents to the horizon. You are instantly, completely lost.',
    choices: [
      { label: 'Find your way through', test: { stat: 'buddhi', dc: 4 }, pass: [{ addItem: 'herbs' }, { gain: { punya: 1 } }, { stat: { karuna: 1 } }], passText: 'In the heart of the crowd you meet an old Ayurvedic doctor who gives you herbs and a long talk about kindness. You leave changed.', fail: [{ lose: { anna: 1 } }], failText: 'It takes you a whole day to get out.' },
      { label: 'Let the crowd carry you', pass: [{ gain: { prana: 2, anna: 2 } }], passText: 'You are swept into a free kitchen that feeds ten thousand a day. You eat and sing and sleep in a stranger’s tent.' },
    ],
  },

  // ---- shrine ----
  {
    id: 'ganga_shrine', deck: 'shrine', art: '🛕',
    title: 'Riverside Shiva Shrine',
    text: 'A small whitewashed shrine with a black stone lingam, garlanded with marigolds. Brass bells hang at the door.',
    choices: [
      { label: 'Pour river water over the stone', pass: [{ gain: { prana: 2 } }], passText: 'Cool water, a single bell. Peace.' },
      { label: 'Light incense', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { randomStat: 1 }, { gain: { punya: 1 } }], passText: 'The smoke curls up and, for a moment, you’re sure the stone is warm. You feel stronger in a way you can’t explain.' },
      { label: 'Meditate', test: { stat: 'buddhi', dc: 4 }, pass: [{ buff: { stat: 'any', amount: 2 } }], passText: 'Your mind becomes still as a pond.', fail: [{ gain: { prana: 1 } }], failText: 'Your mind wanders to food. Still, the quiet is nice.' },
    ],
  },
];
