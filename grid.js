export function createGrid(scene) {
    scene.grid = [];
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            const randomFrame = Phaser.Math.Between(0, 3);
            scene.add.sprite(x * 32, y * 32, 'soil', randomFrame).setOrigin(0);
            scene.grid.push({x, y, planted: false, crop: null, growthStage: 0});
        }
    }
}