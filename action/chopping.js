import { drop_item } from '../tool_file/drop_item.js';
import { walkingQueue } from "../tool_file/walking_queue.js";

export function startChopping(scene) {
    let tree = null;

    scene.currentHitBox.forEach(item => {
        if (item.name == 'tree') {
            tree = item;
        }
    });

    if (!scene.character.isChopping && tree) {
        scene.character.isChopping = true;
        walkingQueue(scene, 'chopping', 'cannot');
    }
}

export function endChopping(scene) {
    let tree = null;
    
    scene.currentHitBox.forEach(item => {
        if (item.name == 'tree') {
            tree = item;
        }
    });

    scene.currentHitBox = scene.currentHitBox.filter(e => e !== tree);

    tree.setTexture('trunk');
    walkingQueue(scene, 'chopping', 'can');

    drop_item(scene, tree.x, tree.y, scene.character.x, scene.character.y, 'tree');
}