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
    this.load.spritesheet('character_digging', 'image/character_digging.png', {frameWidth: 32, frameHeight: 32});

    this.load.spritesheet('farmer_idle', 'image/npcs/farmer_idle.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('farmer_walk', 'image/npcs/farmer_walk.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('girl_idle', 'image/npcs/girl_idle.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('girl_walk', 'image/npcs/girl_walk.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('blacksmith_idle', 'image/npcs/blacksmith_idle.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('blacksmith_walk', 'image/npcs/blacksmith_walk.png', {frameWidth: 32, frameHeight: 64});

    this.load.spritesheet('slime1', 'image/enemies/enemy1.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('slime2', 'image/enemies/enemy2.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('slime3', 'image/enemies/enemy3.png', {frameWidth: 32, frameHeight: 32});
    
    this.load.spritesheet('pigeon', 'image/pigeon.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('cow', 'image/animal/cow.png', {frameWidth: 64, frameHeight: 32});
    this.load.image('milk', 'image/milk.png');
    this.load.spritesheet('chicken', 'image/animal/chicken.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('egg', 'image/egg.png');

    this.load.image('wheat', 'image/wheat.png');
    this.load.image('wheat_seed', 'image/wheat_seed.png');
    this.load.spritesheet('wheat_seed_crop', 'image/wheat_crop.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('tomato', 'image/tomato.png');
    this.load.image('tomato_seed', 'image/tomato_seed.png');
    this.load.spritesheet('tomato_seed_crop', 'image/tomato_crop.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('wood', 'image/wood.png');
    this.load.image('stick', 'image/stick.png');
    this.load.image('plank', 'image/plank.png');
    this.load.image('stone', 'image/stone.png');
    this.load.image('ore', 'image/ore.png');
    this.load.image('slime_bubble', 'image/slime_bubble.png');
    this.load.image('worm', 'image/worm.png');

    this.load.image('fish1', 'image/fishing/fish1.png');
    this.load.image('fish2', 'image/fishing/fish2.png');
    this.load.image('waste', 'image/fishing/plastic_bag.png');
    this.load.image('boot', 'image/fishing/boot.png');
    this.load.image('seaweed', 'image/fishing/seaweed.png');
    this.load.image('clay', 'image/fishing/clay.png');

    this.load.image('information', 'image/info.png');

    this.load.image('tree', 'image/tree.png');
    this.load.image('trunk', 'image/trunk.png');
    this.load.image('rock', 'image/rock.png');

    this.load.image('inventory_background', 'image/inventory.png');
    this.load.image('line', 'image/line.png');
    this.load.image('tile', 'image/tile.png');
    this.load.image('tile_trade', 'image/tile_trade.png');
    this.load.image('arrow', 'image/arrow.png');
    this.load.image('arrow_up', 'image/arrow_up.png');
    this.load.image('arrow_right', 'image/arrow_right.png');
    this.load.image('dot', 'image/dot.png');

    this.load.image('uncheck', 'image/ui/uncheck.png');
    this.load.image('check', 'image/ui/check.png');

    this.load.image('flower_pot', 'image/flower_pot.png');

    this.load.spritesheet('wall', 'image/wall.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('fence', 'image/fence.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('door', 'image/door.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('door_clicked', 'image/door_clicked.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('parquet', 'image/parquet.png', {frameWidth: 32, frameHeight: 32});

    this.load.spritesheet('feeder', 'image/feeder.png', {frameWidth: 32, frameHeight: 32});
    this.load.spritesheet('nest', 'image/nest.png', {frameWidth: 32, frameHeight: 32});

    this.load.spritesheet('shelf', 'image/shelfs/shelf.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('shelf2', 'image/shelfs/shelf2.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('shelf3', 'image/shelfs/shelf3.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('shelf_clicked', 'image/shelfs/shelf_clicked.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('shelf2_clicked', 'image/shelfs/shelf2_clicked.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('shelf3_clicked', 'image/shelfs/shelf3_clicked.png', {frameWidth: 32, frameHeight: 64});
    
    this.load.spritesheet('workbench', 'image/workbench.png', {frameWidth: 32, frameHeight: 32});

    this.load.text('distortionShader', 'image/shaders/distortion.glsl');
    this.load.text('vignetteShader', 'image/shaders/vignette.glsl');
}