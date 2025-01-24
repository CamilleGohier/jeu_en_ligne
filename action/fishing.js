import { drop_item } from "../tool_file/drop_item.js";
import { walking_queue } from "../tool_file/walking_queue.js";

let fishingInProgress = false;
let fishingTimeout;

export function startFishing(scene) {
    const x = Math.floor((scene.character.x - 400) / 32);
    const y = Math.floor(scene.character.y / 32);
    const cell = scene.waterGrid.find(c => c.x == x && c.y == y);

    if (cell && !fishingInProgress) {
        fishingInProgress = true;
        walking_queue(scene, 'fishing', 'cannot');
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
        walking_queue(scene, 'fishing', 'can');
        scene.character.isFishing = false;

        scene.fishingRod.destroy();
        scene.fishingRod = null;
    }
}
