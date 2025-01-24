export function createWorld(scene) {

    // Arbres
    scene.treesGroup = scene.physics.add.staticGroup();
    scene.currentHitBox = [];
    let detectionRadius = 30;

    let tree = scene.treesGroup.create(600, 400, 'tree').setScale(2);
    tree.name = 'tree';
    tree.collision = new Phaser.Geom.Circle(tree.x, tree.y, detectionRadius);

    // Dessiner hitbox arbres
    // scene.add.graphics().lineStyle(1, 0xffffff).strokeCircle(tree.collision.x, tree.collision.y, tree.collision.radius);

    scene.physics.add.collider(scene.character, tree);

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
    scene.currentHitBox = [];
    detectionRadius = 30;

    let rock = scene.rocksGroup.create(700, 400, 'rock').setScale(1.5);
    rock.name = 'rock';
    rock.collision = new Phaser.Geom.Circle(rock.x, rock.y, detectionRadius);

    scene.physics.add.collider(scene.character, rock);

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
}