export function setEntitiesAnims(scene) {
    // Pigeons
    const pigeonChoices = [0, 1, 2];

    pigeonChoices.forEach((choice) => {
        scene.anims.create({
            key: 'pigeon_flying' + choice,
            frames: scene.anims.generateFrameNumbers('pigeon', { start: 0 + 12*choice, end: 2 + 12*choice }),
            frameRate: 10,
            repeat: -1
        });
    
        scene.anims.create({
            key: 'pigeon_idle_standing' + choice,
            frames: scene.anims.generateFrameNumbers('pigeon', { start: 4 + 12*choice, end: 5 + 12*choice }),
            frameRate: 2,
            repeat: 0
        });
    
        scene.anims.create({
            key: 'pigeon_sitting' + choice,
            frames: scene.anims.generateFrameNumbers('pigeon', { start: 7 + 12*choice, end: 8 + 12*choice }),
            frameRate: 6,
            repeat: 0
        });
    
        scene.anims.create({
            key: 'pigeon_idle_sitting' + choice,
            frames: scene.anims.generateFrameNumbers('pigeon', { start: 10 + 12*choice, end: 11 + 12*choice }),
            frameRate: 0.5,
            repeat: 0
        });
    })

    // Enemies
    scene.anims.create({
        key: 'slime_idle_1',
        frames: scene.anims.generateFrameNumbers('slime1', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    scene.anims.create({
        key: 'slime_idle_2',
        frames: scene.anims.generateFrameNumbers('slime2', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    scene.anims.create({
        key: 'slime_idle_3',
        frames: scene.anims.generateFrameNumbers('slime3', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    // NPCs
    const npcChoices = ['farmer', 'blacksmith', 'girl'];

    npcChoices.forEach(choice => {
        scene.anims.create({
            key: choice + '_idle_left',
            frames: scene.anims.generateFrameNumbers(choice + '_idle', { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_idle_right',
            frames: scene.anims.generateFrameNumbers(choice + '_idle', { start: 8, end: 11}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_idle_up',
            frames: scene.anims.generateFrameNumbers(choice + '_idle', { start: 12, end: 15}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_idle_down',
            frames: scene.anims.generateFrameNumbers(choice + '_idle', { start: 0, end: 3}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_walk_left',
            frames: scene.anims.generateFrameNumbers(choice + '_walk', { start: 4, end: 7}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_walk_right',
            frames: scene.anims.generateFrameNumbers(choice + '_walk', { start: 8, end: 11}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_walk_up',
            frames: scene.anims.generateFrameNumbers(choice + '_walk', { start: 12, end: 15}),
            frameRate: 6,
            repeat: -1
        });
    
        scene.anims.create({
            key: choice + '_walk_down',
            frames: scene.anims.generateFrameNumbers(choice + '_walk', { start: 0, end: 3}),
            frameRate: 6,
            repeat: -1
        });
    });

    // Animals
    scene.anims.create({
        key: 'cow_idle',
        frames: scene.anims.generateFrameNumbers('cow', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    })

    scene.anims.create({
        key: 'cow_walk',
        frames: scene.anims.generateFrameNumbers('cow', { start: 6, end: 11 }),
        frameRate: 6,
        repeat: -1
    })

    scene.anims.create({
        key: 'chicken_idle',
        frames: scene.anims.generateFrameNumbers('chicken', { start: 4, end: 5 }),
        frameRate: 4,
        repeat: -1
    })

    scene.anims.create({
        key: 'chicken_walk',
        frames: scene.anims.generateFrameNumbers('chicken', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    // Character
    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('character', { start: 8, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('character', { start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'up',
        frames: scene.anims.generateFrameNumbers('character', { start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    scene.anims.create({
        key: 'down',
        frames: scene.anims.generateFrameNumbers('character', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    // Animations des actions
    scene.anims.create({
        key: 'fishingRodAnim',
        frames: scene.anims.generateFrameNumbers('character_fishing', { start: 0, end: 2}),
        frameRate: 10,
        repeat: 0
    });

    scene.anims.create({
        key: 'farmingHoeAnim',
        frames: scene.anims.generateFrameNumbers('character_farming', { start: 0, end: 2}),
        frameRate: 10,
        repeat: 0
    });

    scene.anims.create({
        key: 'diggingShovelAnim',
        frames: scene.anims.generateFrameNumbers('character_digging', { start: 0, end: 2}),
        frameRate: 10,
        repeat: 0
    });

    scene.anims.create({
        key: 'choppingAxeAnim',
        frames: scene.anims.generateFrameNumbers('character_chopping', { start: 0, end: 2}),
        frameRate: 10,
        repeat: 4
    });

    scene.anims.create({
        key: 'miningPickaxeAnim',
        frames: scene.anims.generateFrameNumbers('character_mining', { start: 0, end: 3}),
        frameRate: 10,
        repeat: 4
    });

    scene.anims.create({
        key: 'attackingSwordAnim',
        frames: scene.anims.generateFrameNumbers('character_attacking', { start: 0, end: 2}),
        frameRate: 10,
        repeat: 0
    });
}