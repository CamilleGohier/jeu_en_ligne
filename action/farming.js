import { drop_item } from '../tool_file/drop_item.js';

export function startFarming(scene) {
    const x = Math.floor(scene.character.x / 32);
    const y = Math.floor(scene.character.y / 32);
    const cell = scene.soilGrid.find(c => c.x == x && c.y == y);
    
    if (scene.selectedSeed && cell && scene.inventory[scene.selectedSeed.seed] > 0 && !cell.planted) {
        plantSeed(scene, cell, scene.selectedSeed);
    }
    else if (cell && cell.planted && cell.growthStage == 3) {
        harvestCrop(scene, cell);
    }
}

export function plantSeed(scene, cell, seedType) {
    if (!cell.planted) {
        if (scene.inventory[seedType.seed] > 0) {
            scene.character.isFarming = true;
            cell.planted = true;
            cell.crop = scene.add.image(cell.x * 32, cell.y * 32, seedType.crop, 0).setOrigin(0);
            cell.growthStage = 0;
            cell.cropType = seedType;

            scene.inventory[seedType.seed] -= 1;
            scene[seedType.key + "SeedText"].setText('Graine de ' + seedType.name + ' : ' + scene.inventory[seedType.seed]);
            
            startGrowing(scene, cell);
        }
    }
}

export function startGrowing(scene, cell) {
    scene.time.addEvent({
        delay: 1000,
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
    if (cell.planted && cell.growthStage == 3) {
        scene.character.isFarming = true;
        let cropType = cell.cropType;
        
        drop_item(scene, cell.x * 32, cell.y * 32, scene.character.x, scene.character.y, cropType.key, (item) => {
            collectItem(scene, cropType.key, cropType.key, cropType.name);
        });

        drop_item(scene, cell.x * 32, cell.y * 32, scene.character.x, scene.character.y, cropType.seed, (item) => {
            collectItem(scene, cropType.seed, cropType.key + 'Seed', "Graine de " + cropType.name);
        })

        cell.planted = false;
        cell.crop.destroy();
        cell.crop = null;
        cell.growthStage = 0;
    }
}

function collectItem(scene, type, text, textName) {
        scene.inventory[type] += 1;
        scene[text + 'Text'].setText(textName + ' : ' + scene.inventory[type]);
}