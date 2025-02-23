export function createHpBar(scene, entity, maxHealth, offsetX, offsetY) {
    const centerX = entity.x + offsetX;
    const centerY = entity.y + offsetY;
    const radius = 4;

    let hpBar = scene.add.container(entity.x + offsetX, entity.y + offsetY);
    hpBar.health = scene.add.graphics().setAlpha(0);
    hpBar.currentHealth = maxHealth;
    hpBar.maxHealth = maxHealth;
    hpBar.offsetX = offsetX;
    hpBar.offsetY = offsetY;
    hpBar.isFading = false;
    scene.physics.world.fixedStep = false;
    hpBar.add(hpBar.health);

    updateHpBar(hpBar);

    return hpBar;
}

export function updateHpBar(hpBar, damage = 0) {
    let color;
    hpBar.currentHealth = Phaser.Math.Clamp(hpBar.currentHealth + damage, 0, hpBar.maxHealth);
    hpBar.health.clear();

    const startAngle = Phaser.Math.DegToRad(270);
    const endAngle = startAngle + Phaser.Math.DegToRad(360 * (hpBar.currentHealth / hpBar.maxHealth));

    if (hpBar.currentHealth / hpBar.maxHealth >= 0.7) {
            color = 0xEAA941;
    }
    else if (hpBar.currentHealth / hpBar.maxHealth >= 0.3) {
        color = 0xFF7F27;
    }
    else {
        color = 0xED3843;
    }

    hpBar.health.lineStyle(4, color).beginPath().arc(0, 0, 3, startAngle, endAngle, false).strokePath();
    
    if (hpBar.currentHealth == hpBar.maxHealth && !hpBar.isFading) {
        hpBar.isFading = true;
        hpBar.fading = setTimeout(function() {
                hpBar.health.setAlpha(0);
        }, 2000)
    }
    else if (hpBar.currentHealth != hpBar.maxHealth && hpBar.isFading) {
        clearTimeout(hpBar.fading);
        hpBar.health.setAlpha(1);
        hpBar.isFading = false;
    }

    return hpBar;
}