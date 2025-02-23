import { drop_item } from '../tool_file/drop_item.js';
import { walkingQueue } from "../tool_file/walking_queue.js";

export function startMining(scene) {
    let rock = null;

    scene.currentHitBox.forEach(item => {
        if (item.name == 'rock') {
            rock = item;
        }
    });

    if (!scene.character.isMining && rock) {
        scene.character.isMining = true;
        walkingQueue(scene, 'mining', 'cannot');
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

    walkingQueue(scene, 'mining', 'can');

    drop_item(scene, rock.x, rock.y, scene.character.x, scene.character.y, 'rock');
    rock.destroy();
}