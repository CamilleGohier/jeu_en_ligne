import { drop_item } from "../tool_file/drop_item.js";

let fishingInProgress = false;
let fishCaught = null;
let fishingTimeout;

export function startFishing(scene) {
    const x = Math.floor((scene.character.x - 400) / 32);
    const y = Math.floor(scene.character.y / 32);
    const cell = scene.waterGrid.find(c => c.x == x && c.y == y);

    if (cell && !fishingInProgress) {
        fishingInProgress = true;
        scene.canWalk = false;
        scene.character.isFishing = true;

        fishingTimeout = scene.time.delayedCall(3000, () => {
            let information = scene.add.image(scene.character.x - 16, scene.character.y - 52, 'information').setOrigin(0);

            scene.input.keyboard.once('keydown-SPACE', () => {
                recoverFish(scene);
                information.destroy();
            });
        })
    }

    function recoverFish(scene) {
        clearTimeout(fishingTimeout);

        fishCaught = getRandomFish();
        drop_item(scene, scene.character.x - 16, scene.character.y - 16, scene.character.x, scene.character.y, fishCaught.key);
        
        scene.inventory[fishCaught.key] += 1;
        scene[fishCaught.key + "Text"].setText(fishCaught.name + ' : ' + scene.inventory[fishCaught.key]);
    
        fishingInProgress = false;
        scene.canWalk = true;
        scene.character.isFishing = false;

        scene.fishingRod.destroy();
        scene.fishingRod = null;
    }

    function getRandomFish() {
        const fishOptions = [
            {key: 'fish', name:'Poisson'},
            {key: 'waste', name:'Déchet'}
        ];
    
        return Phaser.Utils.Array.GetRandom(fishOptions);
    }
}
