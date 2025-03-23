export const tools = [
   {
    key: 'hand', name: 'Main vide',
    secondary: [
        { key: 'wall' },
        { key: 'door' },
        { key: 'parquet' },
        { key: 'desk' },
        { key: null }
    ]
   },

   {
    key: 'sword', name: 'Épée',
    secondary: []
   },

   {
    key: 'pickaxe', name: 'Pioche',
    secondary: []
   },

   {
    key: 'axe', name: 'Hache',
    secondary: []
   },
   
   {
    key: 'fishing_rod', name: 'Canne à pêche',
    secondary: []
   },

   {
    key: 'hoe', name: 'Houe',
    secondary: [
        { key: 'wheat_seed', crop: 'wheat_crop' },
        { key: 'tomato_seed', crop: 'tomato_crop' },
        { key: null },
        { key: null },
        { key: null }
    ]
   },

   {
    key: 'watering_can', name: 'Arrosoir',
    secondary: []
   },

   {
    key: 'shovel', name: 'Pelle',
    secondary: []
   },
];

export let content = [
    [
        { name: 'wheat_seed', quantity: 4 },
        { name: 'tomato_seed', quantity: 2 },
        { name: 'desk', quantity: 1 },
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ],
    [
        null, 
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ]
];