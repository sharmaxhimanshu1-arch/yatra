export default [
  // ---- story ----
  {
    id: 'maru_intro', deck: 'intro', art: '🏜️',
    title: 'The Sea of Sand',
    text: 'The forest thins to scrub, the scrub to thorn, the thorn to nothing. Ahead lies the Maru, the land of death as the old texts call it, though the people who live here call it home. The sand is red-gold and moves in the wind like water. Your throat is already dry.',
    choices: [
      { label: 'Wrap your head like the desert folk', pass: [{ shield: true }], passText: 'A nomad woman shows you how to tie a proper safa. The sun can’t touch you.' },
      { label: 'Fill up at the oasis', pass: [{ gain: { prana: 3, anna: 1 } }], passText: 'You drink until you slosh, and pick dates from the palms.' },
    ],
  },
  {
    id: 'maru_fort', deck: 'landmark', art: '🏰',
    title: 'The Sand-Buried Fort',
    text: 'Only the top of the fort remains above the dunes: a few towers, a carved balcony, a gate that now opens onto sand. Inside, cool rooms still hold faded paintings of kings on elephants. Wind moans through the jali screens like voices.',
    choices: [
      { label: 'Explore the deep rooms', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { mudra: 6 } }, { addItem: 'sun_amulet' }], passText: 'In the queen’s chamber you find a box of old coins and an amulet carved like a sun, still warm.', fail: [{ lose: { prana: 2 } }], failText: 'A floor gives way into sand. You claw your way out with nothing.' },
      { label: 'Read the painted walls', test: { stat: 'buddhi', dc: 5 }, pass: [{ stat: { buddhi: 1 } }], passText: 'The paintings tell of a king who traded his kingdom for a single drop of water from Meru. You understand something about what you are seeking.', fail: [{ gain: { prana: 2 } }], failText: 'The paintings are beautiful, and baffling. You rest in the shade.' },
      { label: 'Rest in the cool shade', pass: [{ gain: { prana: 4 } }], passText: 'Stone keeps the night’s cool all day. You sleep like a king.' },
    ],
  },
  {
    id: 'maru_golden', deck: 'landmark', art: '🌇',
    title: 'The Golden City',
    text: 'Rising from the desert like a sandcastle built by giants: a city of carved yellow stone, every house a palace, every balcony a lace of stone. At sunset it glows as if lit from inside.',
    choices: [
      { label: 'Wander the bazaars', pass: [{ gain: { anna: 3 } }, { addItem: 'dates' }], passText: 'Mirror-work, spices, puppets, silver. You eat dal-baati until you can’t move.' },
      { label: 'Climb to the fort ramparts at sunset', pass: [{ gain: { punya: 1, prana: 3 } }], passText: 'The whole desert turns gold, then rose, then violet. A boy plays the ravanhatta beside you. You will remember this when you are very old.' },
    ],
  },
  {
    id: 'maru_well_report', deck: 'visit', art: '🚰',
    when: { flag: 'well_found', notFlag: 'well_reported' },
    title: 'Word for Rohi',
    text: 'A caravan leader from Rohi is resting in the courtyard. When you tell him about the stepwell he grabs your shoulders.',
    choices: [{ label: 'Draw him a map', pass: [{ setFlag: 'well_reported' }], passText: 'He leaves at once with six camels and twenty empty pots. "Rohi will sing about you," he calls back. "Badly, but loudly!"' }],
  },
  {
    id: 'maru_gate', deck: 'gate', art: '☀️',
    title: 'Temple of the Sun',
    text: 'A temple of red stone, shaped like the chariot of Surya, with twelve great carved wheels. At noon, sunlight falls through a hole in the roof onto a crystal on the altar, and the crystal blazes: the Sun Shard. A priest with a face like old leather blocks the way. "Surya gives his light to all. But his shard only goes to one who has earned it."',
    choices: [
      { label: 'Stand in the noon sun until he relents', test: { stat: 'shakti', dc: 7 }, pass: [{ token: 'sun_shard' }, { completeRegion: true }], passText: 'You stand an hour, then two. At last the priest laughs and hands you the shard. "Stubborn as a camel. Surya likes that."', fail: [{ lose: { prana: 3 } }, { moveBack: 2 }], failText: 'You faint into the priest’s arms. He carries you to the shade and sends you away to recover.' },
      { label: 'Read the sundial wheels', test: { stat: 'buddhi', dc: 6 }, pass: [{ token: 'sun_shard' }, { completeRegion: true }], passText: 'The spokes of the wheels are sundials. You read the exact moment, step into the beam, and the shard drops into your hand.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'You misread the shadows by an hour. The moment passes.' },
      { label: 'Sing the dawn hymn to Surya', test: { stat: 'karuna', dc: 6 }, pass: [{ token: 'sun_shard' }, { completeRegion: true }], passText: 'Your voice cracks on the high notes, but you mean every word. The old priest is crying when you finish.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'You forget the second verse.' },
      { label: 'Kesar tells the Sun’s own story', hide: { companion: 'kesar' }, pass: [{ token: 'sun_shard' }, { completeRegion: true }, { gain: { punya: 1 } }], passText: 'Kesar tells him how Surya once lost his chariot and walked the desert like a beggar. The priest has never heard it. He gives you the shard just to hear the ending.' },
    ],
  },

  // ---- companion story ----
  {
    id: 'maru_pearl_trail', deck: 'event', art: '🐍', once: true, weight: 8,
    when: { companion: 'ulupi', notFlag: 'pearl_trail' },
    title: 'A Serpent’s Scent',
    text: 'Ulupi stops dead, tasting the air with a flicker of her tongue. "Moon Pearl," she hisses. In a camel trader’s tent you learn that a thief passed through a month ago, bragging about a pearl that glowed at night, heading for the pirate ports of the southern coast.',
    choices: [{ label: '"Then we go south."', pass: [{ setFlag: 'pearl_trail' }, { buff: { stat: 'any', amount: 2 } }], passText: 'Ulupi’s eyes burn. "Thank you, friend. When we find it, I will tell my mother whose help I had."' }],
  },

  // ---- events ----
  {
    id: 'maru_stepwell', deck: 'event', art: '🪜', once: true, weight: 8,
    when: { quest: 'q_well', notFlag: 'well_found' },
    title: 'Steps into the Earth',
    text: 'Your foot strikes carved stone under the sand. You dig, and dig, and find a step, then another, going down in a great inverted pyramid. A stepwell! Its bottom is choked with sand, but you can smell water.',
    choices: [
      { label: 'Dig down to the water', test: { stat: 'shakti', dc: 5 }, pass: [{ setFlag: 'well_found' }, { gain: { prana: 4 } }], passText: 'At the bottom, cold sweet water seeps up through the sand. You drink, then mark the spot with a cairn.', fail: [{ setFlag: 'well_found' }, { lose: { prana: 2 } }], failText: 'You don’t reach the water, but you dig far enough to be sure it’s there. Exhausted, you mark the spot.' },
      { label: 'Mark the spot and remember the stars', pass: [{ setFlag: 'well_found' }], passText: 'You note which stars rise over the well. Rohi will be able to find it.' },
    ],
  },
  {
    id: 'maru_musicians', deck: 'event', art: '🎻', when: { night: true },
    title: 'Songs by the Fire',
    text: 'Manganiyar musicians have made camp in a hollow of the dunes. Kamaicha, khartal and a voice that seems to come from the desert itself. They wave you over.',
    choices: [
      { label: 'Sit and listen', pass: [{ gain: { prana: 3 } }, { buff: { stat: 'karuna', amount: 2 } }], passText: 'Songs of lovers and droughts and camels. You don’t understand the words and you understand everything.' },
      { label: 'Try to sing along', test: { stat: 'karuna', dc: 4 }, pass: [{ gain: { anna: 2, punya: 1 } }, { stat: { karuna: 1 } }], passText: 'The old singer slaps his knee and makes you sing until dawn. They feed you, teach you, and give you a desert name.', fail: [{ gain: { prana: 1 } }], failText: 'Everyone laughs, kindly. You’ll practise.' },
    ],
  },
  {
    id: 'maru_camel_fair', deck: 'event', art: '🐪',
    title: 'The Camel Fair',
    text: 'Fifty thousand camels, decorated with mirrors and pompoms, and the men who love them. There are camel races, camel beauty contests, and a moustache competition.',
    choices: [
      { label: 'Enter a camel race', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { mudra: 6 } }], passText: 'Your borrowed camel, a cranky old female named Rani, wins by a nose. Purse and glory!', fail: [{ lose: { prana: 2 } }], failText: 'Rani stops in the middle of the track to eat a turban.' },
      { label: 'Help groom the camels', pass: [{ gain: { mudra: 2, anna: 1 } }], passText: 'Honest work, smelly work.' },
    ],
  },
  {
    id: 'maru_puppets', deck: 'event', art: '🎭',
    title: 'Kathputli',
    text: 'In a village square a puppeteer is working wooden puppets with bright, staring eyes: a king, a dancer, a snake-charmer, a horse. Children shriek with joy. Then the puppeteer’s hands start to shake. He’s ill.',
    choices: [
      { label: 'Take over the strings', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { mudra: 4, punya: 1 } }], passText: 'You make the dancer dance and the king fall over. The children have no idea anything was wrong.', fail: [{ gain: { punya: 1 } }], failText: 'You tangle the king with the horse, but the children think it’s a new story.' },
      { label: 'Give him herbs', requires: { hasItem: 'herbs' }, pass: [{ removeItem: 'herbs' }, { gain: { punya: 3 } }], passText: 'He recovers enough to finish the show, and gives you a tiny puppet of yourself.' },
      { label: 'Watch and clap', pass: [{ gain: { prana: 1 } }], passText: 'It’s a good show.' },
    ],
  },
  {
    id: 'maru_bishnoi', deck: 'event', art: '🌳',
    title: 'The Tree Huggers',
    text: 'A Bishnoi village, where the people have protected every tree and every animal for five hundred years. Chinkara deer graze among the houses without fear. An old woman is bottle-feeding an orphaned fawn.',
    choices: [
      { label: 'Help tend the animals', test: { stat: 'karuna', dc: 4 }, pass: [{ gain: { punya: 2 } }, { stat: { karuna: 1 } }], passText: 'You spend a day as a nursemaid to fawns and peacocks. The old woman says you have "good hands."', fail: [{ gain: { punya: 1 } }], failText: 'A baby deer headbutts you repeatedly. Still, you tried.' },
      { label: 'Ask about the desert ahead', pass: [{ gain: { anna: 1 } }, { buff: { stat: 'any', amount: 1 } }], passText: 'They tell you which water-holes are true and which are mirages.' },
    ],
  },
  {
    id: 'maru_starnav', deck: 'event', art: '⭐', when: { night: true },
    title: 'Steering by the Stars',
    text: 'The desert at night is cold and absolutely black, and the stars come down to the horizon. With no landmarks, the sky is your only map.',
    choices: [
      { label: 'Navigate by Dhruva, the pole star', test: { stat: 'buddhi', dc: 5 }, pass: [{ buff: { stat: 'any', amount: 2 } }], passText: 'Dhruva, the boy who meditated so hard he became the still point of the sky. You follow him all night.', fail: [{ lose: { anna: 1 } }], failText: 'You walk in a large, careful circle.' },
      { label: 'Camp until morning', pass: [{ lose: { anna: 1 } }, { gain: { prana: 2 } }], passText: 'Freezing, but restful.' },
    ],
  },
  {
    id: 'maru_salt_trader', deck: 'event', art: '🧂',
    title: 'The Salt Trader',
    text: 'A trader from the salt flats of Kutch has a camel train laden with white blocks. One of his camels is lame and he’s desperate.',
    choices: [
      { label: 'Carry a load for him', test: { stat: 'shakti', dc: 5 }, pass: [{ gain: { mudra: 5 } }], passText: 'Your back curses you, but he pays fairly.', fail: [{ lose: { prana: 2 } }, { gain: { mudra: 2 } }], failText: 'You manage half a day before your legs give out. He pays you half.' },
      { label: 'Look at the camel’s hoof', test: { stat: 'buddhi', dc: 5 }, pass: [{ gain: { mudra: 3, punya: 1 } }, { befriend: 'ushtra' }], passText: 'A stone stuck in the pad. You pry it out. The camel spits on you in what you choose to believe is gratitude.', fail: [], failText: 'You can’t find the problem.' },
    ],
  },

  // ---- encounters ----
  {
    id: 'maru_vetala', deck: 'encounter', art: '🦇', creature: 'vetala',
    title: 'The Vetala in the Khejri Tree',
    text: 'In a lone dead tree something hangs upside down: a corpse, grey and grinning, which opens its eyes. A vetala. "Traveller! A riddle! Answer, and pass. Know the answer and stay silent, and your head bursts into a thousand pieces. Ha!"',
    choices: [
      { label: 'Answer the riddle', test: { stat: 'buddhi', dc: 6 }, pass: [{ befriend: 'vetala' }, { stat: { buddhi: 1 } }], passText: 'A king’s riddle about two heads swapped onto the wrong bodies. You answer: "The head decides who you are." The vetala cackles. "Clever, clever! King Vikram answered the same! Come back and talk sometime."', fail: [{ lose: { prana: 3 } }], failText: 'Wrong! It doesn’t burst your head, but it screeches so loud your ears bleed.' },
      { label: 'Run before it finishes', test: { stat: 'gati', dc: 5 }, pass: [], passText: 'You run while it’s still clearing its throat.', fail: [{ lose: { prana: 2 } }], failText: 'It drops on your back and rides you for a mile, telling bad jokes.' },
    ],
  },
  {
    id: 'maru_mirage', deck: 'encounter', art: '🌫️', creature: 'marichika',
    title: 'The Lake That Isn’t',
    text: 'A blue lake shimmers ahead, palm trees, cool water. It’s so close. It moves as you walk toward it. In the heat-haze a shape beckons: a woman made of rippling air.',
    choices: [
      { label: 'Refuse to follow', test: { stat: 'buddhi', dc: 5 }, pass: [{ befriend: 'marichika' }, { buff: { stat: 'any', amount: 2 } }], passText: 'You sit down and close your eyes. When you open them the spirit is sitting beside you, curious. "Nobody refuses me." She tells you the true way.', fail: [{ moveBack: 2 }, { lose: { anna: 1 } }], failText: 'You follow it for half a day before you realise.' },
      { label: 'Drink from your water skin', requires: { hasItem: 'waterskin' }, pass: [{ gain: { prana: 2 } }], passText: 'With real water in your throat, the false lake loses its power.' },
    ],
  },
  {
    id: 'maru_fox', deck: 'encounter', art: '🦊', creature: 'lomri',
    title: 'The Fox with Enormous Ears',
    text: 'A tiny sandy fox with ears as big as its body sits beside your bedroll in the morning, holding one of your dates in its mouth. It is clearly waiting to see what you’ll do.',
    choices: [
      { label: 'Laugh and give it another', requires: { anna: 1 }, pass: [{ lose: { anna: 1 } }, { befriend: 'lomri' }, { gain: { punya: 1 } }], passText: 'It follows you for two days, catching scorpions and showing you burrows with water.' },
      { label: 'Try to catch it', test: { stat: 'gati', dc: 6 }, pass: [{ befriend: 'lomri' }], passText: 'You catch it! It bites you affectionately and decides you’re its friend now.', fail: [], failText: 'Foxes are fast. You are not.' },
    ],
  },
  {
    id: 'maru_scorpion', deck: 'encounter', art: '🦂', creature: 'vrischika',
    title: 'The Scorpion King',
    text: 'A scorpion the size of a dog rises from the sand, black and glossy as obsidian, its tail curled overhead. It speaks in a clicking voice. "Sssseven stings I have. Ssseven travellers I have stung. Give me reason to make you not the eighth."',
    choices: [
      { label: 'Flatter its magnificence', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'vrischika' }, { gain: { mudra: 3 } }], passText: 'It preens. Nobody has ever complimented its carapace. It gives you a gold coin it had been keeping for a special occasion.', fail: [{ lose: { prana: 3 } }], failText: 'It does not appreciate sarcasm, which is not what you intended.' },
      { label: 'Back away very slowly', test: { stat: 'gati', dc: 4 }, pass: [], passText: 'Slowly, slowly, gone.', fail: [{ lose: { prana: 3 } }], failText: 'Number eight.' },
    ],
  },
  {
    id: 'maru_bustard', deck: 'encounter', art: '🪶', creature: 'godawan',
    title: 'The Rajah of the Grasslands',
    text: 'A huge, stately bird with a black crown struts through the dry grass, puffing out its white throat like a rajah inspecting his troops. A great Indian bustard. There are very few of them left. Nearby, a hunter is setting a snare.',
    choices: [
      { label: 'Spoil the hunter’s snare', test: { stat: 'gati', dc: 5 }, pass: [{ befriend: 'godawan' }, { gain: { punya: 3 } }], passText: 'You spring the snare with a stick and shoo the bird away. The hunter curses you. You don’t care.', fail: [{ lose: { prana: 2 } }, { gain: { punya: 1 } }], failText: 'The hunter catches you, but the bird escapes.' },
      { label: 'Talk to the hunter', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'godawan' }, { gain: { punya: 2 } }], passText: 'He is poor and has six children. You talk for a long time. He takes up the snare and promises to try another way.', fail: [], failText: 'He doesn’t listen.' },
    ],
  },
  {
    id: 'maru_camel', deck: 'encounter', art: '🐫', creature: 'ushtra',
    title: 'The Runaway Camel',
    text: 'A camel with a fine saddle is wandering alone in the dunes, bellowing. It looks lost, and very, very annoyed.',
    choices: [
      { label: 'Approach it calmly', test: { stat: 'karuna', dc: 4 }, pass: [{ befriend: 'ushtra' }, { gain: { anna: 2, prana: 2 } }], passText: 'It sniffs you, decides you’re acceptable, and carries you for a day. There’s food in the saddlebags.', fail: [{ lose: { prana: 1 } }], failText: 'It spits in your face with tremendous accuracy.' },
      { label: 'Return it to its owner', test: { stat: 'buddhi', dc: 5 }, pass: [{ gain: { mudra: 5 } }, { befriend: 'ushtra' }], passText: 'You follow its tracks back to a frantic merchant, who rewards you generously.', fail: [], failText: 'The tracks vanish in the wind.' },
    ],
  },
  {
    id: 'maru_bandit_queen', deck: 'encounter', art: '🏇',
    title: 'The Bandit Queen',
    text: 'Riders surround you, faces masked. Their leader is a young woman with a rifle and a hard face. "We rob the zamindars who starve the villages," she says. "Which are you?"',
    choices: [
      { label: 'Tell her the truth', test: { stat: 'karuna', dc: 5 }, pass: [{ gain: { anna: 3, punya: 1 } }], passText: 'She believes you, and laughs. "A wanderer with a map. Fine. Eat with us tonight." You hear stories you will never repeat.', fail: [{ lose: { mudra: 2 } }], failText: 'She takes "a small tax for the poor" anyway.' },
      { label: 'Join a raid on a cruel landlord', test: { stat: 'gati', dc: 6 }, pass: [{ gain: { mudra: 6 } }, { stat: { gati: 1 } }], passText: 'The grain store is emptied and given away by morning. Your share is generous.', fail: [{ lose: { prana: 3 } }], failText: 'The landlord’s guards are awake. You get away, barely.' },
    ],
  },

  // ---- hazards ----
  {
    id: 'maru_sandstorm', deck: 'hazard', art: '🌪️',
    title: 'Andhi: the Sandstorm',
    text: 'The horizon turns brown and comes toward you like a wall. The air fills with stinging sand. You can’t see your own hand.',
    choices: [
      { label: 'Dig in behind a dune', test: { stat: 'buddhi', dc: 5 }, pass: [], passText: 'You wrap your face, curl into the lee of the dune and wait. It passes.', fail: [{ lose: { prana: 3 } }], failText: 'Wrong side of the dune. You are half-buried and half-flayed.' },
      { label: 'Push on', test: { stat: 'shakti', dc: 6 }, pass: [], passText: 'One step, then another, through the roaring dark.', fail: [{ lose: { prana: 3 } }, { moveBack: 1 }], failText: 'You walk in a circle and lose ground.' },
    ],
  },
  {
    id: 'maru_thirst', deck: 'hazard', art: '🥵',
    title: 'Thirst',
    text: 'The well you were counting on is dry. The next is a day away. The sun hammers on your skull.',
    choices: [
      { label: 'Drink from your water skin', requires: { hasItem: 'waterskin' }, pass: [], passText: 'Every traveller’s first lesson: carry water.' },
      { label: 'Endure it', test: { stat: 'shakti', dc: 5 }, pass: [{ lose: { prana: 1 } }], passText: 'You walk through the day with your tongue like leather.', fail: [{ lose: { prana: 4 } }], failText: 'You collapse at the next well, barely alive.' },
      { label: 'Dig for water like the desert foxes', test: { stat: 'buddhi', dc: 6 }, pass: [], passText: 'In a dry riverbed, under the bend, you dig and find damp sand, then water.', fail: [{ lose: { prana: 3 } }], failText: 'Nothing but sand, and more sand.' },
    ],
  },
  {
    id: 'maru_viper', deck: 'hazard', art: '🐍',
    title: 'The Saw-Scaled Viper',
    text: 'A dry rasping, like a saw on wood. A small, sand-coloured viper is coiled beside your foot, rubbing its scales together in warning.',
    choices: [
      { label: 'Freeze', test: { stat: 'gati', dc: 4 }, pass: [], passText: 'You don’t breathe. It slides away.', fail: [{ lose: { prana: 4 } }], failText: 'It strikes. The poison burns like fire.' },
      { label: 'Ulupi speaks to it', hide: { companion: 'ulupi' }, pass: [{ gain: { punya: 1 } }], passText: 'Ulupi hisses a few words in the serpent tongue. The viper bows (somehow) and leaves.' },
    ],
  },

  // ---- mysteries ----
  {
    id: 'maru_rann', deck: 'mystery', art: '🌕',
    title: 'The White Desert',
    text: 'You walk over a ridge and the world turns white: a salt flat to the horizon, crusted in hexagons, glowing under a full moon. It is utterly silent. You feel like the only person alive.',
    choices: [
      { label: 'Walk out into the white', pass: [{ gain: { prana: 10, punya: 2 } }], passText: 'You walk until the moon is overhead, and lie down on the salt, and feel the world turning under you.' },
      { label: 'Meditate under the moon', test: { stat: 'buddhi', dc: 5 }, pass: [{ randomStat: 1 }, { gain: { pranaMax: 1 } }], passText: 'In that silence something in you settles that has never settled before.', fail: [{ gain: { prana: 3 } }], failText: 'You fall asleep. Still a good night.' },
    ],
  },
  {
    id: 'maru_seals', deck: 'mystery', art: '🦄',
    title: 'The City Before Cities',
    text: 'The wind has uncovered a grid of brick streets, drains, and a great bath, older than any kingdom you know. In the sand you find a small stone seal carved with a one-horned beast and a script nobody can read.',
    choices: [
      { label: 'Study the strange script', test: { stat: 'buddhi', dc: 6 }, pass: [{ stat: { buddhi: 1 } }, { gain: { punya: 1 } }], passText: 'You can’t read it, but you see patterns in it, and the patterns are about water and stars and travelling. People walked this way five thousand years ago, looking for the same things you are.', fail: [{ gain: { prana: 2 } }], failText: 'It remains a mystery. That feels right, somehow.' },
      { label: 'Bury it again', pass: [{ gain: { punya: 2 } }], passText: 'Some things belong to the people who left them.' },
    ],
  },

  // ---- shrine ----
  {
    id: 'maru_shrine', deck: 'shrine', art: '🐀',
    title: 'Temple of the Holy Rats',
    text: 'Twenty thousand rats live in this temple, worshipped as the reincarnated children of the goddess Karni Mata. They run over your feet. They drink from silver bowls of milk. Spotting a white rat, they say, brings great luck.',
    choices: [
      { label: 'Look for a white rat', test: { stat: 'buddhi', dc: 5 }, pass: [{ randomStat: 1 }, { gain: { punya: 2 } }], passText: 'There! On the altar steps! The priests cheer.', fail: [{ gain: { punya: 1 } }], failText: 'All brown. Still, they seem pleased with you.' },
      { label: 'Share your food with the rats', requires: { anna: 1 }, pass: [{ lose: { anna: 1 } }, { gain: { punya: 2, prana: 2 } }], passText: 'Eating after the rats is considered a blessing. You decide to believe it.' },
    ],
  },
];
