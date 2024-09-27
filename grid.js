export function createSoilGrid(scene) {
    scene.soilGrid = [];
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            const randomFrame = Phaser.Math.Between(0, 3);
            scene.add.sprite(x * 32, y * 32, 'soil', randomFrame).setOrigin(0);
            scene.soilGrid.push({x, y, planted: false, crop: null, growthStage: 0});
        }
    }
}

export function createWaterGrid(scene) {
    scene.waterGrid = [];
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 8; y++) {
            scene.add.sprite(x * 32 + 400, y * 32 + 0, 'water').setOrigin(0);
            scene.waterGrid.push({x, y});
        }
    }
}