import { preload } from './assets.js';
import { characterAnimations, updateCharacterAnimation } from './character.js';
import { setCamera } from './camera.js';
import { createSoilGrid, createWaterGrid } from './grid.js';
import { createWorld } from './world.js';
import { createInventory, showInventory, hideInventory } from './inventory.js';
import { createToolBar, selectPreviousTool, selectNextTool, createSecondaryToolBar, selectSecondPreviousTool, selectSecondNextTool, hideWheel } from './toolbar.js';
import { startFarming } from './action/farming.js';
import { startFishing } from "./action/fishing.js";
import { startChopping } from './action/chopping.js';
import { startMining } from './action/mining.js';

import { toolOptions } from './data/variables.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    //Grille
    createSoilGrid(this);
    createWaterGrid(this);

    // Personnage
    this.canWalk = [];
    characterAnimations(this);

    // Environnement
    createWorld(this);

    // Caméra
    setCamera(this);

    // Création de l'inventaire
    createInventory(this);

    // Affichage de la barre d'outils
    createToolBar(this);

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
        showInventory(this);
    });

    this.input.keyboard.on('keyup-E', () => {
        hideInventory(this);
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
        }
    });
}

function update() {
    updateCharacterAnimation(this);
}