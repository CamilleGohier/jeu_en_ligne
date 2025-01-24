import { toolOptions } from './data/variables.js';

export function preload() {
    this.load.image('empty', 'image/empty.png');

    toolOptions.forEach(tool => this.load.image(tool.key, 'image/' + tool.key + '.png'));

    this.load.spritesheet('soil', 'image/soil.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('water', 'image/water.png');

    this.load.spritesheet('character', 'image/character.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_fishing', 'image/character_fishing.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_farming', 'image/character_farming.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_chopping', 'image/character_chopping.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_mining', 'image/character_mining.png', {frameWidth: 32, frameHeight: 32});
    
    this.load.image('wheat', 'image/wheat.png');
    this.load.image('wheat_seed', 'image/wheat_seed.png');
    this.load.spritesheet('wheat_seed_crop', 'image/wheat_crop.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('tomato', 'image/tomato.png');
    this.load.image('tomato_seed', 'image/tomato_seed.png');
    this.load.spritesheet('tomato_seed_crop', 'image/tomato_crop.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('wood', 'image/wood.png');
    this.load.image('stick', 'image/stick.png');
    this.load.image('stone', 'image/stone.png');
    this.load.image('ore', 'image/ore.png');

    this.load.image('fish', 'image/guppy.png');
    this.load.image('waste', 'image/plastic_bag.png');
    this.load.image('information', 'image/info.png');

    this.load.image('tree', 'image/tree.png');
    this.load.image('trunk', 'image/trunk.png');
    this.load.image('rock', 'image/rock.png');

    this.load.image('inventory_background', 'image/inventory.png');
    this.load.image('tile', 'image/tile.png');
    this.load.image('arrow', 'image/arrow.png');
}