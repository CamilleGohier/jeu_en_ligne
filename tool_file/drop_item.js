export function drop_item(scene, startX, startY, endX, endY, sprite, onCompleteCallback) {

    let item = scene.physics.add.sprite(startX, startY, sprite).setOrigin(0);

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
                    item.destroy();
                }
            });
        }
    })
}