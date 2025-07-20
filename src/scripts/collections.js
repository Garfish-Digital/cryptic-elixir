// Generate 80 cards of occult-themed items
export const generateCollections = () => {
  const books = [
    {
      title: "The Crimson Grimoire",
      description: "Ancient tome of blood magic rituals",
      price: "$450",
    },
    {
      title: "Shadows of the Abyss",
      description: "Forbidden knowledge from the void",
      price: "$380",
    },
    {
      title: "The Emerald Codex",
      description: "Alchemical transmutation secrets",
      price: "$520",
    },
    {
      title: "Whispers of the Dead",
      description: "Necromantic communion guide",
      price: "$675",
    },
    {
      title: "The Golden Prophecy",
      description: "Divine revelation manuscript",
      price: "$820",
    },
    {
      title: "Midnight Incantations",
      description: "Collection of dark spells",
      price: "$295",
    },
    {
      title: "The Veiled Truth",
      description: "Hidden wisdom of the ancients",
      price: "$395",
    },
    {
      title: "Serpent's Knowledge",
      description: "Forbidden serpentine mysteries",
      price: "$445",
    },
    {
      title: "The Obsidian Mirror",
      description: "Scrying and divination manual",
      price: "$365",
    },
    {
      title: "Eclipse Rituals",
      description: "Celestial magic practices",
      price: "$575",
    },
    {
      title: "The Bone Oracle",
      description: "Ossomancy and bone reading",
      price: "$425",
    },
    {
      title: "Cursed Lineages",
      description: "Genealogy of the damned",
      price: "$685",
    },
    {
      title: "The Silent Order",
      description: "Secret society chronicles",
      price: "$750",
    },
    {
      title: "Phantom Melodies",
      description: "Music from beyond the veil",
      price: "$325",
    },
    {
      title: "The Thirteenth Hour",
      description: "Time manipulation techniques",
      price: "$595",
    },
    {
      title: "Spectral Herbalism",
      description: "Ghostly botanical knowledge",
      price: "$415",
    },
    {
      title: "The Void Walker's Guide",
      description: "Navigation between realms",
      price: "$725",
    },
    {
      title: "Crimson Astronomy",
      description: "Blood moon calculations",
      price: "$485",
    },
    {
      title: "The Forgotten Names",
      description: "Lost deities and their powers",
      price: "$635",
    },
    {
      title: "Shadow Weaving",
      description: "Manipulation of darkness itself",
      price: "$545",
    },
  ];

  const rareItems = [
    {
      title: "Crystal of Eternal Night",
      description: "Obsidian sphere that absorbs light",
      price: "$1,250",
    },
    {
      title: "The Weeping Chalice",
      description: "Silver cup that fills with tears",
      price: "$950",
    },
    {
      title: "Bone Dice of Fate",
      description: "Carved from oracle's femur",
      price: "$675",
    },
    {
      title: "Mirror of Lost Souls",
      description: "Reflects the departed",
      price: "$1,450",
    },
    {
      title: "The Cursed Pendant",
      description: "Amulet of protection and peril",
      price: "$825",
    },
    {
      title: "Raven's Claw Dagger",
      description: "Blade forged from meteor iron",
      price: "$1,125",
    },
    {
      title: "Hourglass of Memories",
      description: "Sand shows forgotten moments",
      price: "$875",
    },
    {
      title: "The Witch's Cauldron",
      description: "Bronze vessel of transformation",
      price: "$1,350",
    },
    {
      title: "Spectral Compass",
      description: "Points to spiritual true north",
      price: "$725",
    },
    {
      title: "The Bleeding Rose",
      description: "Eternally fresh crimson bloom",
      price: "$595",
    },
    {
      title: "Oracle's Eye Stone",
      description: "Crystallized foresight",
      price: "$1,050",
    },
    {
      title: "The Phantom Lantern",
      description: "Illuminates the unseen",
      price: "$925",
    },
    {
      title: "Mourning Bells",
      description: "Chimes that summon spirits",
      price: "$775",
    },
    {
      title: "The Serpent's Skin",
      description: "Shed by the World Snake",
      price: "$1,575",
    },
    {
      title: "Tears of the Moon",
      description: "Crystallized lunar essence",
      price: "$650",
    },
    {
      title: "The Necromancer's Ring",
      description: "Commands the restless dead",
      price: "$1,875",
    },
    {
      title: "Vial of Last Breath",
      description: "Final exhalation preserved",
      price: "$495",
    },
    {
      title: "The Midnight Crown",
      description: "Worn by the Shadow King",
      price: "$2,250",
    },
    {
      title: "Ember of Creation",
      description: "Spark from the first fire",
      price: "$1,395",
    },
    {
      title: "The Bound Wraith",
      description: "Spirit trapped in amber",
      price: "$985",
    },
  ];

  const manuscripts = [
    {
      title: "The Covenant of Shadows",
      description: "Original pact with darkness",
      price: "$2,850",
    },
    {
      title: "Diary of the Mad Oracle",
      description: "Prophet's final visions",
      price: "$1,950",
    },
    {
      title: "The Heretic's Confession",
      description: "Burned mystic's last words",
      price: "$2,250",
    },
    {
      title: "Songs of the Damned",
      description: "Musical notation of suffering",
      price: "$1,675",
    },
    {
      title: "The Alchemist's Notes",
      description: "Formula for philosopher's stone",
      price: "$3,450",
    },
    {
      title: "Chronicle of the Eclipse War",
      description: "Battle between light and dark",
      price: "$2,125",
    },
    {
      title: "The Witch Hunter's Log",
      description: "Detailed account of the purge",
      price: "$1,875",
    },
    {
      title: "Memoirs of a Ghost",
      description: "Autobiography from beyond",
      price: "$2,650",
    },
    {
      title: "The Forgotten Ritual",
      description: "Ceremony to breach reality",
      price: "$3,850",
    },
    {
      title: "Letters to the Devil",
      description: "Correspondence with evil",
      price: "$2,495",
    },
    {
      title: "The Bleeding Scriptures",
      description: "Text written in crimson ink",
      price: "$3,125",
    },
    {
      title: "Cartographer's Nightmare",
      description: "Maps of impossible places",
      price: "$1,750",
    },
    {
      title: "The Puppet Master's Guide",
      description: "Control over mortal strings",
      price: "$2,350",
    },
    {
      title: "Recipes for Madness",
      description: "Culinary paths to insanity",
      price: "$1,425",
    },
    {
      title: "The Angel's Lament",
      description: "Fallen seraph's sorrow",
      price: "$4,250",
    },
    {
      title: "Inventory of Sins",
      description: "Catalog of human transgressions",
      price: "$1,895",
    },
    {
      title: "The Dreamweaver's Journal",
      description: "Navigation of sleeping minds",
      price: "$2,775",
    },
    {
      title: "Testimonies of the Void",
      description: "Accounts from nothingness",
      price: "$3,650",
    },
    {
      title: "The Blood Astronomer",
      description: "Celestial charts in crimson",
      price: "$2,925",
    },
    {
      title: "Final Hour Prophecies",
      description: "Visions of world's end",
      price: "$4,850",
    },
  ];

  const scrolls = [
    {
      title: "Scroll of Binding Shadows",
      description: "Imprisons darkness itself",
      price: "$895",
    },
    {
      title: "The Summoning Cipher",
      description: "Calls forth ancient entities",
      price: "$1,250",
    },
    {
      title: "Incantation of the Lost",
      description: "Recovers forgotten memories",
      price: "$675",
    },
    {
      title: "The Healing Curse",
      description: "Restores through suffering",
      price: "$950",
    },
    {
      title: "Ward Against Truth",
      description: "Shields from harsh reality",
      price: "$725",
    },
    {
      title: "The Phantom's Contract",
      description: "Bargain with restless spirits",
      price: "$1,125",
    },
    {
      title: "Transmutation Formula",
      description: "Changes matter's very essence",
      price: "$1,450",
    },
    {
      title: "The Silence Spell",
      description: "Mutes all sound and voice",
      price: "$585",
    },
    {
      title: "Chronicle of Tomorrow",
      description: "Glimpses into future events",
      price: "$1,850",
    },
    {
      title: "The Lover's Hex",
      description: "Binds hearts in eternal torment",
      price: "$795",
    },
    {
      title: "Ritual of Renewal",
      description: "Restores youth through sacrifice",
      price: "$2,250",
    },
    {
      title: "The Memory Thief",
      description: "Steals thoughts and experiences",
      price: "$1,375",
    },
    {
      title: "Blessing of the Cursed",
      description: "Gift that brings misfortune",
      price: "$925",
    },
    {
      title: "The Soul Mirror",
      description: "Reflects true inner nature",
      price: "$1,675",
    },
    {
      title: "Charm of Endless Night",
      description: "Prevents dawn from breaking",
      price: "$1,495",
    },
    {
      title: "The Weeping Willow's Secret",
      description: "Tree's ancient sorrow wisdom",
      price: "$635",
    },
    {
      title: "Conjuration of Mist",
      description: "Summons concealing fog",
      price: "$745",
    },
    {
      title: "The Phoenix Resurrection",
      description: "Rise from ashes reborn",
      price: "$2,850",
    },
    {
      title: "Banishment of Light",
      description: "Casts world into darkness",
      price: "$3,250",
    },
    {
      title: "The Final Benediction",
      description: "Last blessing before doom",
      price: "$1,985",
    },
  ];

  return [
    ...books.map((item) => ({ ...item, category: "Books" })),
    ...rareItems.map((item) => ({ ...item, category: "Rare Items" })),
    ...manuscripts.map((item) => ({ ...item, category: "Manuscripts" })),
    ...scrolls.map((item) => ({ ...item, category: "Scrolls" })),
  ];
};