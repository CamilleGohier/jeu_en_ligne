import { drop_item } from "../tool_file/drop_item.js";
import { walkingQueue } from "../tool_file/walking_queue.js";

let fishingInProgress = false;
let fishingTimeout;

export function startFishing(scene) {
    const row = Math.floor(scene.character.y / 32);
    const col = Math.floor(scene.character.x / 32);
    const cell = scene.worldGrid[row][col];

    if (cell.ground.texture.key == 'water' && !fishingInProgress) {
        fishingInProgress = true;
        walkingQueue(scene, 'fishing', 'cannot');
        scene.character.isFishing = true;

        fishingTimeout = scene.time.delayedCall(3000, () => {
            let information = scene.add.image(scene.character.x - 16, scene.character.y - 52, 'information').setOrigin(0);
                
            scene.input.once('pointerdown', (pointer) => {
                recoverFish(scene);
                information.destroy();
            });
        })
    }

    function recoverFish(scene) {
        clearTimeout(fishingTimeout);
        drop_item(scene, scene.character.x - 16, scene.character.y - 16, scene.character.x, scene.character.y, "fishing");
    
        fishingInProgress = false;
        walkingQueue(scene, 'fishing', 'can');
        scene.character.isFishing = false;

        scene.fishingRod.destroy();
        scene.fishingRod = null;
    }
}
