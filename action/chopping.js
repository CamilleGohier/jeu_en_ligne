import { dropLoot } from '../toolFile/drop.js';
import { walkingQueue } from "../toolFile/walkingQueue.js";

let worldPosition = null;

export function startChopping(scene, pointer) {
    let tree = null;
    worldPosition = scene.cameras.main.getWorldPoint(scene.input.activePointer.x, scene.input.activePointer.y);

    if (Phaser.Math.Distance.Between(scene.character.x + 16, scene.character.y + 16, worldPosition.x, worldPosition.y) > 50) {
        return;
    }
    const col = Math.floor(worldPosition.x / 32);
    const row = Math.floor(worldPosition.y / 32);

    if (scene.worldGrid[row][col].object && scene.worldGrid[row][col].object.name == 'tree') {
        tree = scene.worldGrid[row][col].object;
    }

    if (!scene.character.isChopping && tree) {
        scene.character.isChopping = true;
        walkingQueue(scene, 'chopping', 'cannot');
    }
}

export function endChopping(scene) {
    const col = Math.floor(worldPosition.x / 32);
    const row = Math.floor(worldPosition.y / 32);

    let tree = scene.worldGrid[row][col].object;

    if (tree.isCut) {
        walkingQueue(scene, 'chopping', 'can');
        dropLoot(scene, tree.x, tree.y, 'trunk');
        scene.worldGrid[tree.y /32][tree.x /32].object = null;
        tree.destroy();
    }
    else {
        tree.setTexture('trunk');
        tree.isCut = true;
        walkingQueue(scene, 'chopping', 'can');
        dropLoot(scene, tree.x, tree.y, 'tree');
        
    }
}