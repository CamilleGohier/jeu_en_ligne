import { tools } from '../data/variables.js';
import Inventory from '../stockage/Inventory.js';
import { dictionary } from '../data/dictionary.js';
import Item from '../toolFile/Item.js';
import { dropObject } from '../toolFile/drop.js';
import Storage from '../stockage/Storage.js';
import Feeder from '../Feeder.js';
import Nest from '../Nest.js';
import { calculateDepth } from '../calculateDepth.js';

let lastPointer = { y: 0, x: 0 };
let lastUpdateTime = 0;
let item = null;

const positionsNPC = [
    { y: 1, x: 0},
    { y: 0, x: -1},
    { y: -1, x: 0},
    { y: 0, x: 1}
]

export function startPlacing(scene, pointer) {
    const gridPosition = getWorldGridPosition(scene, pointer);

    if (!checkPositionAvailiable(scene, gridPosition, item.name)) {
        return;
    }

    if (item.positionNPC) {
        if (!checkPositionAvailiable(scene, { x: gridPosition.x + item.positionNPC.col, y: gridPosition.y + item.positionNPC.row }, item.name)) {
            return;
        }
    }

    let itemFoundInInventory = objectInInventory(scene, tools[0].secondary[scene.toolbar.primaryItems[scene.toolbar.selectedTool].secondarySelected].key);

    if (tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key) {
        let name = tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key;
        let itemToPlace = null;

        if (dictionary[name].storage) {
            itemToPlace = new Storage(scene, gridPosition.y, gridPosition.x, name, dictionary[name].storage.x, dictionary[name].storage.y, item.positionNPC);
        }
        else if (dictionary[name].dispenser) {
            itemToPlace = new Feeder(scene, gridPosition.y, gridPosition.x, name, item.positionNPC);
        }
        else if (dictionary[name].group && dictionary[name].group == 'nests') {
            itemToPlace = new Nest(scene, gridPosition.y, gridPosition.x, name, item.positionNPC);
        }
        else {
            itemToPlace = new Item(gridPosition.y, gridPosition.x, name, (item.positionNPC ? item.positionNPC : null));
        }

        if (itemToPlace.positionNPC) {
            scene.worldGrid[gridPosition.y + itemToPlace.positionNPC.row][gridPosition.x + itemToPlace.positionNPC.col].object = item.positionNPC;
        }

        if (dictionary[name].layer == 'object') {
            itemToPlace.sprite.setDepth(calculateDepth(scene, itemToPlace.sprite.y));
        }
        else {
            itemToPlace.sprite.setDepth(5);
        }
        
        if (dictionary[name].type.includes("rotateable")) {
            itemToPlace.sprite.setInteractive();
            itemToPlace.currentFrame = item.currentFrame;
            itemToPlace.sprite.setFrame(itemToPlace.currentFrame);
        }

        if (dictionary[name].group) {
            scene[dictionary[name].group].push(itemToPlace);
        }

        scene.inventory.load();
        scene.inventory.removeItem(itemFoundInInventory.name, 1);
    }
}

export function startRemoving(scene, pointer) {
    const gridPosition = getWorldGridPosition(scene, pointer);

    if (scene.worldGrid[gridPosition.y][gridPosition.x].object) {
        if (!dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].type.includes("placeable")) {
            return;
        }

        if (Phaser.Math.Distance.Between(scene.character.x, scene.character.y, gridPosition.x * 32 + 16, gridPosition.y * 32 + 16) > 100) {
            return false;
        }

        if (scene.worldGrid[gridPosition.y][gridPosition.x].object.type.includes("drainable")) {
            scene.worldGrid[gridPosition.y][gridPosition.x].object.removeItems();
        }

        dropItem(scene, gridPosition);

        if(scene.worldGrid[gridPosition.y][gridPosition.x].object.positionNPC) {
            let group = dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].group;
            scene[group] = scene[group].filter(i => !(i.row == gridPosition.y && i.col == gridPosition.x));
            scene.worldGrid[gridPosition.y + scene.worldGrid[gridPosition.y][gridPosition.x].object.positionNPC.row][gridPosition.x + scene.worldGrid[gridPosition.y][gridPosition.x].object.positionNPC.col].object = null;
            scene.worldGrid[gridPosition.y][gridPosition.x].object.positionNPC.circle.destroy();
        }

        // Wall
        if (dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].type.includes('crossable') || dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].type.includes('connectable')) {
            scene.worldGrid[gridPosition.y][gridPosition.x].object.checkDirectionSpriteRemoving();
        }

        if (scene.worldGrid[gridPosition.y][gridPosition.x].object.timer) {
            scene.worldGrid[gridPosition.y][gridPosition.x].object.timer.remove();
        }

        scene.worldGrid[gridPosition.y][gridPosition.x].object.sprite.destroy();
        scene.worldGrid[gridPosition.y][gridPosition.x].object = null;
    }
    else if (scene.worldGrid[gridPosition.y][gridPosition.x].floor) {
        if (!dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].floor.name].type.includes("placeable")) {
            return;
        }
        dropItem(scene, gridPosition);
        scene.worldGrid[gridPosition.y][gridPosition.x].floor.sprite.destroy();
        scene.worldGrid[gridPosition.y][gridPosition.x].floor = null;
    }
}

export function rotateItem(scene) {
    if (scene.toolbar.selectedTool == 0) {
        if (dictionary[item.name].type.includes("rotateable")) {
            if (item.currentFrame) {
                item.currentFrame = (item.currentFrame == 3 ? 0 : (item.currentFrame +1));
                item.sprite.setFrame(item.currentFrame);
            }
            else {
                item.currentFrame = 1;
                item.sprite.setFrame(1);
            }
        }
        if (dictionary[item.name].positionNPC) {
            positionsNPC.some((position, index) => {
                if (position.x == item.positionNPC.col && (position.y == item.positionNPC.row)) {
                    let i = (index + 1) % 4;
                    item.positionNPC = { 'row': positionsNPC[i].y, 'col': positionsNPC[i].x, 'circle': item.positionNPC.circle, name: 'positionNPC'}
                    item.positionNPC.circle.setPosition(item.sprite.x +8 + item.positionNPC.col*32, item.sprite.y +8 + item.positionNPC.row*32);
                    return true;
                }
            })
        }
        updatePosition(scene, { x: scene.input.activePointer.x, y: scene.input.activePointer.y });
    }
}

function checkPositionAvailiable(scene, gridPosition, name) {
    if (dictionary[name]) {
        // Il y a déjà un objet sur la case
        if (dictionary[item.name].layer == 'object' && scene.worldGrid[gridPosition.y][gridPosition.x].object) {
            return false;
        }
        
        if (dictionary[item.name].layer == 'floor') {
            // Il y a déjà un sol sur la case
            if (scene.worldGrid[gridPosition.y][gridPosition.x].floor) {
                return false;
            }
            // Il y a déjà un environnement sur la case (quand on veut poser un floor)
            if (scene.worldGrid[gridPosition.y][gridPosition.x].object && dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].type.includes('environment')) {
                return false;
            }
        }
    }

    // La distance entre le personnage et la pose est trop grande
    if (Phaser.Math.Distance.Between(scene.character.x, scene.character.y, gridPosition.x * 32 + 16, gridPosition.y * 32 + 16) > 100) {
        return false;
    }

    // Le sol n'est pas de la terre
    if (scene.worldGrid[gridPosition.y][gridPosition.x].ground.name != 'grass') {
        return false;
    }

    // L'objet est dans l'inventaire
    if (objectInInventory(scene, tools[0].secondary[scene.toolbar.primaryItems[scene.toolbar.selectedTool].secondarySelected].key)) {
        return true;
    }

    return false;
}

export function updatePositionChecking(scene, pointer) {
    // Si le dernier mouvement de souris date de moins de 300ms et que l'outil sélectionné n'est pas la main, on passe
    if (scene.toolbar.selectedTool != 0) {
        if (item) {
            if (item.positionNPC) {
                item.positionNPC.circle.destroy();
            }
            item.sprite.destroy();
            item.secondaryIndex = null;
            item = null;
        }
        return;
    }

    // Il n'y a pas d'item, ou l'item a changé
    if (item == null || item.secondaryIndex != scene.toolbar.selectedSecondary) {
        updateItemToDrag(scene, pointer);
    }

    // Le dernier check date de moins de 50ms, ou la souris n'a pas bougé
    if ((lastUpdateTime + 50 > scene.time.now) || lastPointer.x == pointer.x && lastPointer.y == pointer.y) {
        return;
    }

    updatePosition(scene, pointer);
}

function updatePosition(scene, pointer) {
    lastUpdateTime = scene.time.now;
    lastPointer = { x: pointer.x, y: pointer.y };

    const gridPosition = getWorldGridPosition(scene, pointer);
        item.sprite.setPosition(gridPosition.x * 32, gridPosition.y * 32);

    if (item.positionNPC) {
        item.positionNPC.circle.setPosition((gridPosition.x + item.positionNPC.col) *32 + 8, (gridPosition.y + item.positionNPC.row) *32 + 8);
    }

    if (!checkPositionAvailiable(scene, gridPosition, item.name)) {
        item.sprite.setTint(0xff0000);
        return;
    }

    if (item.positionNPC) {
        if (!checkPositionAvailiable(scene, { x: gridPosition.x + item.positionNPC.col, y: gridPosition.y + item.positionNPC.row }, item.name)) {
            item.sprite.setTint(0xff0000);
            return;
        }
    }

    item.sprite.setTint(0xFFFFFF);
}

function getWorldGridPosition(scene, pointer) {
    const mousePosition = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const gridPosition = { x: Math.floor(mousePosition.x /32), y: Math.floor(mousePosition.y /32) };
    return gridPosition;
}

export function updateItemToDrag(scene, pointer) {
    if (item) {
        if (item.positionNPC) {
            item.positionNPC.circle.destroy();
        }
        item.sprite.destroy();
    }
    let gridPosition = getWorldGridPosition(scene, pointer);

    item = new Item(gridPosition.y, gridPosition.x, (tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key), null, false);
    item.sprite.setAlpha(0.5);
    item.secondaryIndex = scene.toolbar.selectedSecondary;
}

function dropItem(scene, position) {
    if (scene.worldGrid[position.y][position.x].object) {
        dropObject(scene, position.x * 32 + 16, position.y * 32 + 16, scene.worldGrid[position.y][position.x].object.name);
    }
    else if (scene.worldGrid[position.y][position.x].floor) {
        dropObject(scene, position.x * 32 + 16, position.y * 32 + 16, scene.worldGrid[position.y][position.x].floor.name);
    }
}

function objectInInventory(scene, name) {
    let itemFoundInInventory = null;
    for (let row = 0; row < Inventory.savedContent.length; row++) {
        for (let col = 0; col < Inventory.savedContent[row].length; col++) {
            if (Inventory.savedContent[row][col] && Inventory.savedContent[row][col].name == name) {
                itemFoundInInventory = Inventory.savedContent[row][col];
            }
        }
    }
    return itemFoundInInventory;
}