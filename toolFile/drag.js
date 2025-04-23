import Interface from '../stockage/Interface.js';
import Inventory from '../stockage/Inventory.js';
import SecondaryToolbar from '../stockage/SecondaryToolbar.js';
import Storage from '../stockage/Storage.js';

export function initializeDragAndDrop(scene) {
    scene.input.on('dragstart', ondragStart);
    scene.input.on('drag', onDrag);
    scene.input.on('dragend', onDragEnd);
}

function ondragStart(pointer, item) {
    // Récupère les informations de l'item en main
    item.setScale(item.scale - 0.2);
    item.quantity.setScale(item.quantity.scale - 0.2);
    item.setData('startX', item.x);
    item.setData('startY', item.y);
    item.setData('quantityOffset', item.quantity.x - item.x);

    if (item.getData('inventoryType') instanceof Interface) {
        item.getData('inventoryType').setDragInterface(item.name);
    }
}

function onDrag(pointer, item, dragX, dragY) {
    // Déplace l'item en main avec les mouvements de la souris
    item.x = dragX + 5;
    item.y = dragY + 5;
    item.quantity.x = item.x + item.getData('quantityOffset');
    item.quantity.y = item.y + item.getData('quantityOffset');
}

function onDragEnd(pointer, item) {
    // Gère le placement de l'item quand on le lâche
    let worldPoint = {};

    if(item.getData('fixedToCamera') == true) {
        worldPoint.x = pointer.position.x;
        worldPoint.y = pointer.position.y;
    }
    else {
        worldPoint = item.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    }

    item.setScale(item.scale + 0.2);
    item.quantity.setScale(item.quantity.scale + 0.2);

    const scene = item.scene;
    const originContainer = item.getData('inventoryType');
    const targetContainer = findDropContainer(scene, worldPoint);

    if (targetContainer) {
        const targetCol = Math.floor((worldPoint.x - targetContainer.startX) / targetContainer.tileSize);
        const targetRow = Math.floor((worldPoint.y - targetContainer.startY) / targetContainer.tileSize);
        
        // Barre secondaire dans l'inventaire
        if (targetContainer instanceof SecondaryToolbar) {
            addToSecondaryToolbar(targetContainer, item, worldPoint);
        }
        // Fusion des objets de même nom
        else if (targetContainer.content[targetRow][targetCol] && targetContainer.content[targetRow][targetCol].name == item.name && item != targetContainer.content[targetRow][targetCol]) {
            mergeItem(originContainer, targetContainer, item, worldPoint.x, worldPoint.y);
        }
        // Coffre -> Inventaire
        else if (originContainer instanceof Storage && targetContainer instanceof Inventory) {
            transferItem(originContainer, targetContainer, item, worldPoint.x, worldPoint.y);
        }
        // Inventaire -> coffre
        else if (originContainer instanceof Inventory && targetContainer instanceof Storage) {
            transferItem(originContainer, targetContainer, item, worldPoint.x, worldPoint.y);
        }
        // Dans le même stockage
        else {
            moveItemWithinContainer(item, targetContainer);
        }
    }
    // Position invalide
    else {
        resetItemPosition(item);
    }

    if (originContainer instanceof Interface) {
        originContainer.removeDragInterface();
    }
}

function findDropContainer(scene, worldPoint) {
    if (scene.currentOpenedInterface instanceof Storage) {
        if (Phaser.Geom.Rectangle.Contains(scene.currentOpenedInterface.playerInventory.area.getBounds(), worldPoint.x, worldPoint.y)) {
            return scene.currentOpenedInterface.playerInventory;
        }
        
        if (Phaser.Geom.Rectangle.Contains(scene.currentOpenedInterface.area.getBounds(), worldPoint.x, worldPoint.y)) {
            return scene.currentOpenedInterface;
        }
    }

    if (scene.currentOpenedInterface instanceof Interface) {
        let secondaryToolbar = null;
        scene.currentOpenedInterface.areas.forEach(s => {
            if (Phaser.Geom.Rectangle.Contains(s.area.getBounds(), worldPoint.x, worldPoint.y)) {
                secondaryToolbar = s;
            }
        })
        if (secondaryToolbar) {
            return secondaryToolbar;
        }

        if (Phaser.Geom.Rectangle.Contains(scene.inventory.area.getBounds(), worldPoint.x, worldPoint.y)) {
            return scene.inventory;
        }
    }

    return null;
}

function addToSecondaryToolbar(toContainer, item, worldPoint) {
    const targetCol = Math.floor((worldPoint.x - toContainer.startX) / toContainer.tileSize);
    toContainer.addItem(targetCol, item.name);
    resetItemPosition(item, item.scene.inventory);
}

function mergeItem(fromContainer, toContainer, item, worldPointX, worldPointY) {
    const targetCol = Math.floor((worldPointX - toContainer.startX) / toContainer.tileSize);
    const targetRow = Math.floor((worldPointY - toContainer.startY) / toContainer.tileSize);

    toContainer.content[targetRow][targetCol].quantity.setText(parseInt(toContainer.content[targetRow][targetCol].quantity.text) + parseInt(item.quantity.text));
    fromContainer.content[item.getData('row')][item.getData('col')] = null;
    item.quantity.destroy();
    item.destroy();
    fromContainer.save();
    toContainer.save();
}

function transferItem(fromContainer, toContainer, item, worldPointX, worldPointY) {
    const col = item.getData('col');
    const row = item.getData('row');
    const targetCol = Math.floor((worldPointX - toContainer.startX) / toContainer.tileSize);
    const targetRow = Math.floor((worldPointY - toContainer.startY) / toContainer.tileSize);
    const quantity = parseInt(item.quantity.text);

    if (isPositionValid(toContainer, targetRow, targetCol)) {
        fromContainer.content[row][col] = null;
        toContainer.addItemAtPosition(item.name, quantity, targetRow, targetCol);
    
        item.quantity.destroy();
        item.destroy();
        fromContainer.save();
    }
    else {
        resetItemPosition(item);
    }
}

function moveItemWithinContainer(item, container) {
    const targetCol = Math.floor((item.x - container.startX) / container.tileSize);
    const targetRow = Math.floor((item.y - container.startY) / container.tileSize);

    if (isPositionValid(container, targetRow, targetCol)) {
        container.content[item.getData('row')][item.getData('col')] = null;
        item.setData('col', targetCol);
        item.setData('row', targetRow);
        container.content[targetRow][targetCol] = item;

        item.x = targetCol * container.tileSize + container.startX + (container instanceof Inventory ? 0 : + container.tileSize/4);
        item.y = targetRow * container.tileSize + container.startY;
        item.quantity.x = item.x + 8 + (container.tileSize == 32 ? 8 : 0);
        item.quantity.y = item.y + 8 + (container.tileSize == 32 ? 8 : 0);

        container.save();
    }
    else {
        resetItemPosition(item, container);
    }
}

function isPositionValid(container, row, col) {
    return (row >= 0 && row < container.rows && col >= 0 && col < container.cols && !container.content[row][col]);
}

function resetItemPosition(item, container) {
    item.x = item.getData('startX');
    item.y = item.getData('startY');
    item.quantity.x = item.getData('startX') + item.getData('quantityOffset');
    item.quantity.y = item.getData('startY') + item.getData('quantityOffset');
}