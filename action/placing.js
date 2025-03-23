import { tools } from '../data/variables.js';
import Inventory from '../stockage/Inventory.js';
import { dictionary } from '../data/items.js';
import Item from '../tool_file/add_sprite.js';

let lastPointer = { y: 0, x: 0 };
let lastUpdateTime = 0;
let item = null;

export function startPlacing(scene, pointer) {
    const gridPosition = getWorldGridPosition(scene, pointer);

    if (dictionary[item.name] && dictionary[item.name].layer == 'object' && scene.worldGrid[gridPosition.y][gridPosition.x].object || dictionary[item.name] && dictionary[item.name].layer == 'floor' && scene.worldGrid[gridPosition.y][gridPosition.x].floor) {
        return;
    }

    if (dictionary[item.name] && dictionary[item.name].layer == 'floor' && scene.worldGrid[gridPosition.y][gridPosition.x].object && dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].type.includes('environment')) {
        return;
    }

    if (Phaser.Math.Distance.Between(scene.character.x, scene.character.y, gridPosition.x * 32 + 16, gridPosition.y * 32 + 16) > 100) {
        return;
    }

    // Trouve l'objet sélectionné s'il est dans l'inventaire
    let itemFoundInInventory = objectInInventory(scene, tools[0].secondary[scene.toolbar.primaryItems[scene.toolbar.selectedTool].secondarySelected].key);
    if (!itemFoundInInventory) {
        return;
    }

    if (dictionary[item.name].type.includes("interactive") && scene.worldGrid[gridPosition.y -1][gridPosition.x].object) {
        return;
    }

    if (tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key) {
        const itemToPlace = new Item(gridPosition.x, gridPosition.y, tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key);

        if (dictionary[itemToPlace.name].type.includes("rotateable")) {
            itemToPlace.sprite.setInteractive();
            itemToPlace.currentFrame = item.currentFrame;
            itemToPlace.sprite.setFrame(itemToPlace.currentFrame);
        }

        if (dictionary[itemToPlace.name].type.includes("interactive")) {
            scene.desks.push(itemToPlace);
            item.positionNPC.row = gridPosition.y -1;
            item.positionNPC.col = gridPosition.x;
        }

        scene.inventory.load();
        scene.inventory.removeItem(itemFoundInInventory.name, 1);
    }

    scene.children.sort('depth');
}

export function updatePositionPlacing(scene, pointer) {
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

    if (item == null || item.secondaryIndex != scene.toolbar.selectedSecondary) {
        updateItemToDrag(scene);
    }
    
    if ((lastUpdateTime + 50 > scene.time.now) || lastPointer.x == pointer.x && lastPointer.y == pointer.y) {
        return;
    }

    lastUpdateTime = scene.time.now;
    lastPointer = { x: pointer.x, y: pointer.y };

    const gridPosition = getWorldGridPosition(scene, pointer);
    item.sprite.setPosition(gridPosition.x * 32, gridPosition.y * 32);

    if (item.positionNPC) {
        item.positionNPC.circle.setPosition(gridPosition.x *32 + 8, (gridPosition.y -1) *32 + 8);
        item.positionNPC.row = gridPosition.y -1;
        item.positionNPC.col = gridPosition.x;
    }

    if (Phaser.Math.Distance.Between(scene.character.x, scene.character.y, gridPosition.x * 32 + 16, gridPosition.y * 32 + 16) > 100 || !objectInInventory(scene, tools[0].secondary[scene.toolbar.primaryItems[scene.toolbar.selectedTool].secondarySelected].key)) {
        item.sprite.setTint(0xff0000);
    }
    else {
        item.sprite.setTint(0xffffff);
    }

    if (dictionary[item.name] && dictionary[item.name] == 'object' && scene.worldGrid[gridPosition.y][gridPosition.x].object || dictionary[item.name] && dictionary[item.name].layer == 'floor' && scene.worldGrid[gridPosition.y][gridPosition.x].floor) {
        item.sprite.setTint(0xff0000);
    }

    if (dictionary[item.name] && dictionary[item.name].type.includes("interactive") && scene.worldGrid[gridPosition.y -1][gridPosition.x].object) {
        item.sprite.setTint(0xff0000);
    }
}

export function startRemoving(scene, pointer) {
    const gridPosition = getWorldGridPosition(scene, pointer);

    // Ca, ça a le mérite d'être peut-être un peu mieux fait
    if (scene.worldGrid[gridPosition.y][gridPosition.x].object) {
        if (!dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].object.name].type.includes("placeable")) {
            return;
        }
        drop_item(scene, gridPosition);

        if(scene.worldGrid[gridPosition.y][gridPosition.x].object.positionNPC) {
            scene.desks = scene.desks.filter(i => !(i.row == gridPosition.y && i.col == gridPosition.x));
            scene.worldGrid[gridPosition.y][gridPosition.x].object.positionNPC.circle.destroy();
        }

        scene.worldGrid[gridPosition.y][gridPosition.x].object.sprite.destroy();
        scene.worldGrid[gridPosition.y][gridPosition.x].object = null;

        if (scene.worldGrid[gridPosition.y -1][gridPosition.x].object && scene.worldGrid[gridPosition.y -1][gridPosition.x].object.name == 'wall') {
            scene.worldGrid[gridPosition.y -1][gridPosition.x].object.currentFrame = 1;
            scene.worldGrid[gridPosition.y -1][gridPosition.x].object.sprite.setFrame(1);
        }
    }
    else if (scene.worldGrid[gridPosition.y][gridPosition.x].floor) {
        if (!dictionary[scene.worldGrid[gridPosition.y][gridPosition.x].floor.name].type.includes("placeable")) {
            return;
        }
        drop_item(scene, gridPosition);
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
    }
}

function getWorldGridPosition(scene, pointer) {
    const mousePosition = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const gridPosition = { x: Math.floor(mousePosition.x /32), y: Math.floor(mousePosition.y /32) };
    return gridPosition;
}

function updateItemToDrag(scene) {
    if (item) {
        if (item.positionNPC) {
            item.positionNPC.circle.destroy();
        }
        item.sprite.destroy();
    }
    item = new Item(0, 0, (tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key ? tools[0].secondary[scene.toolbar.primaryItems[0].secondarySelected].key : 'empty' ));
    item.sprite.setAlpha(0.5);
    item.secondaryIndex = scene.toolbar.selectedSecondary;
}

function drop_item(scene, position) {
    let itemToDrop = null;

    // Ca aussi il faudrait le changer un peu, c'est pas très clair
    if (scene.worldGrid[position.y][position.x].object) {
        itemToDrop = scene.physics.add.sprite(position.x * 32 + 16, position.y * 32 + 16, scene.worldGrid[position.y][position.x].object.name).setOrigin(0).setScale(0.5);
        itemToDrop.name = scene.worldGrid[position.y][position.x].object.name;
    }
    else {
        itemToDrop = scene.physics.add.sprite(position.x * 32 + 16, position.y * 32 + 16, scene.worldGrid[position.y][position.x].floor.name).setOrigin(0).setScale(0.5);
        itemToDrop.name = scene.worldGrid[position.y][position.x].floor.name;
    }

    let angle = Phaser.Math.Between(0, 360);
    let speed = Phaser.Math.Between(50, 150);
    scene.physics.velocityFromAngle(angle, speed, itemToDrop.body.velocity);

    scene.droppedItemTab.push(itemToDrop);

    scene.time.delayedCall(300, () => {
        itemToDrop.isFollowing = true;
        itemToDrop.body.setVelocity(0);
    })
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