export const dictionary = {
    "wall": {
        "type": ["placeable", "connectable"],
        "layer": "object",
        "depth": 10,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "door": {
        "type": ["placeable", "rotateable"],
        "layer": "object",
        "depth": 10,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "desk": {
        "type": ["placeable", "interactive"],
        // Rajouter la posNPC aussi, et ensuite rotate ?
        "layer": "object",
        "depth": 10,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "parquet": {
        "type": ["placeable", "floor"],
        "layer": "floor",
        "depth": 5,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "tree": {
        "type": ["environment"],
    //     "depth": 10,
    //     "size": { x: 16, y: 16 },
    //     "offset": { x: 24, y: 32 },
    //     "group": "treesGroup",
    //     // "loot": [
    //     //     {
    //     //         "item": "wood",
    //     //         "quantity_max": 3
    //     //     },
    //     //     {
    //     //         "item": "stick",
    //     //         "quantity_max": 2
    //     //     }
    //     // ]
    },
    "rock": {
        "type": ["environment"],
    //     "depth": 10,
    //     "size": { x: 24, y: 16 },
    //     "offset": { x: 20, y: 24 },
    //     // "group": "rocksGroup",
    //     // "loot": [
    //     //     {
    //     //         "item": "stone",
    //     //         "quantity_max": 4
    //     //     },
    //     //     {
    //     //         "item": "ore",
    //     //         "quantity_max": 1
    //     //     }
    //     // ]
    },
}


// Exemple :
// .type.includes("placeable");