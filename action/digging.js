import { dropObject } from "../toolFile/drop.js";

const loot = ['worm', 'wheat_seed', 'tomato_seed']

export function startDigging(scene, pointer) {
    const worldPosition = scene.cameras.main.getWorldPoint(scene.input.activePointer.x, scene.input.activePointer.y);

    if (Phaser.Math.Distance.Between(scene.character.x + 16, scene.character.y + 16, worldPosition.x, worldPosition.y) > 50) {
        return;
    }
    const col = Math.floor(worldPosition.x / 32);
    const row = Math.floor(worldPosition.y / 32);

    if (scene.worldGrid[row][col].object || scene.worldGrid[row][col].floor) {
        return;
    }

    if (scene.worldGrid[row][col].ground.crop) {
        return;
    }

    const cell = scene.worldGrid[row][col].ground;
    scene.character.isDigging = true;

    if (cell.name == 'grass') {
        cell.setTexture('soil');
        cell.setFrame(Phaser.Math.Between(0, 3));
        cell.name = 'soil';

        checkDropCell(scene, cell);
    }
    else if (cell.name == 'soil') {
        cell.setTexture('grass');
        cell.setFrame(Phaser.Math.Between(0, 11));
        cell.name = 'grass';
    }
}

function checkDropCell(scene, cell) {
    if (cell.lastDrop == null || cell.lastDrop + 90000 < scene.time.now) {
        if (Phaser.Math.Between(0, 2)) {
            dropObject(scene, scene.character.x, scene.character.y, loot[Phaser.Math.Between(0, loot.length -1)]);
        }
        cell.lastDrop = scene.time.now;
    }
}