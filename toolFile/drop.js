import { data } from '../data/loot.js';
import Inventory from '../stockage/Inventory.js';

export function dropLoot(scene, startX, startY, loot) {
    let loot_tab = data[loot];
    
    loot_tab.forEach(drop => {
        let quantity = Phaser.Math.Between(1, drop.quantity_max);

        while(quantity > 0) {
            let item = scene.physics.add.sprite(startX, startY, drop.item).setOrigin(0).setScale(0.5).setDepth(15);
            item.name = drop.item;

            setItem(scene, item);
            quantity -= 1;
        }
    });
}

export function dropObject(scene, startX, startY, loot) {
    let item = scene.physics.add.sprite(startX, startY, loot).setOrigin(0).setScale(0.5).setDepth(15);
    item.name = loot;

    setItem(scene, item);
}

function setItem(scene, item) {
    let angle = Phaser.Math.Between(0, 360);
    let speed = Phaser.Math.Between(50, 150);
    scene.physics.velocityFromAngle(angle, speed, item.body.velocity);

    scene.time.delayedCall(300, () => {
        item.body.setVelocity(0);
        item.collision = scene.add.circle(item.x + 8, item.y + 8, 30);
        scene.physics.add.existing(item.collision);

        item.overlap = scene.physics.add.overlap(item.collision, scene.character, () => {
            if (Inventory.savedContent.flat().some(slot => slot == null || slot.name == item.name)) {
                scene.droppedItemTab.push(item);
                item.overlap.active = false;
            }
        })
    })
}

export function enableLootItemTab(scene) {
    scene.droppedItemTab = [];
    scene.events.on('update', () => {
        updateLoot(scene);
    })
}

function updateLoot(scene) {
    if (!scene.droppedItemTab) {
        return;
    }

    scene.droppedItemTab.forEach((item, col) => {
        let speed = 200;
        item.collision.setPosition(item.x + 8, item.y + 8);

        scene.physics.moveTo(item, scene.character.x, scene.character.y, speed);

        if (Phaser.Math.Distance.Between(item.x, item.y, scene.character.x, scene.character.y) < 8) {
            item.body.setVelocity(0);
            
            if (Inventory.savedContent.flat().some(slot => slot == null || slot.name == item.name)) {
                scene.inventory.addItem(item.name, 1);
                item.collision.destroy();
                item.destroy();
            }
            else {
                scene.time.delayedCall(100, () => {
                    item.overlap.active = true;
                })
            }
            scene.droppedItemTab.splice(col, 1);
        }
    })
}