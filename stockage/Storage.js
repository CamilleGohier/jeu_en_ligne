import Inventory from './Inventory.js';
import { inventoryQueue } from '../tool_file/walking_queue.js';

export default class Storage {
    constructor(scene, x, y, texture, rows, cols) {
        this.scene = scene;
        this.tileSize = 20;
        this.tileScale = 0.6;
        this.startX = x - (cols * this.tileSize) / 2 + this.tileSize /2;
        this.startY = y - this.tileSize * rows;
        this.rows = rows;
        this.cols = cols;
        this.area = this.scene.add.rectangle(this.startX + (this.cols * this.tileSize) /2 - this.tileSize/2, this.startY + (this.rows * this.tileSize) /2 - this.tileSize/2, this.cols * this.tileSize, this.rows * this.tileSize);

        this.content = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.background = [];

        this.playerInventory = new Inventory(scene, x - (this.scene.inventory.cols * this.tileSize)/2 + this.tileSize /2, y + (this.scene.inventory.rows * 20), this.tileSize, this.scene.inventory.rows, this.scene.inventory.cols, 1)

        const sprite = scene.add.sprite(x, y, texture).setInteractive();
        this.sprite = sprite;

        this.createGrid(this.startX, this.startY);
        this.load();
        this.hide();

        this.sprite.on('pointerdown', () => {
            this.toggleVisibility(this);
        })
    }

    createGrid(startX, startY) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.tileSize + startX;
                const y = r * this.tileSize + startY;
    
                const cell = this.scene.add.sprite(x, y, 'tile').setScale(this.tileScale);

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
                const x = col * this.tileSize + this.startX;
                const y = row * this.tileSize + this.startY;

                const item = this.scene.add.sprite(x, y, name).setInteractive().setScale(this.tileScale);
                const itemText = this.scene.add.text(x, y, quantity.toString(), { font: '12px Arial', fill: '#000' });

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
        const x = col * this.tileSize + this.startX;
        const y = row * this.tileSize + this.startY;

        const item = this.scene.add.sprite(x, y, name).setInteractive().setScale(this.tileScale);
        const itemText = this.scene.add.text(x, y, quantity.toString(), { font: '12px Arial', fill: '#000' });

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

    removeItem(name, quantity) {
        // Peut-être un jour j'en aurai besoin
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

        const timer = this.scene.time.addEvent({
            delay: 500,
            callback: () => this.checkDistancePlayer(timer),
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
        this.isVisible = false;

        inventoryQueue(this.scene, 'tradeOpen', 'can');
    }

    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
            this.playerInventory.hide();
        }
        else {
            const distance = Phaser.Math.Distance.Between(this.scene.character.x, this.scene.character.y, this.sprite.x, this.sprite.y);
            
            if (distance < 50) {
                this.show();
                this.playerInventory.show();
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

    checkDistancePlayer(timer) {
        const distance = Phaser.Math.Distance.Between(this.scene.character.x, this.scene.character.y, this.sprite.x, this.sprite.y);

        if (distance > 50) {
            this.hide();
            this.playerInventory.hide();
            timer.remove();
        }
    }
}