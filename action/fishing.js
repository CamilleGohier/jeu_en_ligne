import { tools } from "../data/variables.js";
import Inventory from "../stockage/Inventory.js";
import { dropObject } from "../toolFile/drop.js";
import { walkingQueue } from "../toolFile/walkingQueue.js";
import { fishingData } from "../data/loot.js";

let fishingInProgress = false;
let fishingTimeout;

export function startFishing(scene) {
    const row = Math.floor(scene.character.y / 32);
    const col = Math.floor(scene.character.x / 32);
    const cell = scene.worldGrid[row][col];

    if (cell.ground.texture.key == 'water' && !fishingInProgress) {
        fishingInProgress = true;

        // Vérifie si l'appât sélectionné est dans l'inventaire
        let bait = null;
        for (let row = 0; row < Inventory.savedContent.length; row++) {
            for (let col = 0; col < Inventory.savedContent[row].length; col++) {
                if (Inventory.savedContent[row][col] && Inventory.savedContent[row][col].name == tools[4].secondary[scene.toolbar.primaryItems[scene.toolbar.selectedTool].secondarySelected].key) {
                    // Ajoute l'appât que si c'est vraiment un appât
                    if (Inventory.savedContent[row][col].name == 'worm') {
                        bait = Inventory.savedContent[row][col];
                        scene.inventory.removeItem(bait.name, 1);
                    }
                }
            }
        }

        let loot = null;
        if (bait) {
            loot = fishingData.good[Phaser.Math.Between(0, fishingData.good.length -1)];
        }
        else {
            let random = Phaser.Math.Between(0, 1);
            loot = fishingData[(random == 0 ? 'good' : 'bad')][Phaser.Math.Between(0, fishingData[(random == 0 ? 'good' : 'bad')].length -1)];
        }

        walkingQueue(scene, 'fishing', 'cannot');
        scene.character.isFishing = true;

        fishingTimeout = scene.time.delayedCall(3000, () => {
            let information = scene.add.image(scene.character.x - 16, scene.character.y - 52, 'information').setOrigin(0);
                
            scene.input.once('pointerdown', (pointer) => {
                recoverFish(scene, loot);
                information.destroy();
            });
        })
    }

    function recoverFish(scene, loot) {
        clearTimeout(fishingTimeout);
        dropObject(scene, scene.character.x - 16, scene.character.y - 16, loot);
    
        fishingInProgress = false;
        walkingQueue(scene, 'fishing', 'can');
        scene.character.isFishing = false;

        scene.fishingRod.destroy();
        scene.fishingRod = null;
    }
}
