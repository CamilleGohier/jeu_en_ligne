import { drop_item } from '../tool_file/drop_item.js';
import Inventory from '../stockage/Inventory.js';
import { tools } from '../data/variables.js';
import { addEffectSceneToItem } from '../effects.js';

export function startFarming(scene) {
    const col = Math.floor(scene.character.x / 32);
    const row = Math.floor(scene.character.y / 32);
    const cell = scene.worldGrid[row][col].ground;

    let seed = null;

    // Trouve la graine sélectionnée dans l'inventaire
    for (let row = 0; row < Inventory.savedContent.length; row++) {
        for (let col = 0; col < Inventory.savedContent[row].length; col++) {
            if (Inventory.savedContent[row][col] && Inventory.savedContent[row][col].name == tools[5].secondary[scene.toolbar.primaryItems[scene.toolbar.selectedTool].secondarySelected].key) {
                seed = Inventory.savedContent[row][col];
            }
        }
    }

    // Si une graine est sélectionnée, qu'elle est dans l'inventaire et qu'elle n'est pas déjà plantée, on continue
    if (seed && cell.texture.key == 'soil' && !cell.planted && seed.quantity > 0) {
        plantSeed(scene, cell, seed);
    }
    else if (cell && cell.planted && cell.growthStage == 3) {
        harvestCrop(scene, cell);
    }
}

export function plantSeed(scene, cell, seed) {
    scene.character.isFarming = true;
    cell.planted = true;
    cell.crop = scene.add.image(cell.x, cell.y, seed.name + '_crop', 0).setOrigin(0);
    scene.worldGrid[cell.x /32][cell.y /32].object = cell.crop;
    addEffectSceneToItem(scene, cell.crop);
    cell.crop.name = seed.name + '_crop';

    cell.growthStage = 0;
    scene.inventory.load();
    scene.inventory.removeItem(seed.name, 1);
    
    startGrowing(scene, cell);
}

export function startGrowing(scene, cell) {
    scene.time.addEvent({
        delay: Phaser.Math.Between(3000, 8000),
        callback: () => {
            if (cell.growthStage < 3) {
                cell.growthStage += 1;

                if (cell.crop) {
                    cell.crop.setFrame(cell.growthStage);
                }
            }
        },
        repeat: 3
    })
}

export function harvestCrop(scene, cell) {
    scene.character.isFarming = true;
    let crop = cell.crop;
    
    drop_item(scene, cell.x, cell.y, scene.character.x, scene.character.y, crop.name);

    cell.planted = false;
    cell.crop.destroy();
    scene.worldGrid[cell.x /32][cell.y /32].object = null;
    cell.crop = null;
    cell.growthStage = 0;
}