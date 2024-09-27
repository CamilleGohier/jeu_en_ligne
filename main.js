import { preload } from './assets.js';
import { characterAnimations, updateCharacterAnimation } from './character.js';
import { createSoilGrid, createWaterGrid } from './grid.js';
import { createInventory } from './inventory.js';
import { createToolWheel, hideToolWheel, createSecondaryWheel, hideSecondaryWheel } from './wheels.js';
import { startFarming } from './action/farming.js';
import { startFishing } from "./action/fishing.js";

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

const game = new Phaser.Game(config);

function create() {

    //Grille
    createSoilGrid(this);
    createWaterGrid(this);

    // Personnage
    this.canWalk = true;
    characterAnimations(this);

    // Affichage de l'inventaire
    createInventory(this);

    // Création des roues
    this.selectedTool = null;
    this.selectedSeed = null;
    this.toolWheel = null;
    this.seedWheel = null;

    createToolWheel(this);
    hideToolWheel(this);

    createSecondaryWheel(this);
    hideSecondaryWheel(this);

    // Actions de touches
    this.input.keyboard.on('keydown-A', () => createToolWheel(this));
    this.input.keyboard.on('keyup-A', () => hideToolWheel(this));

    this.input.keyboard.on('keydown-E', () => createSecondaryWheel(this));
    this.input.keyboard.on('keyup-E', () => hideSecondaryWheel(this));

    this.input.keyboard.on('keydown-SPACE', () => {
        if (this.selectedTool.key == 'fishing_rod') {
            startFishing(this);
        }
        else if (this.selectedTool.key == 'hoe'){
            startFarming(this);
        }
    });
}

function update() {
    updateCharacterAnimation(this);
}