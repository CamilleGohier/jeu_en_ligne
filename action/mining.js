import { dropLoot } from '../toolFile/drop.js';
import { walkingQueue } from "../toolFile/walkingQueue.js";

let worldPosition = null;

export function startMining(scene, pointer) {
    let rock = null;
    worldPosition = scene.cameras.main.getWorldPoint(scene.input.activePointer.x, scene.input.activePointer.y);

    if (Phaser.Math.Distance.Between(scene.character.x + 16, scene.character.y + 16, worldPosition.x, worldPosition.y) > 50) {
        return;
    }
    const col = Math.floor(worldPosition.x / 32);
    const row = Math.floor(worldPosition.y / 32);

    if (scene.worldGrid[row][col].object && scene.worldGrid[row][col].object.name == 'rock') {
        rock = scene.worldGrid[row][col].object;
    }

    if (!scene.character.isMining && rock) {
        scene.character.isMining = true;
        walkingQueue(scene, 'mining', 'cannot');
    }
}

export function endMining(scene) {
    const col = Math.floor(worldPosition.x / 32);
    const row = Math.floor(worldPosition.y / 32);

    let rock = scene.worldGrid[row][col].object;

    walkingQueue(scene, 'mining', 'can');

    dropLoot(scene, rock.x, rock.y, 'rock');
    scene.worldGrid[rock.y /32][rock.x /32].object = null;
    rock.destroy();
}