import { dictionary } from "./data/dictionary.js";
import Inventory from "./stockage/Inventory.js";
import { dropObject } from "./toolFile/drop.js";
import Item from "./toolFile/Item.js";

export default class Feeder extends Item {
    constructor(scene, posRow, posCol, texture, positionNPC) {
        super (posRow, posCol, 'feeder', positionNPC);
        this.scene = scene;
        this.x = posCol * 32;
        this.y = posRow * 32;

        this.quantity = 0;

        this.sprite.setInteractive();

        this.sprite.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.fill();
            }
        })
    }

    fill() {
        if (this.quantity == dictionary[this.name].dispenser.maxQuantity) {
            return;
        }

        let feed = null;

        // Récupérer la quantité de blé depuis l'inventaire
        for (let row = 0; row < Inventory.savedContent.length; row++) {
            for (let col = 0; col < Inventory.savedContent[row].length; col++) {
                if (Inventory.savedContent[row][col] && Inventory.savedContent[row][col].name == 'wheat') {
                    feed = Inventory.savedContent[row][col];
                    feed.row = row;
                    feed.col = col;
                }
            }
        }

        if (!feed) {
            return;
        }

        if (feed.quantity + this.quantity < dictionary[this.name].dispenser.maxQuantity) {
            this.quantity += feed.quantity;
            this.scene.inventory.removeItem(feed.name, feed.quantity);
        }
        else {
            let quantityToRemove = dictionary[this.name].dispenser.maxQuantity - this.quantity;
            this.quantity = dictionary[this.name].dispenser.maxQuantity;
            this.scene.inventory.removeItem(feed.name, quantityToRemove);
            
        }
        this.sprite.setFrame(this.quantity);
    }

    empty(quantity) {
        if (this.quantity >= quantity) {
            this.quantity -= quantity;
            this.sprite.setFrame(this.quantity);
            return true;
        }
        return false;
    }

    removeItems() {
        if (this.quantity > 0) {
            for (let i = 0; i < this.quantity; i++) {
                dropObject(this.scene, this.sprite.x, this.sprite.y, 'wheat');
            }
        }
    }
}