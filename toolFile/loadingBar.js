export function createLoadingBar(scene, entity, maxAmount, offsetX, offsetY) {
    const centerX = entity.x + offsetX;
    const centerY = entity.y + offsetY;

    let loadingBar = scene.add.container(centerX, centerY).setDepth(15);
    loadingBar.content = scene.add.graphics().setAlpha(1);
    loadingBar.currentAmount = 0;
    loadingBar.maxAmount = maxAmount;
    loadingBar.offsetX = offsetX;
    loadingBar.offsetY = offsetY;
    scene.physics.world.fixedStep = false;
    loadingBar.add(loadingBar.content);

    updateLoadingBar(loadingBar, scene);

    return loadingBar;
}

export function updateLoadingBar(loadingBar, scene) {
    let color = '0x0096C7';
    loadingBar.currentAmount = Phaser.Math.Clamp(loadingBar.currentAmount + loadingBar.maxAmount/10, 0, loadingBar.maxAmount);
    loadingBar.content.clear();

    const startAngle = Phaser.Math.DegToRad(270);
    const endAngle = startAngle + Phaser.Math.DegToRad(360 * (loadingBar.currentAmount / loadingBar.maxAmount));

    loadingBar.content.lineStyle(4, color).beginPath().arc(0, 0, 3, startAngle, endAngle, false).strokePath();
    
    if (loadingBar.currentAmount != loadingBar.maxAmount) {
        loadingBar.timer = setTimeout(function() {
            updateLoadingBar(loadingBar);
        }, (loadingBar.maxAmount * 1000)/10)
    }
    else {
        loadingBar.destroy();
    }

    return loadingBar;
}