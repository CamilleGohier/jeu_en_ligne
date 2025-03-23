import Inventory from "../stockage/Inventory.js";
import { walkingQueue, inventoryQueue } from '../tool_file/walking_queue.js';
import { createRandomPathfinding, createDirectPathfinding } from '../easystar/pathfinding.js';
import { trades } from '../data/trades.js'

export default class Npc {
    constructor(scene, name, row, col) {
        this.scene = scene;
        this.name = name;
        this.row = row;
        this.col = col;
        this.y = row * 32;
        this.x = col * 32;
        this.lastMove = 'down';

        this.isInteracting = false;
        this.tradeInProgress = [];

        this.actionQueue = [];
        this.currentAction = false;

        this.tradeInterface = null;
        this.trades = trades[this.name];
        this.playerInventory = new Inventory(this.scene, 480, this.scene.cameras.main.height /2 + 130, this.scene.inventory.tileSize, this.scene.inventory.rows, this.scene.inventory.cols, 0);

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.name + '_idle').setDepth(10).setOrigin(0, 0.5);
        this.sprite.setSize(32, 32).setOffset(0, 32);
        this.currentTween = null;

        this.sprite.anims.play(this.name + '_idle_'+ this.lastMove, true);
        this.start();
    }

    // Déplacements

    start() {
        if (this.currentAction || this.isInteracting) {
            return;
        }

        if (this.actionQueue.length == 0 && !this.currentAction) {
            this.moveTimer = this.scene.time.delayedCall(Phaser.Math.RND.between(1000, 5000), () => this.move(), [], this);
            return;
        }

        const action = this.actionQueue.shift();
        this.currentAction = true;
        this.scene.time.delayedCall(0, () => {
            switch (action.type) {
                case 'crafting':
                    this.goToCraftingTable((success) => {
                        this.currentAction = false;
                        this.start();
                    });
                    break;
                case 'chest':
                    this.goToChest((success) => {
                        this.currentAction = false;
                        this.start();
                    });
                    break;
                default:
                    this.currentAction = false;
                    this.start();
                    break;
            }
        }, [], this);
    };

    addAction(actionType) {
        this.actionQueue.push({ type: actionType });
    };

    move() {
        
        if (this.isInteracting) {
            return;
        }
        createRandomPathfinding(this.scene, this, 5, (path) => {
            if (path) {
                this.followPath(path);
            }
            else {
                this.start();
            }
        });
    }

    stopMovement() {
        this.isInteracting = true;

        if (this.moveTimer) {
            this.moveTimer.remove();
            this.moveTimer = null;
        }

        if (this.currentTween) {
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.currentTween.stop();
            this.currentTween.destroy();
            this.currentTween = null;
        }
        this.sprite.anims.play(this.name + '_idle_' + this.lastMove, true);
    }

    chooseDirection(step) {
        if (!step) {
            this.sprite.anims.play(this.name + '_idle_'+ this.lastMove, true);
            return;
        }

        if (step.x - this.col > 0) {
            this.lastMove = 'right'
            this.sprite.anims.play(this.name + '_walk_right', true);
        }
        else if (step.x - this.col < 0) {
            this.lastMove = 'left'
            this.sprite.anims.play(this.name + '_walk_left', true);
        }
        else if (step.y - this.row > 0) {
            this.lastMove = 'down'
            this.sprite.anims.play(this.name + '_walk_down', true);
        }
        else if (step.y - this.row < 0) {
            this.lastMove = 'up'
            this.sprite.anims.play(this.name + '_walk_up', true);
        }
    }

    followPath(path, index = 0, onComplete = null) {
        if (this.isInteracting) {
            return;
        }

        if (index >= path.length) {
            this.currentAction = false;
            this.chooseDirection(null);
            if (onComplete) {
                onComplete();
            }
            else {
                this.start();
            }
            return;
        }

        const step = path[index];
        const previousPos = { x: this.sprite.x, y: this.sprite.y };
        const target = { x: step.x * 32, y: step.y * 32};
        const delta = { x: target.x - previousPos.x, y: target.y - previousPos.y };

        const duration = (Math.sqrt(delta.x * delta.x + delta.y * delta.y) / 32 * 500);

        this.currentTween = this.scene.tweens.add({
            targets: this.sprite, 
            x: target.x,
            y: target.y,
            duration: duration,
            ease: "Linear",
            onStart : () => {
                this.chooseDirection(step);
            },
            onComplete: () => {

                if (this.isInteracting) {
                    return;
                }

                this.row = step.y;
                this.col = step.x;
                this.followPath(path, index + 1, onComplete);
            },
        });
    }

    goToCraftingTable(callback = () => {}) {
        if (this.scene.desks.length > 0) {
            let validPathfinding = false;

            for (let i = 0; i < this.scene.desks.length; i++) {
                const desk = this.scene.desks[i];
                createDirectPathfinding(this.scene, this, { row: desk.positionNPC.row, col:desk.positionNPC.col }, (path) => {
                    if (path && !validPathfinding) {
                        validPathfinding = true;
                        this.followPath(path, 0, () => {
                            this.addAction('chest');
                            this.lastMove = 'down';
                            this.chooseDirection();
                            this.scene.time.delayedCall(5000, () => callback(true), [], this);
                        });
                    }
                })
                if (validPathfinding) {
                    break;
                }
            }

            setTimeout(() => {
                if (!validPathfinding) {
                    callback(false);
                    this.move();
                }
            }, 50);
        }
        else {
            callback(false);
            this.move();
        }
    }

    goToChest(callback = () => {}) {
        if (this.scene.storages.length > 0) {
            let validPathfinding = false;

            for (let i = 0; i < this.scene.storages.length; i++) {
                const chest = this.scene.storages[i];
                createDirectPathfinding(this.scene, this, { row: chest.positionNPC.row, col:chest.positionNPC.col }, (path) => {
                    if (path && !validPathfinding) {
                        validPathfinding = true;
                        this.followPath(path, 0, () => {
                            this.lastMove = 'up';
                            this.chooseDirection();
                            this.scene.time.delayedCall(1000, () => {
                                this.tradeInProgress.forEach((item) => {
                                    chest.addItem(item.item, item.quantity);
                                })
                                this.tradeInProgress = [];
                                callback(true);
                            }, [], this);
                        })
                    }
                })
                if (validPathfinding) {
                    break;
                }
            }

            setTimeout(() => {
                if (!validPathfinding) {
                    callback(false);
                    this.move();
                }
            }, 50);
        }
        else {
            callback(false);
            this.move();
        }
    }

    openInterface() {
        const distance = 50;

        if (distance > Phaser.Math.Distance.Between(this.scene.character.x, this.scene.character.y, this.sprite.x, this.sprite.y)) {
            this.stopMovement();
            this.showTradeInterface();
        }
    }

    showTradeInterface() {
        if (this.tradeInterface) {
            this.tradeInterface.destroy();
        }

        let desksAvaliable = this.scene.desks.length > 0;

        inventoryQueue(this.scene, 'tradeOpen', 'cannot');
        walkingQueue(this.scene, 'tradeOpen', 'cannot');

        this.tradeInterface = this.scene.add.container(this.scene.cameras.main.width /2, this.scene.cameras.main.height /2).setDepth(20);
        const background = this.scene.add.graphics().setDepth(20).fillStyle(0x909090, 0.8).fillRect(-200, -200, 400, 400).setScrollFactor(0);
        this.tradeInterface.add(background);

        if (!desksAvaliable) {
            const unavaliableText = this.scene.add.text(-180, -180, "Il n'y a pas d'établi \nJe ne peux pas construire", { fontSize: '14px', fill: '#000'}).setDepth(25).setScrollFactor(0);
            this.tradeInterface.add(unavaliableText);
        }

        const closeButton = this.scene.add.text(160, -180, 'X', { fontSize: '20px', fill: '#000'}).setDepth(25).setInteractive().setScrollFactor(0);
        closeButton.on('pointerdown', () => {
            this.closeTradeInterface();
        })
        this.tradeInterface.add(closeButton);
        this.playerInventory.show();

        this.trades.forEach((trade, index) => {
            const needText = trade.need.map((need) => need.quantity + 'x ' + need.french).join(', ');
            const createText = trade.create.quantity + 'x ' + trade.create.french;
            const tradeText = this.scene.add.text(-180, -140 + index * 60, needText + ' =>\n' + createText, { fontSize: '16px', fill: '#900'}).setDepth(25).setScrollFactor(0);

            let tradePossible = desksAvaliable;

            trade.need.forEach(need => {
                let total = 0;

                this.playerInventory.content.flat().forEach(item => {
                    if (item && item.name == need.item) {
                        total += parseInt(item.quantity.text);
                    }
                });

                if (total < need.quantity) {
                    tradePossible = false;
                }
            });

            if (tradePossible) {
                tradeText.setStyle({ fill: '#009' }).setInteractive();
                let tradeProcessed = false;
                tradeText.on('pointerdown', () => {
                    if (!tradeProcessed) {
                        tradeProcessed = true;
                        trade.need.forEach((need, index) => {
                            console.log(trade, need);
                            let remainingQuantity = need.quantity;

                            this.playerInventory.content.flat().forEach(item => {
                                if (item && item.name == need.item && remainingQuantity > 0) {
                                    let itemQuantity = parseInt(item.quantity.text);

                                    if (itemQuantity >= remainingQuantity) {
                                        this.playerInventory.removeItem(item.name, remainingQuantity);
                                        remainingQuantity = 0;
                                    }
                                    else {
                                        this.playerInventory.removeItem(item.name, itemQuantity);
                                        remainingQuantity -= itemQuantity;
                                    }
                                }
                            })
                        })
                        this.tradeInProgress.push({item: trade.create.item, quantity: trade.create.quantity});
                        this.showTradeInterface();
                    }
                })
            }
            this.tradeInterface.add(tradeText);
        })
    }

    closeTradeInterface() {
        if (this.tradeInterface) {
            this.tradeInterface.destroy();
            this.tradeInterface = null;

            if (this.tradeInProgress.length > 0) {
                this.addAction('crafting');
                
            }
            this.isInteracting = false;
            this.start();

            this.playerInventory.hide();
            inventoryQueue(this.scene, 'tradeOpen', 'can');
            walkingQueue(this.scene, 'tradeOpen', 'can');
        }
    }
}