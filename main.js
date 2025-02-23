import { preload } from './assets.js';
import { characterAnimations, updateCharacterAnimation } from './character.js';
import { NPCAnimations } from './npcs/npc_animations.js';
import { setCamera } from './camera.js';
import { createGroundGrid, createSoilGrid, createWaterGrid } from './grid.js';
import { createWorld } from './world.js';
import { spawnEnemies } from './enemies/enemy.js'
import Inventory from "./stockage/Inventory.js";
import { createToolBar, selectPreviousTool, selectNextTool, createSecondaryToolBar, selectSecondPreviousTool, selectSecondNextTool, hideWheel } from './toolbar.js';
import { startFarming } from './action/farming.js';
import { startFishing } from "./action/fishing.js";
import { startChopping } from './action/chopping.js';
import { startMining } from './action/mining.js';
import { startAttacking } from './action/attacking.js';

import { toolOptions } from './data/variables.js';
import { walkingQueue } from "./tool_file/walking_queue.js";

import { initializeDragAndDrop } from './tool_file/drag.js';
import { enableLootItemTab } from './tool_file/drop_item.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let isASelected = false;

const game = new Phaser.Game(config);

window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function create() {
    this.physics.world.setBounds(0, 0, 1920, 1080);

    // Création de l'inventaire
    this.inventory = new Inventory(this, 490, 560, 32, 2, 10, 0);

    //Grille
    createGroundGrid(this);
    createSoilGrid(this);
    createWaterGrid(this);

    // Personnages
    this.canWalk = [];
    this.canOpenInventory = [];
    characterAnimations(this);
    NPCAnimations(this);

    // Environnement
    createWorld(this);

    //Ennemis
    spawnEnemies(this);

    // Caméra
    setCamera(this);

    // Affichage de la barre d'outils
    createToolBar(this);

    initializeDragAndDrop(this);
    enableLootItemTab(this);

    // Actions de touches
    this.input.on('wheel', (pointer, gameObject, deltaX, deltaY, deltaZ) => {
        if (isASelected && toolOptions[this.selectedTool].key == 'hoe') {
            if(deltaY > 0) {
                selectSecondNextTool(this);
            }
            else {
                selectSecondPreviousTool(this);
            }
        }
        else {
            if(deltaY > 0) {
                selectNextTool(this);
            }
            else {
                selectPreviousTool(this);
            }
        }
        
    });

    this.input.keyboard.on('keydown-A', () => {
        if (!isASelected) {
            createSecondaryToolBar(this);
            isASelected = true;
        }
    });

    this.input.keyboard.on('keyup-A', () => {
        isASelected = false;
        hideWheel(this);
    })

    this.input.keyboard.on('keydown-E', () => {
        if (this.canOpenInventory == 0) {
            this.inventory.show();
            walkingQueue(this, 'inventoryOpen', 'cannot');
        }
    });

    this.input.keyboard.on('keyup-E', () => {
        this.inventory.hide();
        walkingQueue(this, 'inventoryOpen', 'can');
    })
    
    this.input.on('pointerdown', (pointer) => {
        if (pointer.leftButtonDown()) {
            if (toolOptions[this.selectedTool].key == 'fishing_rod') {
                startFishing(this);
            }
            else if (toolOptions[this.selectedTool].key == 'hoe'){
                startFarming(this);
            }
            else if (toolOptions[this.selectedTool].key == 'axe') {
                startChopping(this);
            }
            else if (toolOptions[this.selectedTool].key == 'pickaxe') {
                startMining(this);
            }
            else if (toolOptions[this.selectedTool].key == 'sword') {
                startAttacking(this);
            }
        }
    });
}

function update() {
    updateCharacterAnimation(this);
    // console.log(this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y));
}