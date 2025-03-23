// Assets et Animations
import { preload } from './assets.js';
import { characterAnimations, updateCharacterAnimation } from './character.js';
import { NPCAnimations } from './npcs/npc_animations.js';
import { createEffectScene, updateLight } from './effects.js';
import Item from './tool_file/add_sprite.js';

// Gestion de la caméra et de la grille
import { setCamera } from './camera.js';
import { createWorldGrid } from './grid.js';

// Création de l'environnement
import { createWorld } from './world.js';
import { spawnEnemies } from './enemies/Enemy.js';

// Stockage et outils
import Inventory from "./stockage/Inventory.js";
import { Toolbar } from './toolbar.js';

// Actions
import { startFarming } from './action/farming.js';
import { startFishing } from "./action/fishing.js";
import { startChopping } from './action/chopping.js';
import { startMining } from './action/mining.js';
import { startAttacking } from './action/attacking.js';
import { startPlacing, updatePositionPlacing, startRemoving, rotateItem } from './action/placing.js';

// Données et utilitaires
import { walkingQueue } from "./tool_file/walking_queue.js";
import { initializeDragAndDrop } from './tool_file/drag.js';
import { enableLootItemTab } from './tool_file/drop_item.js';

const config = {
    type: Phaser.WEBGL,
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
    },
    banner: false
};

const game = new Phaser.Game(config);

window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function create() {
    this.lastMouseMove = 0;
    this.physics.world.setBounds(0, 0, 1920, 1080);

    Item.init(this);

    // Création de l'inventaire
    this.inventory = new Inventory(this, 475, 560, 32, 2, 10, 0);

    //Grille
    createWorldGrid(this);

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
    // createToolBar(this);
    this.toolbar = new Toolbar(this);
    initializeDragAndDrop(this);
    enableLootItemTab(this);

    // Actions de touches
    this.input.on('wheel', (pointer, gameObject, deltaX, deltaY, deltaZ) => {
        if (this.toolbar.isShowingSecondary) {
            if(deltaY > 0) {
                this.toolbar.selectNextSecondary(this);
            }
            else {
                this.toolbar.selectPreviousSecondary(this);
            }
        }
        else {
            if(deltaY > 0) {
                this.toolbar.selectNextPrimary(this);
            }
            else {
                this.toolbar.selectPreviousPrimary(this);
            }
        }
    });

    this.input.keyboard.on('keydown-A', () => {
        if (!this.toolbar.isShowingSecondary) {
            this.toolbar.updateSecondaryToolbar();
        }
    });

    this.input.keyboard.on('keyup-A', () => {
        this.toolbar.hideSecondary(this);
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
            // Choix de l'action à effectuer en fonction de l'outil en main
            switch (this.toolbar.primaryItems[this.toolbar.selectedTool].name) {
                case 'hoe':
                    startFarming(this);
                    break;
                case 'fishing_rod':
                    startFishing(this);
                    break;
                case 'axe':
                    startChopping(this);
                    break;
                case 'pickaxe':
                    startMining(this);
                    break;
                case 'sword':
                    startAttacking(this);
                    break;
                case 'hand':
                    startPlacing(this, pointer);
                    break;
            }
        }
        if (pointer.rightButtonDown()) {
            startRemoving(this, pointer);
        }
    });

    this.input.keyboard.on('keyup-R', () => {
        rotateItem(this);
    })

    this.input.on('pointermove', (pointer) => {
        // Déplacement de l'objet quand la main est sélectionnée
        updatePositionPlacing(this, pointer);
    });

    createEffectScene(this);

    // createGridTest(this);
}

function update(time) {
    updateCharacterAnimation(this);
    updateLight(this);

    const camera = this.cameras.main;
    this.particles.emitZone = {
        source : new Phaser.Geom.Rectangle(camera.worldView.x, camera.worldView.y, camera.width, camera.height)
    };

    // console.log(this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y));
}