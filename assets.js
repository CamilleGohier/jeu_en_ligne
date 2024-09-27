import { toolOptions, seedOptions } from './variables.js';

export function preload() {
    toolOptions.forEach(tool => this.load.image(tool.key, 'image/' + tool.key + '.png'));
    seedOptions.forEach(seed => this.load.spritesheet(seed.key + '_crop', 'image/' + seed.key + '_crop.png', {frameWidth: 32, frameHeight: 32}));

    this.load.spritesheet('soil', 'image/soil.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('water', 'image/water.png');

    this.load.spritesheet('character', 'image/character.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_fishing', 'image/character_fishing.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_farming', 'image/character_farming.png', {frameWidth: 32, frameHeight: 32})
    
    this.load.image('wheat', 'image/wheat.png');
    this.load.image('wheat_seed', 'image/wheat_seed.png');
    this.load.image('tomato', 'image/tomato.png');
    this.load.image('tomato_seed', 'image/tomato_seed.png');

    this.load.image('fish', 'image/guppy.png');
    this.load.image('waste', 'image/plastic_bag.png');

    this.load.image('information', 'image/info.png');
}