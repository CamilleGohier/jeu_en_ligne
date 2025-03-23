import { endChopping } from "./action/chopping.js";
import { endMining } from "./action/mining.js";
import { detectEnemies, endAttacking, takeDamage } from "./action/attacking.js";
import { createHpBar } from "./tool_file/hp_bar.js";

export function characterAnimations(scene) {
    scene.character = scene.physics.add.sprite(scene.scale.width / 2, scene.scale.height / 2, 'character').setCollideWorldBounds(true);
    scene.character.setSize(24, 16).setOffset(4, 16).setDepth(10);

    let hpBar = createHpBar(scene, scene.character, 100, 20, -20);
    scene.character.hpBar = hpBar;

    regeneration(scene);

    scene.cursors = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    scene.character.lastMove = 'down';
    scene.character.lastMoveX = 'left';

    scene.character.lockDirection = false;

    scene.character.isFishing = false;
    scene.character.isFarming = false;
    scene.character.isChopping = false;
    scene.character.isMining = false;
    
    scene.character.damageCooldown = false;

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

export function updateCharacterAnimation(scene) {
    let velocityX = 0;
    let velocityY = 0;
    let moving = false;

    scene.character.hpBar.setPosition(scene.character.x + scene.character.hpBar.offsetX, scene.character.y + scene.character.hpBar.offsetY);

    if (scene.canWalk.length == 0) {
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

        if (!scene.character.lockDirection) {
            if (scene.cursors.left.isDown) {
                scene.character.lastMove = 'left';
                scene.character.lastMoveX = 'left';
            }
            else if (scene.cursors.right.isDown) {
                scene.character.lastMove = 'right';
                scene.character.lastMoveX = 'right';
            }
        
            if (scene.cursors.up.isDown) {
                scene.character.lastMove = 'up';
            }
            else if (scene.cursors.down.isDown) {
                scene.character.lastMove = 'down';
            }
        }
    }

    scene.character.setVelocity(velocityX, velocityY);

    if (velocityY < 0 && scene.character.lastMove == 'up') {
        scene.character.anims.play('up', true);
    }
    else if (velocityY > 0 && scene.character.lastMove == 'down') {
        scene.character.anims.play('down', true);
    }
    else if (velocityX < 0 && scene.character.lastMove == 'left') {
        scene.character.anims.play('left', true);
    }
    else if (velocityX > 0 && scene.character.lastMove == 'right') {
        scene.character.anims.play('right', true);
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
                    scene.fishingRod.setPosition(scene.character.x - 20, scene.character.y);
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
                    scene.hoe.setPosition(scene.character.x - 20, scene.character.y);
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
        // Pour actualiser pendant le déplacement
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

    if(scene.character.isChopping) {
        if(!scene.axe) {
            scene.axe = scene.add.sprite(scene.character.x, scene.character.y, 'character_chopping');
            
            switch (scene.character.lastMoveX) {
                case 'left':
                    scene.axe.setPosition(scene.character.x - 20, scene.character.y);
                    scene.axe.setScale(-1, 1);
                    break;

                case 'right':
                    scene.axe.setPosition(scene.character.x + 20, scene.character.y);
                    scene.axe.setScale(1, 1);
                    break;
            }
            scene.axe.play('choppingAxeAnim');

            scene.axe.on('animationcomplete', () => {
                scene.axe.destroy();
                scene.axe = null;
                scene.character.isChopping = false;
                endChopping(scene);

            });
        }
    }

    if(scene.character.isMining) {
        if(!scene.pickaxe) {
            scene.pickaxe = scene.add.sprite(scene.character.x, scene.character.y, 'character_mining');
            
            switch (scene.character.lastMoveX) {
                case 'left':
                    scene.pickaxe.setPosition(scene.character.x - 20, scene.character.y);
                    scene.pickaxe.setScale(-1, 1);
                    break;

                case 'right':
                    scene.pickaxe.setPosition(scene.character.x + 20, scene.character.y);
                    scene.pickaxe.setScale(1, 1);
                    break;
            }
            scene.pickaxe.play('miningPickaxeAnim');

            scene.pickaxe.on('animationcomplete', () => {
                scene.pickaxe.destroy();
                scene.pickaxe = null;
                scene.character.isMining = false;
                endMining(scene);

            });
        }
    }

    if(scene.character.isAttacking) {
        if(!scene.sword) {
            scene.sword = scene.physics.add.sprite(scene.character.x, scene.character.y, 'character_attacking');
            
            switch (scene.character.lastMove) {
                case 'left':
                    scene.sword.setPosition(scene.character.x - 20, scene.character.y);
                    scene.sword.flipX = true;
                    break;

                case 'right':
                    scene.sword.setPosition(scene.character.x + 20, scene.character.y);
                    scene.sword.flipX = false;
                    break;

                case 'up':
                    scene.sword.setPosition(scene.character.x, scene.character.y - 20);
                    scene.sword.angle = -45;
                    scene.sword.flipX = false;
                    break;

                case 'down':
                    scene.sword.setPosition(scene.character.x, scene.character.y + 20);
                    scene.sword.angle = 45;
                    scene.sword.flipX = false;
                    break;
            }
            scene.sword.pos = scene.character.lastMove;
            scene.sword.play('attackingSwordAnim');

            scene.sword.on('animationcomplete', () => {
                scene.sword.destroy();
                scene.sword = null;
                scene.character.isAttacking = false;
                endAttacking(scene);
            });

            detectEnemies(scene);
        }
        // Pour actualiser pendant le déplacement
        else {
            switch (scene.sword.pos) {
                case 'left':
                    scene.sword.setPosition(scene.character.x - 20, scene.character.y);
                    break;

                case 'right':
                    scene.sword.setPosition(scene.character.x + 20, scene.character.y);
                    break;

                case 'up':
                    scene.sword.setPosition(scene.character.x, scene.character.y - 20);
                    break;

                case 'down':
                    scene.sword.setPosition(scene.character.x, scene.character.y + 20);
                    break;
            }
        }
    }
}

export function regeneration(scene) {
    scene.character.regeneration = scene.time.addEvent({
        delay: 1000,
        callback: () => {
            takeDamage(scene, null, 5);
        },
        loop: true
    })
}