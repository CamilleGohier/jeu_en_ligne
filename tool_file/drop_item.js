import { data } from '../data/loot.js';
import { add_inventory } from '../inventory.js';

export function drop_item(scene, startX, startY, endX, endY, loot, onCompleteCallback) {

    let loot_tab = data[loot];

    if (loot == "fishing") {
        const random = loot_tab[Math.floor(Math.random() * loot_tab.length)];
        let item = scene.physics.add.sprite(startX, startY, random.item).setOrigin(0);
        item.name = random.item;

        scene.tweens.add({
            targets: item,
            x: startX + Phaser.Math.Between(-30, 30),
            y: startY + Phaser.Math.Between(-30, 30),
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                scene.tweens.add({
                    targets: item,
                    x: endX - 16,
                    y: endY - 16,
                    duration: 500,
                    ease: 'Power2',
                    onComplete: () => {
                        if (onCompleteCallback) {
                            onCompleteCallback(item);
                        }
                        add_inventory(scene, item.name, 1);
                        item.destroy();
                    }
                });
            }
        })
    }
    else {
        loot_tab.forEach(drop => {
            let item = scene.physics.add.sprite(startX, startY, drop.item).setOrigin(0);
            item.name = drop.item;

            scene.tweens.add({
                targets: item,
                x: startX + Phaser.Math.Between(-30, 30),
                y: startY + Phaser.Math.Between(-30, 30),
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    scene.tweens.add({
                        targets: item,
                        x: endX - 16,
                        y: endY - 16,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            if (onCompleteCallback) {
                                onCompleteCallback(item);
                            }
                            add_inventory(scene, item.name, drop.quantity_max);
                            item.destroy();
                        }
                    });
                }
            })
        });
    }
}