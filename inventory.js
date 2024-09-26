export function createInventory(scene) {
    scene.inventory = {
        water: 3, 
        wheat: 0, 
        tomato: 0, 
        wheat_seed: 5,
        tomato_seed: 5
    };

    const style = {font: '16px Arial', fill: '#fff'};

    scene.waterText = scene.add.text(10, 350, 'Eau : ' + scene.inventory.water, style);
    scene.wheatText = scene.add.text(10, 370, 'Blé : ' + scene.inventory.wheat, style);
    scene.tomatoText = scene.add.text(10, 390, 'Tomate : ' + scene.inventory.tomato, style);
    scene.wheatSeedText = scene.add.text(10, 410, 'Graine de blé : ' + scene.inventory.wheat_seed, style);
    scene.tomatoSeedText = scene.add.text(10, 430, 'Graine de tomate : ' + scene.inventory.tomato_seed, style);
}