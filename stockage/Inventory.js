import { content } from '../data/variables.js';

export default class Inventory {
    static savedContent = null;
    
    constructor(scene, startX, startY, tileSize, rows, cols, dynamic = 1) {
        this.scene = scene;

        this.rows = rows;
        this.cols = cols;
        this.startX = startX;
        this.startY = startY;
        this.dynamic = dynamic;

        this.background = [];
        this.tileSize = tileSize;
        this.tileScale = tileSize / 32;
        this.content = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.area = this.scene.add.rectangle(this.startX, this.startY, this.cols * this.tileSize, this.rows * this.tileSize).setScrollFactor(this.dynamic).setOrigin(0);

        this.isVisible = true;

        this.createGrid();
        this.hide();

        if (!Inventory.savedContent) {
            Inventory.savedContent = content;
            this.load();
        }
    }

    createGrid() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.tileSize + this.startX;
                const y = r * this.tileSize + this.startY;

                const cell = this.scene.add.sprite(x, y, 'tile').setScrollFactor(this.dynamic).setScale(this.tileScale).setDepth(100).setOrigin(0);
                this.background.push(cell);
            }
        }
    }

    createItem(name, quantity, x, y) {
        const item = this.scene.add.sprite(x, y, name).setInteractive().setScale(this.tileScale).setScrollFactor(this.dynamic).setVisible(this.isVisible).setDepth(105).setOrigin(0);
        const itemText = this.scene.add.text(x + 8, y + 8, quantity.toString(), { font: '12px Arial', fill: '#000' }).setScrollFactor(this.dynamic).setVisible(this.isVisible).setDepth(105);
        
        if (this.dynamic == 0) {
            itemText.setPosition(x + 16, y + 16);
        }
        
        item.quantity = itemText;
        item.name = name;
        item.setData('fixedToCamera', (this.dynamic == 0));
        item.setData('inventoryType', this);

        this.scene.input.setDraggable(item);
        return item;
    }

    addItem(name, quantity) {
        this.load();
        let itemPosition = this.findItemPosition(name);

        // L'item à ajouter est déjà dans l'inventaire 
        if (itemPosition) {
            
            let { row, col } = itemPosition;
            this.content[row][col].quantity.setText(parseInt(this.content[row][col].quantity.text) + quantity);
            this.save();
        }
        // L'item à ajouter n'est pas encore dans l'inventaire
        else {
            let emptyPosition = this.findEmptyPosition();

            if (emptyPosition) {
                let { row, col } = emptyPosition;
                const x = col * this.tileSize + this.startX;
                const y = row * this.tileSize + this.startY;

                const item = this.createItem(name, quantity, x, y);

                this.content[row][col] = item;
                item.setData('row', row);
                item.setData('col', col);

                this.save();
                return item;
            }
            else {
                console.log("Inventaire plein, à gérer plus tard");
            }
        }
    }

    addItemAtPosition(name, quantity, row, col) {
        this.load();
        const x = col * this.tileSize + this.startX;
        const y = row * this.tileSize + this.startY;

        const item = this.createItem(name, quantity, x, y);
        this.content[row][col] = item;
        item.setData('row', row);
        item.setData('col', col);

        this.save();
        return item;
    }

    removeItem(name, quantity) {
        this.load();
        this.content.forEach((row, rowIndex) => {
            row.forEach((item, colIndex) => {
                if (item && item.name == name && quantity > 0) {
                    let currentQuantity = Number(item.quantity.text);

                    if (currentQuantity >= quantity) {
                        currentQuantity -= quantity;
                        quantity = 0;
                    }
                    else {
                        quantity -= currentQuantity;
                        currentQuantity = 0;
                    }

                    item.quantity.setText(currentQuantity.toString());
                    
                    if (currentQuantity <= 0) {
                        item.quantity.destroy();
                        item.destroy();
                        this.content[rowIndex][colIndex] = null;
                    }

                    if (quantity == 0) {
                        return
                    }
                }
            })
        })
        this.save();
    }

    findItemPosition(name) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(this.content[row][col] && this.content[row][col].name == name) {
                    return { row, col }
                }
            }
        }
        return null;
    }

    findEmptyPosition() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!Inventory.savedContent[row][col]) {
                    return { row, col }
                }
            }
        }
        return null;
    }

    save() {
        Inventory.savedContent = this.content.map(row => row.map(item => {
            if (item) {
                return { name: item.name, quantity: parseInt(item.quantity.text) }
            }
            return null;
        }))
    }

    load() {
        this.clear();
        this.content = Inventory.savedContent.map((row, rowIndex) => row.map((item, colIndex) => {
            if (item) {
                return this.addItemfromLoad(item.name, item.quantity, rowIndex, colIndex);
            }
            return null;
        }))
    }

    addItemfromLoad(name, quantity, row, col) {
        const x = col * this.tileSize + this.startX;
        const y = row * this.tileSize + this.startY;

        const item = this.createItem(name, quantity, x, y);
        this.content[row][col] = item;
        item.setData('row', row);
        item.setData('col', col);

        this.save();
        return item;
    }

    show() {
        if (this.isVisible) {
            return
        }
        this.isVisible = true;

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
    }

    hide() {
        if (!this.isVisible) {
            return
        }
        this.isVisible = false;

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
    }

    clear() {
        this.content.forEach(row => {
            row.forEach(item => {
                if(item) {
                    item.quantity.destroy();
                    item.destroy();
                }
            })
        })
        this.content = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    }
}