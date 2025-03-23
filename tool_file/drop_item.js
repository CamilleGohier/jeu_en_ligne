import { data } from '../data/loot.js';

export function drop_item(scene, startX, startY, endX, endY, loot) {

    let loot_tab = data[loot];

    if (loot == "fishing") {
        const random = loot_tab[Math.floor(Math.random() * loot_tab.length)];
        let item = scene.physics.add.sprite(startX, startY, random.item).setOrigin(0).setScale(0.5);
        item.name = random.item;

        let angle = Phaser.Math.Between(0, 360);
        let speed = Phaser.Math.Between(50, 150);
        scene.physics.velocityFromAngle(angle, speed, item.body.velocity);

        scene.droppedItemTab.push(item);

        scene.time.delayedCall(300, () => {
            item.isFollowing = true;
            item.body.setVelocity(0);
        })
    }
    else {
        loot_tab.forEach(drop => {
            let item = scene.physics.add.sprite(startX, startY, drop.item).setOrigin(0).setScale(0.5);
            item.name = drop.item;

            let angle = Phaser.Math.Between(0, 360);
            let speed = Phaser.Math.Between(50, 150);
            scene.physics.velocityFromAngle(angle, speed, item.body.velocity);

            scene.droppedItemTab.push(item);

            scene.time.delayedCall(300, () => {
                item.isFollowing = true;
                item.body.setVelocity(0);
            })
        });
    }
}

function updateLoot(scene) {
    if (!scene.droppedItemTab) {
        return;
    }

    scene.droppedItemTab.forEach((item, col) => {
        if (item.isFollowing) {
            let speed = 200;

            scene.physics.moveTo(item, scene.character.x, scene.character.y, speed);

            if (Phaser.Math.Distance.Between(item.x, item.y, scene.character.x, scene.character.y) < 8) {
                scene.inventory.addItem(item.name, 1);
                item.destroy();
                scene.droppedItemTab.splice(col, 1);
            }
        }
    })
}

export function enableLootItemTab(scene) {
    scene.droppedItemTab = [];
    scene.events.on('update', () => {
        updateLoot(scene);
    })
}