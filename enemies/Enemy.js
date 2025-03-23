import { takeDamage } from "../action/attacking.js";
import { createHpBar, updateHpBar } from "../tool_file/hp_bar.js";
import { drop_item } from "../tool_file/drop_item.js"
import { addEffectSceneToItem } from '../effects.js';

export default class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'enemy');
        this.sprite.setCollideWorldBounds(true);
        addEffectSceneToItem(scene, this.sprite);
        this.sprite.setSize(20, 16);
        this.sprite.entity = this;

        this.hpBar = createHpBar(scene, this.sprite, 20, 15, -15);

        this.sprite.play('enemy_idle_' + Phaser.Math.Between(1, 3), true);
        
        if (Phaser.Math.Between(0, 1) == 1) {
            this.sprite.flipX = true;
        }

        scene.physics.add.overlap(scene.character, this.sprite, (character, enemy) => {
            takeDamage(scene, enemy, -20);
        });
    };

    enemyTakeDamage(damage) {
        updateHpBar(this.hpBar, damage);

        if (this.hpBar.currentHealth <= 0) {
            this.hpBar.destroy();
            this.sprite.destroy();
            drop_item(this.scene, this.sprite.x, this.sprite.y, this.scene.character.x, this.scene.character.y, 'enemy');
        };
    }
}

export function spawnEnemies(scene) {
    scene.enemiesGroup = scene.physics.add.group();

    scene.anims.create({
        key: 'enemy_idle_1',
        frames: scene.anims.generateFrameNumbers('enemy1', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    scene.anims.create({
        key: 'enemy_idle_2',
        frames: scene.anims.generateFrameNumbers('enemy2', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    scene.anims.create({
        key: 'enemy_idle_3',
        frames: scene.anims.generateFrameNumbers('enemy3', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })

    for (let i = 0; i < Phaser.Math.Between(5, 10); i++) {
        const enemy = new Enemy(scene, Phaser.Math.Between(0, scene.worldGrid.length -1) *32, Phaser.Math.Between(0, scene.worldGrid[0].length -1) *32);
        scene.enemiesGroup.add(enemy.sprite);
    }
}