export function characterAnimations(scene) {
    scene.character = scene.physics.add.sprite(400, 300, 'character').setCollideWorldBounds(true);
    scene.cursors = scene.input.keyboard.createCursorKeys();

    scene.character.lastMove = 'down';
    scene.character.lastMoveX = 'left';
    scene.character.isFishing = false;
    scene.character.isFarming = false;

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
}

export function updateCharacterAnimation(scene) {
    let velocityX = 0;
    let velocityY = 0;
    let moving = false;

    if (scene.canWalk) {
        if (scene.cursors.left.isDown) {
            velocityX = -160;
            moving = true;
            scene.character.lastMove = 'left';
            scene.character.lastMoveX = 'left';
        }
        else if (scene.cursors.right.isDown) {
            velocityX = 160;
            moving = true;
            scene.character.lastMove = 'right';
            scene.character.lastMoveX = 'right';
        }
    
        if (scene.cursors.up.isDown) {
            velocityY = -160;
            moving = true;
            scene.character.lastMove = 'up';
        }
        else if (scene.cursors.down.isDown) {
            velocityY = 160;
            moving = true;
            scene.character.lastMove = 'down';
        }
    
        if (velocityX != 0 && velocityY != 0) {
            const normalized = new Phaser.Math.Vector2(velocityX, velocityY).normalize().scale(160);
            velocityX = normalized.x;
            velocityY = normalized.y;
        }
    }

    scene.character.setVelocity(velocityX, velocityY);

    if (velocityX < 0) {
        scene.character.anims.play('left', true);
    }
    else if (velocityX > 0) {
        scene.character.anims.play('right', true);
    }
    else if (velocityY < 0) {
        scene.character.anims.play('up', true);
    }
    else if (velocityY > 0) {
        scene.character.anims.play('down', true);
    }
    else {
        scene.character.anims.stop();

        switch (scene.character.lastMove) {
            case 'up':
                scene.character.setTexture('character', 4);
                break;
            
            case 'left':
                scene.character.setTexture('character', 8);
                break;

            case 'right':
                scene.character.setTexture('character', 12);
                break;
        
            default:
                scene.character.setTexture('character', 0);
                break;
        }
    }

    if(scene.character.isFishing) {
        if(!scene.fishingRod) {
            scene.fishingRod = scene.add.sprite(scene.character.x, scene.character.y, 'character_fishing');
            
            switch (scene.character.lastMoveX) {
                case 'left':
                    scene.fishingRod.setPosition(scene.character.x -20, scene.character.y);
                    scene.fishingRod.setScale(1, 1);
                    break;

                case 'right':
                    scene.fishingRod.setPosition(scene.character.x + 20, scene.character.y);
                    scene.fishingRod.setScale(-1, 1);
                    break;
            }

            scene.fishingRod.play('fishingRodAnim');
        }
    }

    if(scene.character.isFarming) {
        if(!scene.hoe) {
            scene.hoe = scene.add.sprite(scene.character.x, scene.character.y, 'character_farming');
            
            switch (scene.character.lastMoveX) {
                case 'left':
                    scene.hoe.setPosition(scene.character.x -20, scene.character.y);
                    scene.hoe.setScale(-1, 1);
                    break;

                case 'right':
                    scene.hoe.setPosition(scene.character.x + 20, scene.character.y);
                    scene.hoe.setScale(1, 1);
                    break;
            }
            scene.hoe.play('farmingHoeAnim');

            scene.hoe.on('animationcomplete', () => {
                scene.hoe.destroy();
                scene.hoe = null;
                scene.character.isFarming = false;
            });
        }
        else {
            switch (scene.character.lastMoveX) {
                case 'left':
                    scene.hoe.setPosition(scene.character.x - 20, scene.character.y);
                    scene.hoe.setScale(-1, 1);
                    break;

                case 'right':
                    scene.hoe.setPosition(scene.character.x + 20, scene.character.y);
                    scene.hoe.setScale(1, 1);
                    break;
            }
        }
    }
}