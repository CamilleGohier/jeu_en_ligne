import Inventory from './Inventory.js';
import { inventoryQueue } from '../toolFile/walkingQueue.js';
import Item from '../toolFile/Item.js';
import { dropObject } from '../toolFile/drop.js';
import { dictionary } from '../data/dictionary.js';

export default class Storage extends Item {
    constructor(scene, posRow, posCol, texture, rows, cols, positionNPC) {
        super (posRow, posCol, 'shelf', positionNPC);
        this.x = posCol * 32;
        this.y = posRow * 32;
        this.scene = scene;
        this.tileSize = 20;
        this.tileScale = 0.6;
        this.startX = this.x - (cols * this.tileSize) / 2 + this.tileSize /2;
        this.startY = this.y - this.tileSize * rows;
        this.rows = rows;
        this.cols = cols;
        this.area = this.scene.add.rectangle(this.startX + this.tileSize/4, this.startY - (this.rows * this.tileSize) /2 + this.tileSize + (this.rows % 2 != 0 ? this.tileSize/2 : 0), this.cols * this.tileSize, this.rows * this.tileSize).setOrigin(0);

        this.content = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.background = [];

        this.playerInventory = new Inventory(scene, this.x - (this.scene.inventory.cols * this.tileSize) / 2 + this.tileSize /2 + this.tileSize/4, this.y + (this.scene.inventory.rows * 20), this.tileSize, this.scene.inventory.rows, this.scene.inventory.cols, 1)

        this.sprite.setInteractive(new Phaser.Geom.Rectangle(0, 32, 32, 32), Phaser.Geom.Rectangle.Contains);

        this.createGrid(this.startX, this.startY);
        this.load();
        this.hide();

        this.sprite.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.toggleVisibility(this);
            }
        })
    }

    createGrid(startX, startY) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.tileSize + startX + this.tileSize/4;
                const y = r * this.tileSize + startY;
    
                const cell = this.scene.add.sprite(x, y, 'tile').setScale(this.tileScale).setDepth(100).setOrigin(0);

                this.background.push(cell);
            }
        }
    }

    addItem(name, quantity) {
        let itemPosition = this.findItemPosition(name);

        if (itemPosition) {
            let { row, col } = itemPosition;
            this.content[row][col].quantity.setText(parseInt(this.content[row][col].quantity.text) + quantity);
        }
        else {
            let emptyPosition = this.findEmptyPosition();
            
            if (emptyPosition) {
                let { row, col } = emptyPosition;
                const x = col * this.tileSize + this.startX + this.tileSize/4;
                const y = row * this.tileSize + this.startY;

                const item = this.scene.add.sprite(x, y, name).setInteractive().setScale(this.tileScale).setDepth(105).setOrigin(0);
                const itemText = this.scene.add.text(x + 8, y + 8, quantity.toString(), { font: '12px Arial', fill: '#000' }).setDepth(105);

                if (dictionary[name] && dictionary[name].origin) {
                    item.setOrigin(dictionary[name].origin[0], dictionary[name].origin[1]);
                }

                item.quantity = itemText;
                item.name = name;
                item.setData('row', row);
                item.setData('col', col);
                item.setData('inventoryType', this);
                item.setData('fixedToCamera', false);
                this.content[row][col] = item;

                this.scene.input.setDraggable(item);

                let visibility = this.background[0].visible;
                item.visible = visibility;
                itemText.visible = visibility;
            }
            else {
                console.log("Stockage plein, à gérer plus tard");
            }
        }
        this.save();
    }

    addItemAtPosition(name, quantity, row, col) {
        const x = col * this.tileSize + this.startX + this.tileSize/4;
        const y = row * this.tileSize + this.startY;

        const item = this.scene.add.sprite(x, y, name).setInteractive().setScale(this.tileScale).setDepth(105).setOrigin(0);
        const itemText = this.scene.add.text(x + 8, y + 8, quantity.toString(), { font: '12px Arial', fill: '#000' }).setDepth(105);

        if (dictionary[name] && dictionary[name].origin) {
            item.setOrigin(dictionary[name].origin[0], dictionary[name].origin[1]);
        }

        item.quantity = itemText;
        item.name = name;
        this.content[row][col] = item;
        item.setData('row', row);
        item.setData('col', col);
        item.setData('inventoryType', this);
        item.setData('fixedToCamera', false);

        this.scene.input.setDraggable(item);

        let visibility = this.background[0].visible;
        item.visible = visibility;
        itemText.visible = visibility;

        this.save();
    }

    removeItems() {
        this.hide();
        this.playerInventory.hide();

        this.content.flat().forEach(item => {
            if (item) {
                for (let quantity = 0; quantity < Number(item.quantity.text); quantity++) {
                    dropObject(this.scene, this.x, this.y, item.name);
                }
            }
        });
    }

    findItemPosition(name) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(this.content[row][col] && this.content[row][col].name == name) {
                    const quantity = this.content[row][col].quantity;
                    quantity.setText(parseInt(this.content[row][col].quantity.text) + quantity);
                    return { row, col };
                }
            }
        }
        return null;
    }

    findEmptyPosition(name) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(!this.content[row][col]) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    show() {
        this.load();

        this.content.forEach(row => {
            row.forEach(icon => {
                if(icon) {
                    icon.setVisible(true);
                    if (icon.quantity) {
                        icon.quantity.setVisible(true);
                    }
                }
            })
        })
        this.background.forEach(cell => cell.setVisible(true));

        this.timer = this.scene.time.addEvent({
            delay: 500,
            callback: () => this.checkDistancePlayer(),
            callbackScope: this,
            loop: true
        })

        this.isVisible = true;

        inventoryQueue(this.scene, 'tradeOpen', 'cannot');
    }

    hide() {
        this.save();

        this.content.forEach(row => {
            row.forEach(icon => {
                if(icon) {
                    icon.setVisible(false);
                    if (icon.quantity) {
                        icon.quantity.setVisible(false);
                    }
                }
            })
        })
        this.background.forEach(icon => icon.setVisible(false));
        this.playerInventory.hide();
        this.isVisible = false;

        inventoryQueue(this.scene, 'tradeOpen', 'can');
    }

    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
            this.playerInventory.hide();
            this.scene.currentOpenedInterface = null;
        }
        else {
            const distance = Phaser.Math.Distance.Between(this.scene.character.x, this.scene.character.y, this.sprite.x, this.sprite.y);
            
            if (distance < 50) {
                this.show();
                this.playerInventory.show();
                if (this.scene.currentOpenedInterface instanceof Storage) {
                    this.scene.currentOpenedInterface.clicked = false;
                    this.scene.currentOpenedInterface.sprite.setTexture('shelf'+(this.scene.currentOpenedInterface.color == 1 ? '' : this.scene.currentOpenedInterface.color));
                    this.scene.currentOpenedInterface.toggleVisibility();
                }
                this.scene.currentOpenedInterface = this;
            }
        }
    }

    save() {
        this.savedContent = this.content.map(row => row.map(item => {
            if (item) {
                return { name: item.name, quantity: parseInt(item.quantity.text)}
            }
            return null
        }))
    }

    load() {
        this.clear();
        if (this.savedContent) {
            this.savedContent.forEach((row, rowIndex) => {
                row.forEach((item, colIndex) => {
                    if (item) {
                        this.addItemAtPosition(item.name, item.quantity, rowIndex, colIndex);
                    }
                })
            })
        }
    }

    clear() {
        this.content.forEach(row => {
            row.forEach(item => {
                if (item) {
                    item.quantity.destroy();
                    item.destroy();
                }
            })
        })
        this.content = Array.from({ length: this.rows}, () => Array(this.cols).fill(null));
    }

    checkDistancePlayer() {
        const distance = Phaser.Math.Distance.Between(this.scene.character.x, this.scene.character.y, this.sprite.x, this.sprite.y);

        if (distance > 50) {
            this.hide();
            this.playerInventory.hide();
            this.timer.remove();
            if (this.scene.currentOpenedInterface == this) {
                this.scene.currentOpenedInterface = null;
            }
            this.sprite.setTexture('shelf'+(this.color == 1 ? '' : this.color));
            this.sprite.setFrame(this.currentFrame);
            this.clicked = false;
        }
    }
}