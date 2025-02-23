export function NPCAnimations(scene) {
    scene.anims.create({
        key: 'npc_idle_left',
        frames: scene.anims.generateFrameNumbers('npc_idle', { start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_idle_right',
        frames: scene.anims.generateFrameNumbers('npc_idle', { start: 8, end: 11}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_idle_up',
        frames: scene.anims.generateFrameNumbers('npc_idle', { start: 12, end: 15}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_idle_down',
        frames: scene.anims.generateFrameNumbers('npc_idle', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_walk_left',
        frames: scene.anims.generateFrameNumbers('npc_walk', { start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_walk_right',
        frames: scene.anims.generateFrameNumbers('npc_walk', { start: 8, end: 11}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_walk_up',
        frames: scene.anims.generateFrameNumbers('npc_walk', { start: 12, end: 15}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'npc_walk_down',
        frames: scene.anims.generateFrameNumbers('npc_walk', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });
}