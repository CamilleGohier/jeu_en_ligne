import Storage from './stockage/Storage.js';
import Npc from './npcs/Npc.js';

let detectionRadius = 30;

export function createWorld(scene) {
    scene.currentHitBox = [];

    // Arbres
    scene.treesGroup = scene.physics.add.staticGroup();
    createTree(scene, 1100, 100);
    createTree(scene, 600, 400);
    createTree(scene, 1100, 500);
    createTree(scene, 1000, 200);
    createTree(scene, 1200, 400);
    createTree(scene, 600, 700);
    createTree(scene, 800, 600);
    createTree(scene, 1200, 800);

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
    scene.rocksGroup = scene.physics.add.staticGroup();
    createRock(scene, 700, 400);
    createRock(scene, 100, 500);
    createRock(scene, 400, 600);
    createRock(scene, 1100, 200);
    createRock(scene, 1000, 500);

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
    let npc1 = new Npc(scene, 'npc', 900, 350);
    let npc2 = new Npc(scene, 'npc', 300, 500);

    scene.npcs = [];
    scene.npcs.push(npc1);
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
    
    // Coffres
    let shelf = new Storage(scene, 600, 200, 'shelf', 2, 5);
    let shelf2 = new Storage(scene, 800, 200, 'shelf', 3, 3);

    scene.storages = [];
    scene.storages.push(shelf);
    scene.storages.push(shelf2);

    shelf.addItem('wood', 3);
    shelf.addItem('stone', 1);
    shelf.addItem('wood', 1);
    shelf.addItem('tomato', 2);
    shelf2.addItem('fish', 8);
}

function createTree(scene, x, y) {
    let tree = scene.treesGroup.create(x, y, 'tree').setScale(2);
    tree.setSize(20, 30).setOffset(5, 20);
    tree.name = 'tree';
    tree.collision = new Phaser.Geom.Circle(tree.x, tree.y, detectionRadius);
    scene.physics.add.collider(scene.character, tree);
    return tree;
}

function createRock(scene, x, y) {
    let rock = scene.rocksGroup.create(x, y, 'rock').setScale(1);
    rock.setSize(30, 20).setOffset(0, 10);
    rock.name = 'rock';
    rock.collision = new Phaser.Geom.Circle(rock.x, rock.y, detectionRadius);
    scene.physics.add.collider(scene.character, rock);
    return rock;
}