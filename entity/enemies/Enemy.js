import { takeDamage } from "../../action/attacking.js";
import { createHpBar, updateHpBar } from "../../toolFile/hpBar.js";
import { dropLoot } from "../../toolFile/drop.js"
import { addEffectSceneToItem } from '../../effects.js';

export default class Enemy {
    constructor(scene, row, col) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(col *32, row *32, "slime" + Phaser.Math.Between(1, 3));
        this.sprite.setCollideWorldBounds(true).setOrigin(0);
        addEffectSceneToItem(scene, this.sprite);
        this.sprite.setSize(20, 16);
        this.sprite.entity = this;

        this.hpBar = createHpBar(scene, this.sprite, 20, 32, 0);

        this.sprite.play('slime_idle_' + Phaser.Math.Between(1, 3), true);
        
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
            dropLoot(this.scene, this.sprite.x, this.sprite.y, 'enemy');
        };
    }
}