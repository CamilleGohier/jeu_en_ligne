export function createWorldGrid(scene) {

    const rows = Math.floor(scene.physics.world.bounds.height / 32);
    const cols = Math.floor(scene.physics.world.bounds.width / 32);

    scene.worldGrid = new Array(rows);
    for (let row = 0; row < rows; row++) {
        scene.worldGrid[row] = new Array(cols);
        for (let col = 0; col < cols; col++) {
            scene.worldGrid[row][col] = { ground: null, floor: null, object: null };
        }
    }

    createSoilGrid(scene);
    createWaterGrid(scene);
    createGroundGrid(scene);
}

function createSoilGrid(scene) {
    for (let row = 6; row <= 8; row++) {
        for (let col = 8; col <= 11; col++) {
            const randomFrame = Phaser.Math.Between(0, 3);
            let tile = scene.add.sprite(col * 32, row * 32, 'soil', randomFrame).setOrigin(0).setDepth(0);
            tile.name = 'soil';
            scene.worldGrid[row][col].ground = tile;
        }
    }
}

function createWaterGrid(scene) {
    for (let row = 10; row <= 16; row++) {
        for (let col = 45; col <= 49; col++) {
            let tile = scene.add.sprite(col * 32, row * 32, 'water').setOrigin(0).setDepth(0);
            tile.name = 'water';
            scene.worldGrid[row][col].ground = tile;
        }
    }

    for (let row = 22; row <= 26; row++) {
        for (let col = 12; col <= 25; col++) {
            let tile = scene.add.sprite(col * 32, row * 32, 'water').setOrigin(0).setDepth(0);
            tile.name = 'water';
            scene.worldGrid[row][col].ground = tile;
        }
    }
}

function createGroundGrid(scene) {
    const rows = Math.floor(scene.physics.world.bounds.height / 32);
    const cols = Math.floor(scene.physics.world.bounds.width / 32);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (scene.worldGrid[row][col] && scene.worldGrid[row][col].ground == null ) {
                const randomFrame = Phaser.Math.Between(0, 11);
                let tile = scene.add.sprite(col * 32, row * 32, 'grass', randomFrame).setOrigin(0).setDepth(0);
                tile.name = 'grass';
                scene.worldGrid[row][col].ground = tile;
            }
        }
    }
}