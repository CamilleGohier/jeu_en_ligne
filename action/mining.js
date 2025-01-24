import { drop_item } from '../tool_file/drop_item.js';
import { walking_queue } from "../tool_file/walking_queue.js";

let miningInProgress = false;

export function startMining(scene) {
    let rock = null;

    scene.currentHitBox.forEach(item => {
        if (item.name == 'rock') {
            rock = item;
        }
    });

    if (!miningInProgress && rock) {
        scene.character.isMining = true;
        walking_queue(scene, 'mining', 'cannot');
        miningInProgress = true;
    }
}

export function endMining(scene) {
    let rock = null;
    
    scene.currentHitBox.forEach(item => {
        if (item.name == 'rock') {
            rock = item;
        }
    });

    scene.currentHitBox = scene.currentHitBox.filter(e => e !== rock);

    walking_queue(scene, 'mining', 'can');

    drop_item(scene, rock.x, rock.y, scene.character.x, scene.character.y, 'rock');
    rock.destroy();
}