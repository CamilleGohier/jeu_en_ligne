import { updateHpBar } from '../toolFile/hpBar.js';

const invicibilityDuration = 2000;

export function startAttacking(scene) {
    scene.character.isAttacking = true;
    scene.character.lockDirection = true;
}

export function detectEnemies(scene) {
    scene.sword.hitEnemies = [];
    
    scene.physics.add.overlap(scene.sword, scene.enemiesGroup, (sword, enemy) => {
        if (!scene.sword.hitEnemies.find(e => e == enemy)) {
            enemy.entity.enemyTakeDamage(-5);
            scene.sword.hitEnemies.push(enemy);
        }
    });
}

export function endAttacking(scene) {
    scene.character.lockDirection = false;
}

export function takeDamage(scene, enemy, damage) {
    if (!scene.character.damageCooldown) {
        updateHpBar(scene.character.hpBar, damage);

        if (scene.character.hpBar.currentHealth <= 0) {
            console.log("GAME OVER");
        }

        if(damage < 0) {
            scene.character.damageCooldown = true;

            scene.time.delayedCall(invicibilityDuration, () => {
                scene.character.damageCooldown = false;
            });
    
            scene.time.addEvent({
                delay: 100,
                callback: () => {
                    scene.character.setAlpha(scene.character.alpha == 1 ? 0.5 : 1);
                },
                repeat: invicibilityDuration / 100 -1,
            })
        }
    }
}