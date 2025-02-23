import { takeDamage } from "../action/attacking.js";
import { createHpBar, updateHpBar } from "../tool_file/hp_bar.js";
import { drop_item } from "../tool_file/drop_item.js"

export function spawnEnemies(scene) {
    scene.enemiesGroup = scene.physics.add.group();

    const enemy = scene.enemiesGroup.create(700, 300, 'enemy');
    enemy.setCollideWorldBounds(true);
    enemy.setSize(20, 16);

    const enemy2 = scene.enemiesGroup.create(730, 320, 'enemy');
    enemy2.setCollideWorldBounds(true);
    enemy2.setSize(20, 16);

    scene.anims.create({
        key: 'enemy_idle',
        frames: scene.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    scene.enemiesGroup.getChildren().forEach(enemy => {
        let hpBar = createHpBar(scene, enemy, 20, 15, -15);
        enemy.hpBar = hpBar;
        enemy.play('enemy_idle', true);

        scene.physics.add.overlap(scene.character, enemy, (character, enemy) => {
            takeDamage(scene, enemy, -20);
        });
    });
}

export function enemyTakeDamage(scene, enemy, damage) {
    updateHpBar(enemy.hpBar, damage);

    if (enemy.hpBar.currentHealth <= 0) {
        enemy.hpBar.destroy();
        enemy.destroy();
        drop_item(scene, enemy.x, enemy.y, scene.character.x, scene.character.y, "enemy");
    }
}