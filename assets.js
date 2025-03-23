import { tools } from './data/variables.js';

export function preload() {
    this.load.image('empty', 'image/empty.png');

    tools.forEach(tool => this.load.image(tool.key, 'image/' + tool.key + '.png'));

    this.load.spritesheet('grass', 'image/grass.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('soil', 'image/soil.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('water', 'image/water.png');
    this.load.image('tile_test', 'image/tile_test.png');

    this.load.spritesheet('character', 'image/character.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_fishing', 'image/character_fishing.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_farming', 'image/character_farming.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_chopping', 'image/character_chopping.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_mining', 'image/character_mining.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('character_attacking', 'image/character_attacking.png', {frameWidth: 32, frameHeight: 32});

    this.load.spritesheet('npc_idle', 'image/npcs/npc_idle.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('npc_walk', 'image/npcs/npc_walk.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('farmer_idle', 'image/npcs/farmer_idle.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('farmer_walk', 'image/npcs/farmer_walk.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('blacksmith_idle', 'image/npcs/blacksmith_idle.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('blacksmith_walk', 'image/npcs/blacksmith_walk.png', {frameWidth: 32, frameHeight: 64});

    this.load.spritesheet('enemy1', 'image/enemies/enemy1.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemy2', 'image/enemies/enemy2.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('enemy3', 'image/enemies/enemy3.png', {frameWidth: 32, frameHeight: 32});
    
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
    this.load.image('slime_bubble', 'image/slime_bubble.png');

    this.load.image('information', 'image/info.png');

    this.load.image('tree', 'image/tree.png');
    this.load.image('trunk', 'image/trunk.png');
    this.load.image('rock', 'image/rock.png');

    this.load.image('inventory_background', 'image/inventory.png');
    this.load.image('tile', 'image/tile.png');
    this.load.image('arrow', 'image/arrow.png');

    this.load.spritesheet('wall', 'image/wall.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('door', 'image/door.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('parquet', 'image/parquet.png', {frameWidth: 32, frameHeight: 32});

    this.load.image('shelf', 'image/shelf.png');
    this.load.image('desk', 'image/desk.png');

    this.load.text('distortionShader', 'image/shaders/distortion.glsl');
    this.load.text('vignetteShader', 'image/shaders/vignette.glsl');
}