import { walking_queue } from "./tool_file/walking_queue.js";

const tileSize = 32;
const rows = 2;
const cols = 10;

const inventoryX = 255;
const inventoryY = 450;

export function createInventory(scene) {

    scene.inventory = [];
    scene.inventoryBackground = [];

    for (let r = 0; r < rows; r++) {

        scene.inventory[r] = [];

        for (let c = 0; c < cols; c++) {
            const x = c * tileSize + inventoryX;
            const y = r * tileSize + inventoryY;

            const cell = scene.add.sprite(x, y, 'tile').setScrollFactor(0);
            scene.inventoryBackground.push(cell);
            scene.inventory[r][c] = null;
        }
    }

    add_inventory(scene, 'wheat_seed', 40);
    add_inventory(scene, 'tomato_seed', 1);
    add_inventory(scene, 'wheat', 1);
    add_inventory(scene, 'tomato', 1);
    add_inventory(scene, 'tomato_seed', 1);

    hideInventory(scene);
}

export function add_inventory(scene, name, quantity) {

    let item = null;
    let alreadyInInventory = 0;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if(scene.inventory[row][col] && scene.inventory[row][col].texture.key == name) {
                alreadyInInventory = scene.inventory[row][col];
            }
        }
    }

    if (alreadyInInventory) {
        alreadyInInventory.quantity.text = parseInt(alreadyInInventory.quantity.text) + parseInt(quantity);
    }
    else {
        let added_to_inventory = false;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (scene.inventory[row][col] == null && !added_to_inventory) {
                    item = scene.add.sprite(col * tileSize + inventoryX, row * tileSize + inventoryY, name).setInteractive().setScale(1).setScrollFactor(0);
                    scene.inventory[row][col] = item;

                    const item_text = scene.add.text(item.x, item.y, quantity.toString(), {font: '12px Arial', fill: '#000'}).setScrollFactor(0);
                    item.quantity = item_text;
                    item.name = name;

                    added_to_inventory = true;
                    setDraggableItem(scene, item);

                    // Récupère la visibilité d'une tile
                    let visibility = scene.inventoryBackground[0].visible;
                    item.visible = visibility;
                    item_text.visible = visibility;
                }
            }
        }
    }

}

export function showInventory(scene) {
    walking_queue(scene, 'inventoryOpen', 'cannot');
    scene.inventory.forEach(row => {
        row.forEach(icon => {
            if(icon) {
                icon.setVisible(true);
                if (icon.quantity) {
                    icon.quantity.setVisible(true);
                }
            }
        })
    })

    scene.inventoryBackground.forEach(icon => icon.setVisible(true));
}

export function hideInventory(scene) {
    walking_queue(scene, 'inventoryOpen', 'can');
    scene.inventory.forEach(row => {
        row.forEach(icon => {
            if(icon) {
                icon.setVisible(false);
                if (icon.quantity) {
                    icon.quantity.setVisible(false);
                }
            }
        })
    })

    scene.inventoryBackground.forEach(icon => icon.setVisible(false));
}

function setDraggableItem(scene, item) {
    scene.input.setDraggable(item);

    item.on('dragstart', () => {
        item.setScale(0.6);
        item.quantity.setScale(0.8);
        item.setData('startX', item.x);
        item.setData('startY', item.y);
        const col = Math.floor((item.x - inventoryX) / tileSize);
        const row = Math.floor((item.y - inventoryY) / tileSize);
        item.setData('col', col);
        item.setData('row', row);
        scene.inventory[row][col] = null;
    });
    
    item.on('drag', (pointer, dragX, dragY) => {
        item.x = dragX;
        item.y = dragY;
        item.quantity.x = dragX;
        item.quantity.y = dragY;
    });
    
    item.on('dragend', () => {
        const col = Math.floor((item.x - inventoryX + tileSize /2) / tileSize);
        const row = Math.floor((item.y - inventoryY + tileSize /2) / tileSize);
        item.setScale(1);
        item.quantity.setScale(1);

        if(row >= 0 && row < rows && col >= 0 && col < cols) {
            const x = col * tileSize + inventoryX;
            const y = row * tileSize + inventoryY;

            if (scene.inventory[row][col] == null) {
                scene.inventory[row][col] = item;
                item.x = x;
                item.y = y;
                item.quantity.x = x;
                item.quantity.y = y;
            }
            else {
                scene.inventory[item.getData('row')][item.getData('col')] = item;
                item.x = item.getData('col') * tileSize + inventoryX;
                item.y = item.getData('row') * tileSize + inventoryY;
                item.quantity.x = item.getData('startX');
                item.quantity.y = item.getData('startY');
            }
        }
        else {
            item.x = item.getData('startX');
            item.y = item.getData('startY');
            item.quantity.x = item.getData('startX');
            item.quantity.y = item.getData('startY');
        }
    });
}

