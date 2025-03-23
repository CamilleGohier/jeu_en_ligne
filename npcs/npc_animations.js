export function NPCAnimations(scene) {
    // Farmer
    scene.anims.create({
        key: 'farmer_idle_left',
        frames: scene.anims.generateFrameNumbers('farmer_idle', { start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_idle_right',
        frames: scene.anims.generateFrameNumbers('farmer_idle', { start: 8, end: 11}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_idle_up',
        frames: scene.anims.generateFrameNumbers('farmer_idle', { start: 12, end: 15}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_idle_down',
        frames: scene.anims.generateFrameNumbers('farmer_idle', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_walk_left',
        frames: scene.anims.generateFrameNumbers('farmer_walk', { start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_walk_right',
        frames: scene.anims.generateFrameNumbers('farmer_walk', { start: 8, end: 11}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_walk_up',
        frames: scene.anims.generateFrameNumbers('farmer_walk', { start: 12, end: 15}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'farmer_walk_down',
        frames: scene.anims.generateFrameNumbers('farmer_walk', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });

    // BlackSmith

    scene.anims.create({
        key: 'blacksmith_idle_left',
        frames: scene.anims.generateFrameNumbers('blacksmith_idle', { start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_idle_right',
        frames: scene.anims.generateFrameNumbers('blacksmith_idle', { start: 8, end: 11}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_idle_up',
        frames: scene.anims.generateFrameNumbers('blacksmith_idle', { start: 12, end: 15}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_idle_down',
        frames: scene.anims.generateFrameNumbers('blacksmith_idle', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_walk_left',
        frames: scene.anims.generateFrameNumbers('blacksmith_walk', { start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_walk_right',
        frames: scene.anims.generateFrameNumbers('blacksmith_walk', { start: 8, end: 11}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_walk_up',
        frames: scene.anims.generateFrameNumbers('blacksmith_walk', { start: 12, end: 15}),
        frameRate: 6,
        repeat: -1
    });

    scene.anims.create({
        key: 'blacksmith_walk_down',
        frames: scene.anims.generateFrameNumbers('blacksmith_walk', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    });
}