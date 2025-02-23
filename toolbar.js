import { toolOptions, secondOptions } from './data/variables.js';

export function createToolBar(scene) {
    const startX = 490;
    const startY = 680;
    const outerSpacing = 10;
    const tileSize = 32;
    const spacing = 8;

    scene.add.image(460, 620, 'inventory_background').setOrigin(0, 0).setScrollFactor(0);

    scene.toolBar = [];

    for (let i = 0; i < toolOptions.length; i++) {
        let x = startX + i * spacing;
        let y = startY;

        x = startX + i * (tileSize + spacing) + (i > 0 ? outerSpacing : 0);
        scene.add.image(x, startY, 'tile').setScale(1.3).setScrollFactor(0);

        const toolIcon = scene.add.sprite(x, y, toolOptions[i].key).setInteractive().setScale(1).setScrollFactor(0);
        scene.toolBar.push(toolIcon);

        scene.selectedTool = 0;
        scene.toolBar[scene.selectedTool].setTint(0xff5555);

        if (toolOptions[i].key == 'hoe') {
            scene.selectedSeed = secondOptions['hoe'][0].seed;
            const toolSeed = scene.add.sprite(x+9, y+9, scene.selectedSeed).setInteractive().setScale(0.5).setScrollFactor(0);
            scene.toolBar[i].seed = toolSeed;
        }
    }
}

export function selectPreviousTool(scene) {
    let selectedIndex = scene.selectedTool;

    scene.toolBar[selectedIndex].clearTint();

    selectedIndex = (selectedIndex - 1 + scene.toolBar.length) % scene.toolBar.length;
    scene.toolBar[selectedIndex].setTint(0xff5555);
    scene.selectedTool = selectedIndex;
}

export function selectNextTool(scene) {
    let selectedIndex = scene.selectedTool;

    scene.toolBar[selectedIndex].clearTint();

    selectedIndex = (selectedIndex + 1) % scene.toolBar.length;
    scene.toolBar[selectedIndex].setTint(0xff5555);
    scene.selectedTool = selectedIndex;
}

export function createSecondaryToolBar(scene) {
    const startX = 18;
    const startY = 633;

    const centerY = 610;

    const tileSize = 8;
    const spacing = 16;

    const selectedToolKey = toolOptions[scene.selectedTool].key;

    if (scene.wheel) {
        scene.wheel.forEach(icon => icon.destroy());
    }

    scene.wheel = [];
    scene.wheel.icons = [];
    scene.wheel.tiles = [];

    if (secondOptions[selectedToolKey]) {
        const background_wheel = scene.add.sprite(scene.toolBar[scene.selectedTool].x - 66, centerY, 'inventory_background').setOrigin(0, 0).setScale(0.4).setScrollFactor(0);
        scene.wheel.push(background_wheel);

        const arrow = scene.add.sprite(background_wheel.x + startX + 2 * (tileSize + spacing) + 1, startY + 15, 'arrow').setScale(0.75).setScrollFactor(0);
        scene.wheel.push(arrow);

        for(let i = 0; i < 5; i++) {
            const x = background_wheel.x + startX + i * (tileSize + spacing) + (i <= 2 ? 50 : 0) - (i > 2 ? 70 : 0);
            const tile = scene.add.sprite(x, startY, 'tile').setScale(0.75).setScrollFactor(0);
            scene.wheel.tiles.push(tile);

            const icon = scene.add.sprite(x, startY, secondOptions[selectedToolKey][i] ? secondOptions[selectedToolKey][i].seed : "empty").setInteractive().setScale(0.7).setScrollFactor(0);
            icon.name = secondOptions[selectedToolKey][i] ? secondOptions[selectedToolKey][i].seed : null;
            scene.wheel.icons.push(icon);
        };
    }
}

export function hideWheel(scene) {
    if(scene.wheel && scene.wheel.length > 0) {
        scene.wheel.icons.forEach(icon => icon.setVisible(false));
        scene.wheel.tiles.forEach(icon => icon.setVisible(false));
        scene.wheel.forEach(icon => icon.setVisible(false));
    }
}

export function selectSecondPreviousTool(scene) {
    scene.wheel.icons.forEach(sprite => sprite.x = sprite.x + 24);
    scene.wheel.tiles.forEach(sprite => sprite.x = sprite.x + 24);

    scene.wheel.icons[2].x = scene.wheel.icons[2].x - 120;
    scene.wheel.tiles[2].x = scene.wheel.icons[2].x - 0;

    let lastItem = scene.wheel.icons.pop();
    scene.wheel.icons.unshift(lastItem);
    secondOptions[toolOptions[scene.selectedTool].key].unshift(secondOptions[toolOptions[scene.selectedTool].key].pop());
    let lastTile = scene.wheel.tiles.pop();
    scene.wheel.tiles.unshift(lastTile);

    scene.selectedSeed = scene.wheel.icons[0].name;
    scene.toolBar[scene.selectedTool].seed.setTexture(scene.selectedSeed);
}

export function selectSecondNextTool(scene) {
    scene.wheel.icons.forEach(sprite => sprite.x = sprite.x - 24);
    scene.wheel.tiles.forEach(sprite => sprite.x = sprite.x - 24);

    scene.wheel.icons[3].x = scene.wheel.icons[3].x + 120;
    scene.wheel.tiles[3].x = scene.wheel.icons[3].x + 0;

    let firstItem = scene.wheel.icons.shift();
    scene.wheel.icons.push(firstItem);
    let firstTile = scene.wheel.tiles.shift();
    secondOptions[toolOptions[scene.selectedTool].key].push(secondOptions[toolOptions[scene.selectedTool].key].shift());
    scene.wheel.tiles.push(firstTile);

    scene.selectedSeed = scene.wheel.icons[0].name;
    scene.toolBar[scene.selectedTool].seed.setTexture(scene.selectedSeed);
}