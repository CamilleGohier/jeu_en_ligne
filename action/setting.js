import { walkingQueue } from "../toolFile/walkingQueue.js";

let container;
let content = [];

export function startSetting(scene, pointer) {
    let coords = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    let cell = scene.worldGrid[Math.floor(coords.y/32)][Math.floor(coords.x/32)];

    if (!cell.object) {
        return;
    }

    // if (cell.object.name != 'shelf' && cell.object.name != 'workbench') {
    if (cell.object.name != 'shelf') {
        return;
    }

    if (container) {
        container.destroy();

        content.forEach(icon => {
            icon.destroy();
        });
        content = [];
    }

    walkingQueue(scene, 'settingObjectOpen', 'cannot');

    container = scene.add.container(scene.cameras.main.width /2, scene.cameras.main.height /2).setDepth(20).setScrollFactor(0);
    let background = scene.add.graphics().setDepth(20).fillStyle(0x909090, 0.8).fillRect(-200, -200, 400, 250).setScrollFactor(0);
    container.add(background);

    const closeButton = scene.add.text(160, -180, 'X', { fontSize: '20px', fill: '#000'}).setDepth(25).setInteractive().setScrollFactor(0);
    closeButton.on('pointerdown', () => {
        closeSetting(scene);
    })
    container.add(closeButton);

    setInterfaceShelf(scene, cell);
    // switch (cell.object.name) {
    //     case 'shelf':
    //         setInterfaceShelf(scene, cell);
    //     break;

    //     case 'workbench':
    //         setInterfaceWorkbench(scene, cell);
    //     break;
    // }
}

function closeSetting(scene) {
    if (container) {
        container.destroy();

        content.forEach(icon => {
            icon.destroy();
        });
        content = [];
    }

    walkingQueue(scene, 'settingObjectOpen', 'can');
}

function setInterfaceShelf(scene, cell) {
    const numberOfColors = 3;

    for (let i = 1; i <= numberOfColors; i++) {
        const tile = scene.add.sprite(i * 50 -160, -118, 'tile').setScale(1.3).setScrollFactor(0);
        const sprite = scene.add.sprite(i * 50 -160, -120, 'shelf'+(i == 1 ? '' : i)).setOrigin(0.5, 0.75).setDepth(30).setInteractive().setScrollFactor(0);
        tile.color = i;
        sprite.color = i;

        if (cell.object.color && cell.object.color == i) {
            tile.setAlpha(0.7);
            sprite.setAlpha(0.7);
            tile.setTint("0xBBAAAA");
            sprite.setTint("0xBBAAAA");
        }
        else if (!cell.object.color && i == 0) {

        }

        sprite.on('pointerdown', () => {
            cell.color = i;
            setColor(i);
            cell.object.color = i;
            cell.object.sprite.setTexture('shelf'+(i == 1 ? '' : i));
        });

        container.add(tile);
        container.add(sprite);

        content.push(tile);
        content.push(sprite);
    }

    const text = scene.add.text(-130, -50, 'Autoriser ce coffre \naux villageois', { fontSize: '14px', fill: '#000'}).setScrollFactor(0);
    container.add(text);

    const button = scene.add.sprite(60, -60, (scene.storages.includes(cell.object) ? 'check' : 'uncheck')).setOrigin(0).setScale(0.75).setInteractive().setScrollFactor(0);
    button.check = (scene.storages.includes(cell.object) ? true : false);
    container.add(button);
    button.on('pointerdown', () => {
        changeCheckState(scene, button, cell.object);
    });
}

function setColor(i) {
    content.forEach(icon => {
        if (icon.color == i) {
            icon.setAlpha(0.7);
            icon.setTint('0xBBAAAA');
        }
        else {
            icon.setAlpha(1);
            icon.setTint('0xFFFFFF');
        }
    })
}

function changeCheckState(scene, button, object) {
    if (button.check) {
        button.setTexture('uncheck');
        button.check = false;

        scene.storages = scene.storages.filter(item => item !== object);
    }
    else {
        button.setTexture('check');
        button.check = true;

        scene.storages.push(object);
    }
}