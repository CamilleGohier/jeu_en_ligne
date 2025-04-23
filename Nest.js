import { dropLoot } from "./toolFile/drop.js";
import Item from "./toolFile/Item.js";

export default class Nest extends Item {
    constructor(scene, posRow, posCol, texture, positionNPC) {
        super (posRow, posCol, 'nest', positionNPC);
        this.scene = scene;
        this.x = posCol * 32;
        this.y = posRow * 32;

        this.egg = false;
        this.crossable = true;

        this.sprite.setInteractive();

        this.sprite.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.empty();
            }
        })
    }

    empty() {
        if (!this.egg) {
            return;
        }

        this.egg = false;
        dropLoot(this.scene, this.sprite.x, this.sprite.y, 'nest');
        this.sprite.setFrame(0);
    }

    fill() {
        if (this.egg) {
            return;
        }

        this.egg = true;
        this.sprite.setFrame(1);
    }
}