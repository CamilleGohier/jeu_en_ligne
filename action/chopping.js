import { drop_item } from '../tool_file/drop_item.js';
import { walking_queue } from "../tool_file/walking_queue.js";

let choppingInProgress = false;

export function startChopping(scene) {
    let tree = null;

    scene.currentHitBox.forEach(item => {
        if (item.name == 'tree') {
            tree = item;
        }
    });

    if (!choppingInProgress && tree) {
        scene.character.isChopping = true;
        walking_queue(scene, 'chopping', 'cannot');
        choppingInProgress = true;
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
    walking_queue(scene, 'chopping', 'can');

    drop_item(scene, tree.x, tree.y, scene.character.x, scene.character.y, 'tree');
}