import { toolOptions, seedOptions} from './variables.js';

export function createToolWheel(scene) {
    const centerX = 400;
    const centerY = 300;
    const radius = 100;

    if (!scene.toolWheel) {
        scene.toolWheel = [];

        for (let i = 0; i < toolOptions.length; i++) {
            const angle = (i / toolOptions.length) * Math.PI * 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const toolIcon = scene.add.sprite(x, y, toolOptions[i].key).setInteractive().setScale(1.5);
            scene.toolWheel.push(toolIcon);

            toolIcon.on('pointerdown', () => {
                scene.toolWheel.forEach(icon => icon.clearTint());
                toolIcon.setTint(0xff5555);
                scene.selectedTool = toolOptions[i].name;
            });
        }
    }
    else {
        scene.toolWheel.forEach(icon => icon.setVisible(true));
    }
}

export function hideToolWheel(scene) {
    if (scene.toolWheel) {
        scene.toolWheel.forEach(icon => icon.setVisible(false));
    }
}

export function createSecondaryWheel(scene) {
    const centerX = 400;
    const centerY = 300;
    const radius = 80;

    if (!scene.seedWheel) {
        scene.seedWheel = [];

        for (let i = 0; i < seedOptions.length; i++) {
            const angle = (i / seedOptions.length) * Math.PI * 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const seedIcon = scene.add.sprite(x, y, seedOptions[i].key).setInteractive().setScale(1.5);
            scene.seedWheel.push(seedIcon);

            seedIcon.on('pointerdown', () => {
                scene.seedWheel.forEach(icon => icon.clearTint());
                seedIcon.setTint(0xff5555);
                scene.selectedSeed = seedOptions[i];
            });
        }
    }
    else {
        scene.seedWheel.forEach(icon => icon.setVisible(true));
    }
}

export function hideSecondaryWheel(scene) {
    if(scene.seedWheel) {
        scene.seedWheel.forEach(icon => icon.setVisible(false));
    }
}