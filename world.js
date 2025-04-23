import Npc from './entity/npcs/Npc.js';
import Enemy from './entity/enemies/Enemy.js';
import Pigeon from './entity/Pigeon.js';
import Cow from './entity/animals/Cow.js';
import Chicken from './entity/animals/Chicken.js';
import { setEntitiesAnims } from './entity/entitiesAnimations.js';
import { calculateDepth } from './calculateDepth.js';

let detectionRadius = 20;

export function createWorld(scene) {
    scene.currentHitBox = [];

    scene.workbenchs = [];
    scene.storages = [];
    scene.npcs = [];
    scene.pigeons = [];
    scene.feeders = [];
    scene.nests = [];

    setEntitiesAnims(scene);

    // Coffres
    // let shelf = new Storage(scene, 18, 6, 'shelf', 2, 5);
    // let shelf2 = new Storage(scene, 25, 6, 'shelf', 3, 3);

    // scene.storages.push(shelf);
    // scene.storages.push(shelf2);

    // shelf.addItem('wood', 3);
    // shelf.addItem('stone', 1);
    // shelf.addItem('wood', 1);
    // shelf.addItem('tomato', 2);
    // shelf2.addItem('fish', 8);

    // // Laisser les coffres en random dans le monde ? Avec un peu de bêtises dedans pour la blague ?
    // scene.storages.forEach((shelf) => {
    //     shelf.positionNPC = {row: shelf.y/32 +1, col: shelf.x/32};
    //     scene.add.circle(shelf.positionNPC.col*32 + 8, shelf.positionNPC.row*32 + 8, 8, 0x905090).setOrigin(0);
    //     scene.worldGrid[shelf.y /32][shelf.x /32].object = shelf;
    //     scene.worldGrid[shelf.positionNPC.row][shelf.positionNPC.col].object = 'positionNPC';
    // });

    // Ennemis
    scene.enemiesGroup = scene.physics.add.group();

    for (let i = 0; i < Phaser.Math.Between(5, 10); i++) {
        const enemy = new Enemy(scene, Phaser.Math.Between(0, scene.worldGrid.length -1), Phaser.Math.Between(0, scene.worldGrid[0].length -1));
        scene.enemiesGroup.add(enemy.sprite);
        enemy.sprite.setDepth(calculateDepth(scene, enemy.sprite.y));
    }

    // Arbres
    const maxTrees = 32
    scene.treesGroup = scene.physics.add.staticGroup();
    for (let i = 0; i < maxTrees; i++) {
        let isValid = false;
        let row, col;
        while (!isValid) {
            row = Phaser.Math.Between(0, scene.worldGrid.length -1);
            col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);

            isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null && scene.worldGrid[row][col].floor == null;
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

            isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null && scene.worldGrid[row][col].floor == null;
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

    // Animals
    const animalData = [
        { name: 'cow', quantity: 3 },
        { name: 'chicken', quantity: 4 }
    ];

    animalData.forEach(data => {
        for (let i = 0; i < data.quantity; i++) {
            let isValidPos = false;
            let row, col;

            while (!isValidPos) {
                row = Phaser.Math.Between(0, scene.worldGrid.length -1);
                col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);
            
                if (scene.worldGrid[row][col].ground.name == 'grass' && !scene.worldGrid[row][col].object) {
                    isValidPos = true;
                }
            }

            if (data.name == 'cow') {
                new Cow(scene, row, col);
            }
            else {
                new Chicken(scene, row, col);
            }
        }
    });

    // NPCs
    const npcData = [
        { name: 'farmer', rowRange: [0, 20], colRange: [0, 35] },
        { name: 'blacksmith', rowRange: [0, 20], colRange: [0, 35] },
        { name: 'girl', rowRange: [0, 20], colRange: [0, 35] }
    ];

    npcData.forEach(npcPos => {
        let isValidPos = false;
        let row, col;

        while (!isValidPos) {
            row = Phaser.Math.Between(npcPos.rowRange[0], npcPos.rowRange[1]);
            col = Phaser.Math.Between(npcPos.colRange[0], npcPos.colRange[1]);
        
            if (scene.worldGrid[row][col].ground.name == 'grass' && !scene.worldGrid[row][col].object) {
                isValidPos = true;
            }
        }
        const npc = new Npc(scene, npcPos.name, row, col);
        scene.npcs.push(npc);
    });

    scene.npcs.forEach(npc => {
        npc.sprite.setInteractive(new Phaser.Geom.Rectangle(0, 32, 32, 32), Phaser.Geom.Rectangle.Contains);
        npc.sprite.on('pointerdown', function() {
            npc.openInterface();
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

                    isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null && scene.worldGrid[row][col].floor == null;
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

                    isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null && scene.worldGrid[row][col].floor == null;
                }
                let tree = createTree(scene, col * 32, row * 32);
                tree.setPipeline('Light2D');
                scene.worldGrid[row][col].object = tree;
            }

            if (scene.enemiesGroup.children.size < 20) {
                if (Phaser.Math.Between(0, 1) == 1) {
                    const enemy = new Enemy(scene, Phaser.Math.Between(0, scene.worldGrid.length -1), Phaser.Math.Between(0, scene.worldGrid[0].length -1));
                    scene.enemiesGroup.add(enemy.sprite);
                    const enemy2 = new Enemy(scene, Phaser.Math.Between(0, scene.worldGrid.length -1), Phaser.Math.Between(0, scene.worldGrid[0].length -1));
                    scene.enemiesGroup.add(enemy2.sprite);
                }
            }

            if (Phaser.Math.Between(0, 1) == 1 && scene.pigeons.length < 3) {
                let isValid = false;
                let row, col;
                while (!isValid) {
                    row = Phaser.Math.Between(0, scene.worldGrid.length -1);
                    col = Phaser.Math.Between(0, scene.worldGrid[0].length -1);

                    isValid = scene.worldGrid[row][col].ground.texture.key == 'grass' && scene.worldGrid[row][col].object == null && scene.worldGrid[row][col].floor == null;
                }
                let pigeon = new Pigeon(scene, row, col);
                scene.worldGrid[10][15].object = pigeon;
                scene.pigeons.push(pigeon);
            }
        },
        loop: true
    })
}

function createTree(scene, x, y) {
    let tree = scene.treesGroup.create(x, y, 'tree').setScale(2).setOrigin(0.25, 0.5);
    tree.setSize(16, 16).setOffset(24, 32);
    tree.name = 'tree';
    tree.setDepth(calculateDepth(scene, tree.y));
    tree.collision = new Phaser.Geom.Circle(tree.x +16, tree.y +16, detectionRadius);
    scene.physics.add.collider(scene.character, tree);
    return tree;
}

function createRock(scene, x, y) {
    let rock = scene.rocksGroup.create(x, y, 'rock').setScale(1).setOrigin(0, 0);
    rock.setSize(24, 16).setOffset(20, 24);
    rock.name = 'rock';
    rock.setDepth(calculateDepth(scene, rock.y));
    rock.collision = new Phaser.Geom.Circle(rock.x +16, rock.y +16, detectionRadius);
    scene.physics.add.collider(scene.character, rock);
    return rock;
}