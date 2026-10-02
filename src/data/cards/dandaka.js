export default [
  // ---- story ----
  {
    id: 'dandaka_intro', deck: 'intro', art: '🌳',
    title: 'Into the Dandaka',
    text: 'On the far bank the fields simply stop. In their place stands the forest: sal, teak, banyan and bamboo, so thick that noon looks like dusk. Sita walked here once, and Rama, and a thousand sages. Somewhere a peacock screams. Somewhere else, something much larger breathes.',
    choices: [
      { label: 'Ask the forest’s permission', pass: [{ gain: { punya: 1 } }, { shield: true }], passText: 'You bow to the trees. It feels silly, until a breeze runs through the canopy like an answer.' },
      { label: 'Stride in boldly', pass: [{ buff: { stat: 'any', amount: 2 } }], passText: 'Fortune favours the bold. Probably.' },
    ],
  },
  {
    id: 'dandaka_lotuspond', deck: 'landmark', art: '🪷', creature: 'naga',
    title: 'The Lotus Pond Palace',
    text: 'A still green pond, lotuses blooming in every colour. As you kneel to drink, the water parts and a crowned serpent-woman rises: the naga queen. Beside her is a younger naga with sharp, curious eyes. "My daughter Ulupi wishes to see the world above," says the queen. "And to hunt down the thief who stole our Moon Pearl. Are you a worthy companion for a princess?"',
    choices: [
      { label: 'Offer a pot of milk', requires: { hasItem: 'milk' }, pass: [{ removeItem: 'milk' }, { befriend: 'naga' }, { recruit: 'ulupi' }, { gain: { punya: 1 } }], passText: 'The queen smiles, which is alarming on a serpent. "You know the old courtesies. Go, Ulupi. Keep this one alive."' },
      { label: 'Bow and speak with respect', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'naga' }, { recruit: 'ulupi' }], passText: '"Gentle words from a land-walker. Rare." Ulupi slides from the water, her tail becoming legs as she steps onto the bank.', fail: [{ gain: { prana: 2 } }], failText: '"Not yet, I think," says the queen. She lets you drink, and the water heals your scratches.' },
      { label: 'Answer her riddle', test: { stat: 'buddhi', dc: 5 }, pass: [{ befriend: 'naga' }, { recruit: 'ulupi' }], passText: '"What has no feet but travels the world?" You answer: "A river, or a story." Ulupi laughs out loud. "I like this one, Mother."', fail: [{ gain: { prana: 2 } }], failText: 'Wrong answer. The queen sinks without a ripple, but leaves you a little healing in the water.' },
      { label: 'Bow and move on', pass: [{ gain: { prana: 2 } }], passText: 'You leave the royal family in peace.' },
    ],
  },
  {
    id: 'dandaka_salgrove', deck: 'landmark', art: '⛓️', creature: 'yaksha',
    title: 'The Chained Sal Tree',
    text: 'In a silent clearing a great sal tree is wrapped in black iron chains. A face is pressed into the bark: a yaksha, the tree-spirit, its eyes closed in pain. All around, the flowers have closed and the birds have gone. A sorcerer did this, says a Gond woodcutter, "and dropped the key while running from the tiger."',
    choices: [
      { label: 'Unlock the chains', requires: { hasItem: 'iron_key' }, pass: [{ removeItem: 'iron_key' }, { setFlag: ['key_found', 'yaksha_freed'] }, { startQuest: 'q_yaksha' }, { befriend: 'yaksha' }], passText: 'The key turns. The chains fall like dead snakes. The yaksha opens eyes of green fire and the whole forest sighs, and blooms.' },
      { label: 'Promise to find the key', pass: [{ startQuest: 'q_yaksha' }], passText: 'You lay your hand on the bark. "I’ll be back." The yaksha does not open its eyes, but a single leaf turns green.' },
    ],
  },
  {
    id: 'dandaka_letter', deck: 'visit', art: '✉️',
    when: { hasItem: 'letter' },
    title: 'Savitri',
    text: 'At the ashram a young woman with ink on her fingers is copying manuscripts. When you say her mother’s name, she drops her pen.',
    choices: [{ label: 'Give her the letter', pass: [{ removeItem: 'letter' }, { setFlag: 'letter_delivered' }], passText: 'She reads it twice, crying and laughing. Then she sits down and writes a reply, "for when you pass that way again", and teaches you three verses that sharpen the mind.' }],
  },
  {
    id: 'dandaka_gate', deck: 'gate', art: '🪵',
    title: 'The Sandal King',
    text: 'In the deepest part of the forest stands the oldest sandalwood tree in the world. Its scent makes you dizzy. Cobras hang from every branch like living garlands. A voice like wood creaking: "Every traveller who takes my heartwood must first prove they belong to the forest. How will you prove it?"',
    choices: [
      { label: 'Speak to the cobras gently', test: { stat: 'karuna', dc: 6 }, pass: [{ token: 'heartwood' }, { completeRegion: true }], passText: 'The cobras sway, then part like a curtain. A sliver of golden heartwood falls into your hands, warm as skin.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: 'A cobra strikes, and only grazes you. The tree says nothing. You stagger back to think.' },
      { label: 'Climb to the crown', test: { stat: 'gati', dc: 6 }, pass: [{ token: 'heartwood' }, { completeRegion: true }], passText: 'You climb through the snakes without touching one. At the top, a dead branch snaps off in your hand: heartwood.', fail: [{ lose: { prana: 3 } }, { moveBack: 2 }], failText: 'You fall through three branches and several snakes.' },
      { label: 'Answer: "I am the forest’s guest"', test: { stat: 'buddhi', dc: 6 }, pass: [{ token: 'heartwood' }, { completeRegion: true }], passText: '"A guest. Not an owner. Good." The tree drops a sliver of its heart at your feet.', fail: [{ lose: { prana: 2 } }, { moveBack: 2 }], failText: '"Words," says the tree. "Only words."' },
      { label: 'Burn incense at its roots', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { token: 'heartwood' }, { completeRegion: true }, { gain: { punya: 1 } }], passText: 'Sandal smoke for a sandal king. The tree laughs, a creaking, delighted sound, and gives you its heartwood.' },
    ],
  },

  // ---- companion story ----
  {
    id: 'dandaka_hanu_signs', deck: 'event', art: '🐾', once: true, weight: 8,
    when: { companion: 'hanu', notFlag: 'hanu_signs' },
    title: 'Scratches on the Bark',
    text: 'Hanu freezes, then scrambles up a tree. High on the trunk are claw marks in a pattern: three lines and a circle. "That’s our troop mark," he whispers. "They came this way. Recently!"',
    choices: [{ label: 'Follow the marks', pass: [{ setFlag: 'hanu_signs' }, { buff: { stat: 'gati', amount: 2 } }], passText: 'Hanu bounds ahead all day, chattering. You’ve never seen him so happy.' }],
  },
  {
    id: 'dandaka_hanu_troop', deck: 'encounter', art: '🐒', creature: 'vanara', once: true, weight: 8,
    when: { companion: 'hanu', flag: 'hanu_signs', notFlag: 'hanu_reunited' },
    title: 'The Troop',
    text: 'The trees explode with monkeys: a hundred vanaras, chattering, leaping, pulling Hanu into a hundred hugs. His mother cuffs his ear and then won’t let go of him. Later that night, by the fire, Hanu sits beside you, unusually quiet. "They want me to stay," he says.',
    choices: [
      { label: '"Stay with your family, Hanu."', pass: [{ setFlag: 'hanu_reunited' }, { farewell: 'hanu' }, { gain: { punya: 3 } }, { addItem: 'sandals' }], passText: 'He hugs you so hard your ribs creak. In the morning he’s gone, but beside your bedroll is a pair of beautifully made chappals and a note in clumsy letters: "for a fast plains-walker."' },
      { label: '"Come with me. They know you’re safe now."', pass: [{ setFlag: 'hanu_reunited' }, { gain: { punya: 1 } }], passText: 'He grins, his old grin. "Somebody has to keep you alive, plains-walker." His mother sighs, and packs him enough fruit for a month.' },
    ],
  },

  // ---- events ----
  {
    id: 'dandaka_iron_key', deck: 'event', art: '🗝️', weight: 3,
    when: { notFlag: 'key_found' },
    title: 'Something in the Stream',
    text: 'A glint in a clear forest stream. Lodged between two stones is a heavy black key, cold enough to make your fingers ache. Pug marks of a tiger lead away from it.',
    choices: [
      { label: 'Take the key', pass: [{ addItem: 'iron_key' }, { setFlag: 'key_found' }], passText: 'It’s heavier than any key should be. Something in this forest is locked with it.' },
      { label: 'Leave it be', pass: [], passText: 'Not your key, not your business.' },
    ],
  },
  {
    id: 'dandaka_fireflies', deck: 'event', art: '✨', creature: 'khadyota',
    title: 'The Firefly Tree',
    text: 'At dusk one whole tree lights up, then goes dark, then lights again: ten thousand fireflies pulsing together. A trail of them drifts off into the dark like an invitation.',
    choices: [
      { label: 'Follow the trail', test: { stat: 'buddhi', dc: 4 }, pass: [{ befriend: 'khadyota' }, { gain: { anna: 2 } }, { buff: { stat: 'any', amount: 2 } }], passText: 'They lead you to a clearing full of wild fruit and a hidden path. You feel the forest is on your side.', fail: [{ lose: { anna: 1 } }], failText: 'They lead you in circles, then go out all at once. Funny, fireflies.' },
      { label: 'Sit and watch', pass: [{ gain: { prana: 3 } }], passText: 'You watch until the tree goes dark. It is the most peaceful hour of your life.' },
    ],
  },
  {
    id: 'dandaka_yajna', deck: 'event', art: '🔥',
    title: 'The Forest Yajna',
    text: 'In a clearing, seven hermits with long matted hair tend a sacred fire, chanting. The eldest beckons. "We are short of firewood, and short of good conversation. Which can you offer?"',
    choices: [
      { label: 'Gather firewood', test: { stat: 'shakti', dc: 4 }, pass: [{ gain: { punya: 2 } }, { addItem: 'herbs' }], passText: 'You drag back a whole dead tree. They bless you and give you medicinal roots.', fail: [{ gain: { punya: 1 } }, { lose: { prana: 1 } }], failText: 'A few sticks and a lot of splinters. They’re grateful anyway.' },
      { label: 'Debate philosophy', test: { stat: 'buddhi', dc: 5 }, pass: [{ stat: { buddhi: 1 } }], passText: 'You argue about the nature of the self until dawn. They admit you won one point, which for hermits is high praise.', fail: [{ gain: { prana: 1 } }], failText: 'They demolish every argument you make, very kindly.' },
    ],
  },
  {
    id: 'dandaka_honey', deck: 'event', art: '🍯',
    title: 'Wild Honey',
    text: 'High in a hollow tree hangs a hive as big as a cart wheel, dripping with honey. The bees are as big as your thumb.',
    choices: [
      { label: 'Climb up for it', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { anna: 4, prana: 1 } }], passText: 'Honey, warm and wild, tasting of a hundred flowers.', fail: [{ lose: { prana: 3 } }], failText: 'The bees have opinions about this. Very pointed ones.' },
      { label: 'Smoke them out with your lamp', requires: { hasItem: 'lamp' }, pass: [{ gain: { anna: 4 } }], passText: 'The smoke calms the bees. You take only what you need.' },
      { label: 'Leave it to the bears', pass: [], passText: 'Wise.' },
    ],
  },
  {
    id: 'dandaka_painter', deck: 'event', art: '🎨',
    title: 'The Painter of Trees',
    text: 'A Gond painter sits on a stone, painting a tiger made entirely of tiny dots and dashes. "Every creature has a story," she says. "Tell me yours and I’ll paint it."',
    choices: [
      { label: 'Tell her your journey', test: { stat: 'karuna', dc: 4 }, pass: [{ gain: { punya: 1, prana: 2 } }, { stat: { karuna: 1 } }], passText: 'She paints you as a small figure on a great winding road, surrounded by friends. Seeing it, you realise how far you’ve come.', fail: [{ gain: { prana: 1 } }], failText: 'You stumble over your words, but she paints a lovely tree anyway.' },
      { label: 'Watch her work', pass: [{ gain: { prana: 2 } }], passText: 'Dot. Dot. Dash. Dot. It is like watching rain become a forest.' },
    ],
  },
  {
    id: 'dandaka_lost', deck: 'event', art: '🌀',
    title: 'Every Tree Looks the Same',
    text: 'You realise you’ve passed the same strangler fig three times. The path is gone. The light is going.',
    choices: [
      { label: 'Read the moss and the sun', test: { stat: 'buddhi', dc: 5 }, pass: [], passText: 'Moss on the north, sun in the west. You find the path again.', fail: [{ lose: { anna: 2 } }], failText: 'It takes a whole extra day to find your way out.' },
      { label: 'Climb a tree to look', test: { stat: 'gati', dc: 4 }, pass: [], passText: 'From the top you spot a temple spire and set off toward it.', fail: [{ lose: { prana: 2 } }], failText: 'The branch breaks. You see the forest floor very clearly.' },
    ],
  },

  // ---- encounters ----
  {
    id: 'dandaka_tiger', deck: 'encounter', art: '🐅', creature: 'vyaghra',
    title: 'Stripes in the Shadows',
    text: 'The forest goes silent. Not a bird, not a monkey. Then you see her, twenty paces away, golden eyes in a striped face. The tigress of Dandaka is watching you.',
    choices: [
      { label: 'Stand still, eyes lowered', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'vyaghra' }, { gain: { punya: 2 } }], passText: 'She walks right past you, so close her fur brushes your arm. She allowed you to live. More than that: she accepted you.', fail: [{ lose: { prana: 2 } }], failText: 'She snarls, and you run before you can stop yourself. A swipe catches your shoulder.' },
      { label: 'Climb a tree fast', test: { stat: 'gati', dc: 5 }, pass: [], passText: 'You’re up the tree before you’ve finished thinking. She yawns and moves on.', fail: [{ lose: { prana: 3 } }], failText: 'Tigers can climb too.' },
      { label: 'Stand tall and shout', test: { stat: 'shakti', dc: 6 }, pass: [{ stat: { shakti: 1 } }], passText: 'You make yourself huge and roar. She considers you, then decides you aren’t worth the trouble. Your heart doesn’t slow down for an hour.', fail: [{ lose: { prana: 4 } }], failText: 'She is not impressed.' },
    ],
  },
  {
    id: 'dandaka_bear', deck: 'encounter', art: '🐻', creature: 'riksha',
    title: 'The Bear Who Reads',
    text: 'A sloth bear sits in the crook of a mahua tree, wearing spectacles and reading a palm-leaf manuscript. "Ah. A visitor. I am Riksha, of the line of Jambavan, who advised Rama. Would you care to be advised?"',
    choices: [
      { label: 'Ask for advice', test: { stat: 'buddhi', dc: 5 }, pass: [{ befriend: 'riksha' }, { stat: { buddhi: 1 } }], passText: '"Travel lightly. Trust slowly. Forgive quickly." You discuss it for hours. He gives you an excellent pear.', fail: [{ befriend: 'riksha' }], failText: 'He talks for six hours. You understand about a third, but he seems to enjoy your company.' },
      { label: 'Share some food', requires: { anna: 1 }, pass: [{ lose: { anna: 1 } }, { befriend: 'riksha' }, { gain: { punya: 1, prana: 2 } }], passText: 'He accepts your roti with great courtesy and shares mahua flowers in return.' },
      { label: 'Back away slowly', pass: [], passText: 'He goes back to his reading.' },
    ],
  },
  {
    id: 'dandaka_deer', deck: 'encounter', art: '🦌', creature: 'hiran',
    title: 'The Golden Deer',
    text: 'In a shaft of light stands a deer whose coat is pure gold and whose antlers are tipped with silver. It looks at you, then bounds off a few steps and looks back. Every story you know about golden deer ends badly.',
    choices: [
      { label: 'Chase it', test: { stat: 'gati', dc: 6 }, pass: [{ befriend: 'hiran' }, { gain: { mudra: 5 } }], passText: 'You run until your lungs burn. It stops by a hollow log, nudges it, and vanishes. Inside: a forgotten pouch of gold coins.', fail: [{ moveBack: 3 }, { lose: { prana: 1 } }], failText: 'You chase it for hours and end up exactly where you started. Worse, actually.' },
      { label: 'Let it go', pass: [{ gain: { punya: 1 } }, { buff: { stat: 'buddhi', amount: 2 } }], passText: 'You remember Sita, and Rama, and smile. The deer seems almost disappointed.' },
    ],
  },
  {
    id: 'dandaka_owl', deck: 'encounter', art: '🦉', creature: 'uluka',
    title: 'Lakshmi’s Messenger',
    text: 'A white owl lands on a branch above you, its face like a moon. Lakshmi, goddess of fortune, rides on owls like this one. It turns its head all the way around and hoots, once.',
    choices: [
      { label: 'Ask it a question', test: { stat: 'buddhi', dc: 4 }, pass: [{ befriend: 'uluka' }, { gain: { mudra: 4 } }], passText: 'You ask where fortune lies. It flies to a tree stump where someone buried coins long ago.', fail: [], failText: 'It hoots, twice, and leaves. Maybe you asked the wrong question.' },
      { label: 'Bow to it', pass: [{ gain: { punya: 1 } }], passText: 'It bows back. Probably.' },
    ],
  },
  {
    id: 'dandaka_naga', deck: 'encounter', art: '🐍', creature: 'naga',
    title: 'Guardian of the Spring',
    text: 'Coils glitter beneath the lotuses of a spring. A hooded head rises, crowned with a jewel. "This water belongs to the Naga Kingdom, land-walker."',
    choices: [
      { label: 'Fight for the water', test: { stat: 'shakti', dc: 7 }, pass: [{ gain: { mudra: 5 } }, { lose: { punya: 1 } }], passText: 'You win, but it feels wrong. The naga leaves behind a few pearls and a curse you can’t quite hear.', fail: [{ lose: { prana: 3 } }], failText: 'Its tail sweeps you into the mud.' },
      { label: 'Offer milk', requires: { hasItem: 'milk' }, pass: [{ removeItem: 'milk' }, { gain: { punya: 2, prana: 4 } }, { befriend: 'naga' }], passText: 'The naga drinks and lets you share its spring. The water heals you.' },
      { label: 'Sing to it', test: { stat: 'karuna', dc: 5 }, pass: [{ befriend: 'naga' }, { gain: { prana: 3 } }], passText: 'It sways to the music and lets you drink.', fail: [{ lose: { anna: 1 } }], failText: 'It hisses. You leave thirsty.' },
      { label: 'Walk around', pass: [], passText: 'There’ll be other springs.' },
    ],
  },
  {
    id: 'dandaka_yaksha_free', deck: 'encounter', art: '⛓️', creature: 'yaksha', once: true, weight: 8,
    when: { quest: 'q_yaksha', hasItem: 'iron_key', notFlag: 'yaksha_freed' },
    title: 'Back to the Chained Tree',
    text: 'The forest itself seems to guide you. Your feet find the silent clearing again. The chained yaksha’s face is greyer than before.',
    choices: [{ label: 'Unlock the chains', pass: [{ removeItem: 'iron_key' }, { setFlag: 'yaksha_freed' }, { befriend: 'yaksha' }], passText: 'The chains fall. Flowers burst open across the clearing and birds pour back into the trees. "Friend," says a voice like leaves. "The forest will remember."' }],
  },
  {
    id: 'dandaka_yaksha_lake', deck: 'encounter', art: '💧', creature: 'yaksha',
    title: 'The Yaksha’s Lake',
    text: 'A clear lake, and you’re desperately thirsty. As you kneel, a voice booms from a crane on a dead tree. "STOP. This lake is mine. Answer my questions before you drink, or the water will poison you." Five brothers once died here for ignoring that.',
    choices: [
      { label: 'Answer the yaksha', test: { stat: 'buddhi', dc: 5 }, pass: [{ befriend: 'yaksha' }, { gain: { prana: 4, mudra: 3 } }], passText: '"What is faster than the wind?" "The mind." "What is more numerous than grass?" "Thoughts." The yaksha is delighted, and throws in a handful of gold.', fail: [{ lose: { prana: 2 } }], failText: 'Your answers are wrong. The water makes you violently sick.' },
      { label: 'Drink anyway', pass: [{ lose: { prana: 3 } }], passText: 'You should have listened.' },
      { label: 'Walk away thirsty', pass: [{ lose: { anna: 1 } }], passText: 'Better thirsty than dead.' },
    ],
  },

  // ---- hazards ----
  {
    id: 'dandaka_bog', deck: 'hazard', art: '🟫',
    title: 'The Sinking Ground',
    text: 'One step the ground is solid; the next it swallows you to the knees, then the waist. A bog, hidden under a carpet of leaves.',
    choices: [
      { label: 'Throw your rope to a branch', requires: { hasItem: 'rope' }, pass: [], passText: 'You pull yourself out, muddy but whole.' },
      { label: 'Haul yourself out', test: { stat: 'shakti', dc: 5 }, pass: [], passText: 'Inch by inch, you drag yourself free.', fail: [{ lose: { prana: 3 } }], failText: 'By the time you’re out you’re exhausted, and missing a sandal.' },
      { label: 'Lie flat and swim', test: { stat: 'buddhi', dc: 5 }, pass: [], passText: 'Spread your weight, move slowly. It works.', fail: [{ lose: { prana: 2 } }], failText: 'Theory, meet practice.' },
    ],
  },
  {
    id: 'dandaka_thorns', deck: 'hazard', art: '🌵',
    title: 'Thorn Thicket',
    text: 'A wall of lantana and wild thorn bushes, head-high and stretching as far as you can see.',
    choices: [
      { label: 'Push straight through', test: { stat: 'shakti', dc: 4 }, pass: [], passText: 'Scratched, but through.', fail: [{ lose: { prana: 2 } }], failText: 'You come out looking like you lost a fight with a cat.' },
      { label: 'Look for an animal trail', test: { stat: 'buddhi', dc: 4 }, pass: [], passText: 'A deer path, low but clear.', fail: [{ lose: { anna: 1 } }], failText: 'You spend all day looking.' },
    ],
  },
  {
    id: 'dandaka_rakshasa', deck: 'hazard', art: '👹',
    title: 'The Rakshasa’s Bridge',
    text: 'A rope bridge over a ravine, and sitting on it, picking its tusks with a bone, a rakshasa: a demon of the old forests, ten feet tall, with three eyes. "TOLL," it rumbles.',
    choices: [
      { label: 'Fight it', test: { stat: 'shakti', dc: 7 }, pass: [{ gain: { mudra: 4 } }, { stat: { shakti: 1 } }], passText: 'You knock it clean off the bridge. It lands in the river below, swearing, and you find its toll box.', fail: [{ lose: { prana: 4 } }], failText: 'It picks you up by the ankle and throws you back the way you came.' },
      { label: 'Trick it', test: { stat: 'buddhi', dc: 5 }, pass: [], passText: 'You convince it that a much tastier traveller is coming the other way. It runs off to wait for them.', fail: [{ lose: { prana: 2, mudra: 2 } }], failText: 'It isn’t as stupid as it looks.' },
      { label: 'Pay in food', requires: { anna: 2 }, pass: [{ lose: { anna: 2 } }], passText: 'It eats your food in one bite, burps and waves you across.' },
    ],
  },

  // ---- mysteries ----
  {
    id: 'dandaka_temple', deck: 'mystery', art: '🛕',
    title: 'The Swallowed Temple',
    text: 'Roots have swallowed a whole temple. Stone gods peer out between them. On the inner altar, a statue of Vishnu has eyes of real emerald, glowing green in the gloom.',
    choices: [
      { label: 'Pry out an emerald', test: { stat: 'gati', dc: 5 }, pass: [{ gain: { mudra: 8 } }, { lose: { punya: 3 } }], passText: 'It comes free. You’re rich. You can’t shake the feeling someone saw you.', fail: [{ lose: { prana: 4, punya: 2 } }], failText: 'The floor gives way. Temples have guardians, it turns out.' },
      { label: 'Clean the altar and pray', pass: [{ gain: { punya: 2 } }, { randomStat: 1 }], passText: 'You sweep away a century of leaves. When you’re done the statue’s face looks peaceful. So do you. You feel strong.' },
    ],
  },
  {
    id: 'dandaka_vanadevi', deck: 'mystery', art: '🌿',
    title: 'Vanadevi',
    text: 'The leaves arrange themselves into a woman: green-skinned, crowned with flowers, eyes like deep pools. Vanadevi, goddess of the forest. "You walk through my house," she says. "What do you bring me?"',
    choices: [
      { label: 'Promise to plant a tree for every one you pass', pass: [{ gain: { pranaMax: 2, prana: 2, punya: 1 } }], passText: 'She laughs like rain. "That is a great many trees. I will hold you to it." Your body feels deeper-rooted.' },
      { label: 'Offer your gratitude', test: { stat: 'karuna', dc: 5 }, pass: [{ stat: { karuna: 1 } }, { gain: { prana: 10 } }], passText: 'She touches your forehead. Everything green in the world feels like family.', fail: [{ gain: { prana: 3 } }], failText: 'She smiles and dissolves back into leaves.' },
    ],
  },

  // ---- shrine ----
  {
    id: 'dandaka_shrine', deck: 'shrine', art: '👣',
    title: 'Footprints at Panchavati',
    text: 'Under five ancient banyans, pilgrims have built a little shrine around two footprints pressed into stone. They say Rama stood here, in exile, before everything went wrong.',
    choices: [
      { label: 'Offer flowers', pass: [{ gain: { prana: 3, punya: 1 } }], passText: 'You think about exile, and about coming home.' },
      { label: 'Light incense', requires: { hasItem: 'incense' }, pass: [{ removeItem: 'incense' }, { randomStat: 1 }, { gain: { punya: 1 } }], passText: 'Steady smoke, steady heart.' },
    ],
  },
];
