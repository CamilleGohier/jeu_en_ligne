import Storage from './stockage/Storage.js';
import Npc from './npcs/Npc.js';
import Enemy from './enemies/Enemy.js';

let detectionRadius = 30;

export function createWorld(scene) {
    scene.currentHitBox = [];

    // Coffres
    let shelf = new Storage(scene, 18, 6, 'shelf', 2, 5);
    let shelf2 = new Storage(scene, 25, 6, 'shelf', 3, 3);

    scene.storages = [];
    scene.storages.push(shelf);
    scene.storages.push(shelf2);

    shelf.addItem('wood', 3);
    shelf.addItem('stone', 1);
    shelf.addItem('wood', 1);
    shelf.addItem('tomato', 2);
    shelf2.addItem('fish', 8);

    scene.storages.forEach((shelf) => {
        shelf.positionNPC = {row: shelf.y/32 +1, col: shelf.x/32};
        scene.add.circle(shelf.positionNPC.col*32 + 8, shelf.positionNPC.row*32 + 8, 8, 0x905090).setOrigin(0);
        scene.worldGrid[shelf.y /32][shelf.x /32].object = shelf;
        scene.worldGrid[shelf.positionNPC.row][shelf.positionNPC.col].object = 'positionNPC';
    });
    

    // Établi
    // let desk = scene.physics.add.staticSprite(10*32, 10*32, 'desk').setOrigin(0);
    // desk.positionNPC = {row: desk.y/32 -1, col: desk.x/32};
    // scene.add.circle(desk.positionNPC.col*32 + 8, desk.positionNPC.row*32 + 8, 8, 0x905090).setOrigin(0);

    scene.desks = [];
    // scene.desks.push(desk);

    scene.desks.forEach((desk) => {
        scene.worldGrid[10][10].object = desk;
        scene.worldGrid[desk.positionNPC.row][desk.positionNPC.col].object = 'positionNPC';
        desk.setSize(32, 22).setOffset(16, 40);
        scene.physics.add.collider(scene.character, desk);
    })

    // Arbres
    const maxTrees = 32
    scene.treesGroup = scene.physics.add.staticGroup();
    for (let i = 0; i < maxTrees; i++) {
        let isValid = false;
        let row, col;
        while (!isValid) {
            row = Phaser.Math.Between(0, scene.worldGrid.length -1);
            col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);

            isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null;
        }
        let tree = createTree(scene, col * 32, row * 32);
        scene.worldGrid[row][col].object = tree;
    }

    scene.physics.world.on('worldstep', () => {
        scene.treesGroup.children.iterate((tree) => {
            if (Phaser.Geom.Intersects.CircleToRectangle(tree.collision, scene.character.getBounds()) && !scene.currentHitBox.find((t) => t == tree)) {
                scene.currentHitBox.push(tree);
            }
            else if (!Phaser.Geom.Intersects.CircleToRectangle(tree.collision, scene.character.getBounds()) && scene.currentHitBox.find((t) => t == tree)) {
                scene.currentHitBox = scene.currentHitBox.filter(e => e !== tree);
            }
        })
    })

    // Rochers
    const maxRocks = 16;
    scene.rocksGroup = scene.physics.add.staticGroup();
    for (let i = 0; i < maxRocks; i++) {
        let isValid = false;
        let row, col;
        while (!isValid) {
            row = Phaser.Math.Between(0, scene.worldGrid.length -1);
            col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);

            isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null;
        }
        let rock = createRock(scene, col * 32, row * 32);
        scene.worldGrid[row][col].object = rock;
    }

    scene.physics.world.on('worldstep', () => {
        scene.rocksGroup.children.iterate((rock) => {
            if (Phaser.Geom.Intersects.CircleToRectangle(rock.collision, scene.character.getBounds()) && !scene.currentHitBox.find((r) => r == rock)) {
                scene.currentHitBox.push(rock);
            }
            else if (!Phaser.Geom.Intersects.CircleToRectangle(rock.collision, scene.character.getBounds()) && scene.currentHitBox.find((r) => r == rock)) {
                scene.currentHitBox = scene.currentHitBox.filter(e => e !== rock);
            }
        })
    })

    // PNJs
    scene.npcs = [];

    let row, col;

    let isValidPos = false;
    while (!isValidPos) {
        // row = Phaser.Math.Between(0, scene.worldGrid.length -1);
        // col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);
        row = Phaser.Math.Between(0, 20);
        col = Phaser.Math.Between(0, 35);

        if (scene.worldGrid[row][col].ground.name == 'grass' && !scene.worldGrid[row][col].object) {
            isValidPos = true;
        }
    }
    let npc = new Npc(scene, 'farmer', row, col);
    scene.npcs.push(npc);

    isValidPos = false;
    while (!isValidPos) {
        row = col = null;
        // row = Phaser.Math.Between(0, scene.worldGrid.length -1);
        // col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);
        row = Phaser.Math.Between(0, 20);
        col = Phaser.Math.Between(0, 35);

        if (scene.worldGrid[row][col].ground.name == 'grass' && !scene.worldGrid[row][col].object) {
            isValidPos = true;
        }
    }
    let npc2 = new Npc(scene, 'blacksmith', row, col);
    scene.npcs.push(npc2);

    scene.npcs.forEach(npc => {
        npc.sprite.setInteractive();
        npc.sprite.on('pointerdown', () => {
            npc.openInterface(scene);
        })
    })

    scene.input.keyboard.on('keydown-ESC', () => {
        scene.npcs.forEach(npc => {
            if (npc.tradeInterface) {
                npc.closeTradeInterface();
            }
        })
    })

    // Boucle pour faire apparaitre des trucs cools
    scene.time.addEvent({
        delay: 90000,
        callback: () => {
            if (scene.rocksGroup.children.size < maxRocks) {
                let isValid = false;
                let row, col;
                while (!isValid) {
                    row = Phaser.Math.Between(0, scene.worldGrid.length -1);
                    col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);

                    isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null;
                }
                let rock = createRock(scene, col * 32, row * 32);
                rock.setPipeline('Light2D');
                scene.worldGrid[row][col].object = rock;
            }

            if (scene.treesGroup.children.size < maxTrees) {
                let isValid = false;
                let row, col;
                while (!isValid) {
                    row = Phaser.Math.Between(0, scene.worldGrid.length -1);
                    col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);

                    isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null;
                }
                let tree = createTree(scene, col * 32, row * 32);
                tree.setPipeline('Light2D');
                scene.worldGrid[row][col].object = tree;
            }

            if (Phaser.Math.Between(0, 1) == 1) {
                const enemy = new Enemy(scene, Phaser.Math.Between(0, scene.worldGrid.length -1) *32, Phaser.Math.Between(0, scene.worldGrid[0].length -1) *32);
                scene.enemiesGroup.add(enemy.sprite);
            }
        },
        loop: true
    })
}

function createTree(scene, x, y) {
    let tree = scene.treesGroup.create(x, y, 'tree').setScale(2).setOrigin(0.25, 0.5);
    tree.setSize(16, 16).setOffset(24, 32);
    tree.name = 'tree';
    tree.setDepth(10);
    tree.collision = new Phaser.Geom.Circle(tree.x, tree.y, detectionRadius);
    scene.physics.add.collider(scene.character, tree);
    return tree;
}

function createRock(scene, x, y) {
    let rock = scene.rocksGroup.create(x, y, 'rock').setScale(1).setOrigin(0, 0);
    rock.setSize(24, 16).setOffset(20, 24);
    rock.name = 'rock';
    rock.setDepth(10);
    rock.collision = new Phaser.Geom.Circle(rock.x, rock.y, detectionRadius);
    scene.physics.add.collider(scene.character, rock);
    return rock;
}