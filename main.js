// Dev
import { dev_functions } from './dev.js'

// Assets et Animations
import { preload } from './assets.js';
import { characterAnimations, updateCharacterAnimation } from './entity/character.js';
import { createEffectScene, updateLight } from './effects.js';
import Item from './toolFile/Item.js';

// Gestion de la caméra et de la grille
import { setCamera } from './camera.js';
import { createWorldGrid } from './grid.js';

// Création de l'environnement
import { createWorld } from './world.js';

// Stockage et outils
import Interface from "./stockage/Interface.js";
import { Toolbar } from './Toolbar.js';

// Actions
import { startFarming } from './action/farming.js';
import { startFishing } from "./action/fishing.js";
import { startChopping } from './action/chopping.js';
import { startMining } from './action/mining.js';
import { startAttacking } from './action/attacking.js';
import { startPlacing, updatePositionChecking, startRemoving, rotateItem } from './action/placing.js';
import { startDigging } from './action/digging.js';
import { startSetting } from './action/setting.js';

// Données et utilitaires
import { walkingQueue } from "./toolFile/walkingQueue.js";
import { initializeDragAndDrop } from './toolFile/drag.js';
import { enableLootItemTab } from './toolFile/drop.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');

        this.lastMouseMove = 0;
        this.currentOpenedInterface = null;
        this.canWalk = [];
        this.canOpenInventory = [];
    }

    preload() {
        preload.call(this);
    }

    create() {
        this.physics.world.setBounds(0, 0, 1920, 1088);

        Item.init(this);

        // Création de l'inventaire
        this.inventory = new Interface(this);

        //Grille
        createWorldGrid(this);

        // Personnage
        characterAnimations(this);

        // Environnement
        createWorld(this);

        // Caméra
        setCamera(this);

        // Affichage de la barre d'outils
        this.toolbar = new Toolbar(this);
        initializeDragAndDrop(this);
        enableLootItemTab(this);

        // Actions de touches
        this.input.on('wheel', (pointer, gameObject, deltaX, deltaY, deltaZ) => {
            if (!this.currentOpenedInterface) {
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
            if (this.canOpenInventory == 0 && this.currentOpenedInterface != this.inventory) {
                this.inventory.showInterface();
                walkingQueue(this, 'inventoryOpen', 'cannot');
                this.currentOpenedInterface = this.inventory;
            }
        });

        this.input.keyboard.on('keyup-E', () => {
            this.inventory.hideInterface();
            walkingQueue(this, 'inventoryOpen', 'can');
            this.currentOpenedInterface = null;
        })
        
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && !this.currentOpenedInterface) {
                // Choix de l'action à effectuer en fonction de l'outil en main
                switch (this.toolbar.primaryItems[this.toolbar.selectedTool].name) {
                    case 'hoe':
                        startFarming(this, pointer);
                        break;
                    case 'fishing_rod':
                        startFishing(this);
                        break;
                    case 'axe':
                        startChopping(this, pointer);
                        break;
                    case 'pickaxe':
                        startMining(this, pointer);
                        break;
                    case 'sword':
                        startAttacking(this);
                        break;
                    case 'hand':
                        startPlacing(this, pointer);
                        break;
                    case 'shovel':
                        startDigging(this, pointer);
                        break;
                    case 'wrench':
                        startSetting(this, pointer);
                        break;
                }
            }
            if (pointer.rightButtonDown() && !this.currentOpenedInterface) {
                switch (this.toolbar.primaryItems[this.toolbar.selectedTool].name) {
                    case 'hand':
                    startRemoving(this, pointer);
                    break;
                }
            }
        });

        this.input.keyboard.on('keyup-R', () => {
            rotateItem(this);
        })

        this.input.on('pointermove', (pointer) => {
            // Déplacement de l'objet quand la main est sélectionnée
            updatePositionChecking(this, pointer);
        });

        createEffectScene(this);

        // Fonctions de développement
        dev_functions(this);
    }

    update() {
        updateCharacterAnimation(this);
        updateLight(this);
    
        const camera = this.cameras.main;
        this.particles.emitZone = {
            source : new Phaser.Geom.Rectangle(camera.worldView.x, camera.worldView.y, camera.width, camera.height)
        };
    
        // console.log(this.cameras.main.getWorldPoint(this.input.activePointer.x, this.input.activePointer.y));
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        },
    },
    scene: GameScene,
    banner: false
};

const game = new Phaser.Game(config);

window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});