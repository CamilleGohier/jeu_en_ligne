export const dictionary = {
    "wall": {
        "type": ["placeable", "connectable"],
        "layer": "object",
        "depth": 10,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "fence": {
        "type": ["placeable", "connectable"],
        "layer": "object",
        "depth": 10,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "door": {
        "type": ["placeable", "rotateable", "clickable", "crossable"],
        "layer": "object",
        "depth": 10,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "workbench": {
        "type": ["placeable", "rotateable"],
        "layer": "object",
        "depth": 10,
        "group": "workbenchs",
        "size": { x: 28, y: 20 },
        "offset": { x: 18, y: 24 },
        "positionNPC": { row: 1, col: 0 }
    },
    "shelf": {
        // On peut peut-être enlever 'storage' en checkant le truc en dessous plutôt (pb l.79 placing.js)
        "type": ["placeable", "rotateable", "storage", "clickable", "drainable"],
        "layer": "object",
        "depth": 10,
        "group": "storages",
        "origin": [0, 0.5],
        "size" : { x: 28, y: 20 },
        "offset": { x: 18, y: 44 },
        "storage": { x: 2, y: 5 },
        "positionNPC": { row: 1, col: 0 }
    },
    "feeder" : {
        "type": ["placeable", "drainable"],
        "layer": "object",
        "depth": 10,
        "group": "feeders",
        "size" : { x: 28, y: 20 },
        "offset": { x: 18, y: 24 },
        "dispenser": { maxQuantity: 5, item: 'wheat'},
        "positionNPC": { row: 1, col: 0 }
    },
    "nest" : {
        "type": ["placeable", "crossable"],
        "layer": "object",
        "depth": 10,
        "group": "nests",
        "size" : { x: 28, y: 20 },
        "offset": { x: 18, y: 24 },
    },
    "flower_pot": {
        "type": ["placeable"],
        "layer": "object",
        "depth": 10,
        "size": { x: 16, y: 16 },
        "offset": { x: 24, y: 24 },
    },
    "parquet": {
        "type": ["placeable", "floor"],
        "layer": "floor",
        "depth": 5,
        "size": { x: 32, y: 32 },
        "offset": { x: 16, y: 16 },
    },
    "positionNPC": {
        "type": ["placeable"],
        "layer": "object",
        "depth": 10
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
    // "slime": {
    //     "type": ["entity", "enemy"],
    //     "depth": 10,
    //     "size": { x: 20, y: 16 },
    //     "offset": { x: 16, y: 16 },
    // }
}


// Exemple :
// .type.includes("placeable");