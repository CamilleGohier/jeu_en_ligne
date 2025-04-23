export const schedule = {
    "chicken": [
        { "type": "feeder", "action": "goToFeeder"},
        { "type": "nest", "action": "goToNest"},
        { "type": "randomMovement", "action": "move"}
    ],
    "cow": [
        { "type": "feeder", "action": "goToFeeder"},
        { "type": "randomMovement", "action": "move"}
    ]
    // "npc": [
        // { "type": "crafting"},
        // { "type": "chest"},
        // { "type": "randomMovement"}
    // ]
}
