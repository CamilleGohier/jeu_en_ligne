import { endChopping } from "../action/chopping.js";
import { endMining } from "../action/mining.js";
import { detectEnemies, endAttacking, takeDamage } from "../action/attacking.js";
import { createHpBar } from "../toolFile/hpBar.js";
import { calculateDepth } from "../calculateDepth.js";

export function characterAnimations(scene) {
    scene.character = scene.physics.add.sprite(scene.scale.width / 2, scene.scale.height / 2, 'character').setCollideWorldBounds(true);
    scene.character.setSize(24, 16).setOffset(4, 16).setOrigin(0).setDepth(10);

    let hpBar = createHpBar(scene, scene.character, 100, 34, -2);
    scene.character.hpBar = hpBar;

    regeneration(scene);

    scene.cursors = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    scene.character.lastMove = 'down';

    scene.character.lockDirection = false;

    scene.character.isFishing = false;
    scene.character.isFarming = false;
    scene.character.isChopping = false;
    scene.character.isMining = false;
    
    scene.character.damageCooldown = false;
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
            }
            else if (scene.cursors.right.isDown) {
                scene.character.lastMove = 'right';
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
    scene.character.setDepth(calculateDepth(scene, scene.character.y));

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

    const worldPosition = scene.cameras.main.getWorldPoint(scene.input.activePointer.x, scene.input.activePointer.y);

    if(scene.character.isFishing) {
        if(!scene.fishingRod) {
            scene.fishingRod = scene.add.sprite(scene.character.x, scene.character.y, 'character_fishing').setOrigin(0).setDepth(15);
            scene.fishingRod.setPipeline('Light2D');

            if (worldPosition.x < scene.character.x + 16) {
                scene.fishingRod.setPosition(scene.character.x - 20, scene.character.y);
                scene.character.lastMove = 'left';
                scene.fishingRod.setScale(1, 1);
            }
            else {
                scene.fishingRod.setPosition(scene.character.x + 50, scene.character.y);
                scene.character.lastMove = 'right';
                scene.fishingRod.setScale(-1, 1);
            }

            scene.fishingRod.play('fishingRodAnim');
        }
    }

    if(scene.character.isFarming) {
        if(!scene.hoe) {
            scene.hoe = scene.add.sprite(scene.character.x, scene.character.y, 'character_farming').setOrigin(0).setDepth(15);
            scene.hoe.setPipeline('Light2D');

            if (worldPosition.x < scene.character.x + 16) {
                scene.hoe.setPosition(scene.character.x + 10, scene.character.y);
                scene.character.lastMove = 'left';
                scene.hoe.setScale(-1, 1);
            }
            else {
                scene.hoe.setPosition(scene.character.x + 20, scene.character.y);
                scene.character.lastMove = 'right';
                scene.hoe.setScale(1, 1);
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
            switch (scene.character.lastMove) {
                case 'left':
                    scene.hoe.setPosition(scene.character.x + 10, scene.character.y);
                    scene.hoe.setScale(-1, 1);
                    break;

                default :
                    scene.hoe.setPosition(scene.character.x + 20, scene.character.y);
                    scene.hoe.setScale(1, 1);
                    break;
            }
        }
    }

    if(scene.character.isDigging) {
        if(!scene.shovel) {
            scene.shovel = scene.add.sprite(scene.character.x, scene.character.y, 'character_digging').setOrigin(0).setDepth(15);
            scene.shovel.setPipeline('Light2D');

            if (worldPosition.x < scene.character.x + 16) {
                scene.shovel.setPosition(scene.character.x + 10, scene.character.y);
                scene.character.lastMove = 'left';
                scene.shovel.setScale(-1, 1);
            }
            else {
                scene.shovel.setPosition(scene.character.x + 20, scene.character.y);
                scene.character.lastMove = 'right';
                scene.shovel.setScale(1, 1);
            }
            scene.shovel.play('diggingShovelAnim');

            scene.shovel.on('animationcomplete', () => {
                scene.shovel.destroy();
                scene.shovel = null;
                scene.character.isDigging = false;
            });
        }
        // Pour actualiser pendant le déplacement
        else {
            switch (scene.character.lastMove) {
                case 'left':
                    scene.shovel.setPosition(scene.character.x + 10, scene.character.y);
                    scene.shovel.setScale(-1, 1);
                    break;

                default :
                    scene.shovel.setPosition(scene.character.x + 20, scene.character.y);
                    scene.shovel.setScale(1, 1);
                    break;
            }
        }
    }

    if(scene.character.isChopping) {
        if(!scene.axe) {
            scene.axe = scene.add.sprite(scene.character.x, scene.character.y, 'character_chopping').setOrigin(0).setDepth(15);
            scene.axe.setPipeline('Light2D');

            if (worldPosition.x < scene.character.x + 16) {
                scene.axe.setPosition(scene.character.x + 10, scene.character.y);
                scene.character.lastMove = 'left';
                scene.axe.setScale(-1, 1);
            }
            else {
                scene.axe.setPosition(scene.character.x + 20, scene.character.y);
                scene.character.lastMove = 'right';
                scene.axe.setScale(1, 1);
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
            scene.pickaxe = scene.add.sprite(scene.character.x, scene.character.y, 'character_mining').setOrigin(0).setDepth(15);
            scene.pickaxe.setPipeline('Light2D');

            if (worldPosition.x < scene.character.x + 16) {
                scene.pickaxe.setPosition(scene.character.x + 10, scene.character.y);
                scene.character.lastMove = 'left';
                scene.pickaxe.setScale(-1, 1);
            }
            else {
                scene.pickaxe.setPosition(scene.character.x + 20, scene.character.y);
                scene.character.lastMove = 'right';
                scene.pickaxe.setScale(1, 1);
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
            scene.sword = scene.physics.add.sprite(scene.character.x, scene.character.y, 'character_attacking').setOrigin(0.5).setDepth(15);
            scene.sword.setPipeline('Light2D');

            const direction = { x: worldPosition.x - scene.character.x, y: worldPosition.y - scene.character.y };

            if ((direction.x < 0 && direction.y < 0 && Math.abs(direction.x) > Math.abs(direction.y)) || (direction.x < 0 && direction.y > 0 && Math.abs(direction.x) > Math.abs(direction.y))) {
                scene.sword.setPosition(scene.character.x - 10, scene.character.y + 20);
                scene.character.lastMove = 'left';
                scene.sword.flipX = true;
            }
            if ((direction.x > 0 && direction.y > 0 && Math.abs(direction.x) > Math.abs(direction.y)) || (direction.x > 0 && direction.y < 0 && Math.abs(direction.x) > Math.abs(direction.y))) {
                scene.sword.setPosition(scene.character.x + 40, scene.character.y + 20);
                scene.character.lastMove = 'right';
                scene.sword.flipX = false;
            }
            if ((direction.x > 0 && direction.y < 0 && Math.abs(direction.x) < Math.abs(direction.y)) || (direction.x < 0 && direction.y < 0 && Math.abs(direction.x) < Math.abs(direction.y))) {
                scene.sword.setPosition(scene.character.x + 16, scene.character.y);
                scene.sword.angle = -45;
                scene.sword.setDepth(5)
                scene.character.lastMove = 'up';
                scene.sword.flipX = false;
            }
            if ((direction.x > 0 && direction.y > 0 && Math.abs(direction.x) < Math.abs(direction.y)) || (direction.x < 0 && direction.y > 0 && Math.abs(direction.x) < Math.abs(direction.y))) {
                scene.sword.setPosition(scene.character.x + 16, scene.character.y + 40);
                scene.sword.angle = 45;
                scene.character.lastMove = 'down';
                scene.sword.flipX = false;
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
                    scene.sword.setPosition(scene.character.x - 10, scene.character.y + 20);
                    break;

                case 'right':
                    scene.sword.setPosition(scene.character.x + 40, scene.character.y + 20);
                    break;

                case 'up':
                    scene.sword.setPosition(scene.character.x + 16, scene.character.y);
                    break;

                case 'down':
                    scene.sword.setPosition(scene.character.x + 16, scene.character.y + 40);
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