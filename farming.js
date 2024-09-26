export function doAction(scene) {
    const x = Math.floor(scene.character.x / 32);
    const y = Math.floor(scene.character.y / 32);
    const cell = scene.grid.find(c => c.x == x && c.y == y);
    
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
        let cropType = cell.cropType;
        let cropItem = scene.physics.add.sprite(cell.x * 32, cell.y * 32, cropType.key).setOrigin(0);
        let seedItem = scene.physics.add.sprite(cell.x * 32, cell.y * 32, cropType.seed).setOrigin(0);

        scene.tweens.add({
            targets: cropItem,
            x: scene.character.x + Phaser.Math.Between(-20, 20),
            y: scene.character.y + Phaser.Math.Between(-20, 20),
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                collectItem(scene, cropType.key, cropType.key, cropType.name, cropItem);
            }
        })

        scene.tweens.add({
            targets: seedItem,
            x: scene.character.x + Phaser.Math.Between(-20, 20),
            y: scene.character.y + Phaser.Math.Between(-20, 20),
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                collectItem(scene, cropType.seed, cropType.key + 'Seed', "Graine de " + cropType.name, seedItem);
            }
        })

        cell.planted = false;
        cell.crop.destroy();
        cell.crop = null;
        cell.growthStage = 0;
    }
}

function collectItem(scene, type, text, textName, item) {
        scene.inventory[type] += 1;
        scene[text + 'Text'].setText(textName + ' : ' + scene.inventory[type]);

    scene.tweens.add({
        targets: item,
        x: scene.character.x,
        y: scene.character.y,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            item.destroy();
        }
    })
}