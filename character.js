export function characterAnimations(scene) {
    scene.character = scene.physics.add.sprite(400, 300, 'character').setCollideWorldBounds(true);
    scene.cursors = scene.input.keyboard.createCursorKeys();
    
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
}

export function updateCharacterAnimation(scene) {
    let velocityX = 0;
    let velocityY = 0;
    let moving = false;

    if (scene.cursors.left.isDown) {
        velocityX = -160;
        moving = true;
    }
    else if (scene.cursors.right.isDown) {
        velocityX = 160;
        moving = true;
    }

    if (scene.cursors.up.isDown) {
        velocityY = -160;
        moving = true;
    }
    else if (scene.cursors.down.isDown) {
        velocityY = 160;
        moving = true;
    }

    if (velocityX != 0 && velocityY != 0) {
        const normalized = new Phaser.Math.Vector2(velocityX, velocityY).normalize().scale(160);
        velocityX = normalized.x;
        velocityY = normalized.y;
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
        scene.character.setTexture('character', 0);
    }
}