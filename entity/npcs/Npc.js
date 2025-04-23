import Inventory from '../../stockage/Inventory.js';
import { walkingQueue, inventoryQueue } from '../../toolFile/walkingQueue.js';
import { createRandomPathfinding, createDirectPathfinding } from '../../easystar/pathfinding.js';
import { trades } from '../../data/trades.js';
import { dictionary } from '../../data/dictionary.js';
import { calculateDepth } from '../../calculateDepth.js';

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
        this.sprite.setPipeline('Light2D');
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
            onUpdate : () => {
                this.sprite.setDepth(calculateDepth(this.scene, this.sprite.y));
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
        if (this.scene.workbenchs.length > 0) {
            let validPathfinding = false;

            for (let i = 0; i < this.scene.workbenchs.length; i++) {
                const workbench = this.scene.workbenchs[i];
                createDirectPathfinding(this.scene, this, { row: workbench.row + workbench.positionNPC.row, col: workbench.col + workbench.positionNPC.col }, (path) => {
                    if (path && !validPathfinding) {
                        validPathfinding = true;
                        this.followPath(path, 0, () => {
                            this.addAction('chest');
                            this.chooseDirection({ x: workbench.col, y: workbench.row });
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
                }
            }, 50);
        }
        else {
            callback(false);
        }
    }

    goToChest(callback = () => {}) {
        if (this.scene.storages.length > 0) {
            let validPathfinding = false;

            for (let i = 0; i < this.scene.storages.length; i++) {
                const chest = this.scene.storages[i];
                createDirectPathfinding(this.scene, this, { row: chest.row + chest.positionNPC.row, col: chest.col + chest.positionNPC.col }, (path) => {
                    if (path && !validPathfinding) {
                        validPathfinding = true;
                        this.followPath(path, 0, () => {
                            this.chooseDirection({ x: chest.col, y: chest.row});
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
                }
            }, 50);
        }
        else {
            callback(false);
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
            this.rectangle.destroy();

            this.scene.input.off('wheel', this.handleWheelEvent, this);
            this.tradeMask.destroy();
        }

        let workbenchsAvaliable = this.scene.workbenchs.length > 0;
        let storagesAvaliable = this.scene.storages.length > 0;

        inventoryQueue(this.scene, 'tradeOpen', 'cannot');
        walkingQueue(this.scene, 'tradeOpen', 'cannot');

        this.tradeInterface = this.scene.add.container(this.scene.cameras.main.width /2, this.scene.cameras.main.height /2).setDepth(20);
        const background = this.scene.add.graphics().setDepth(20).fillStyle(0x909090, 0.8).fillRect(-200, -200, 400, 400).setScrollFactor(0);
        this.tradeInterface.add(background);
        
        if (this.name == 'blacksmith') {
            const arrow_down = this.scene.add.sprite(170, -10, 'arrow').setScrollFactor(0).setDepth(15);
            this.tradeInterface.add(arrow_down);
            const dot = this.scene.add.sprite(170, -25, 'dot').setScrollFactor(0).setDepth(15);
            this.tradeInterface.add(dot);
            const arrow_up = this.scene.add.sprite(170, -40, 'arrow_up').setScrollFactor(0).setDepth(15);
            this.tradeInterface.add(arrow_up);
        }

        if (!workbenchsAvaliable || !storagesAvaliable) {
            const unavaliableText = this.scene.add.text(-180, -180, 
                "Je ne peux pas construire\nIl n'y a pas "
                + (storagesAvaliable && !workbenchsAvaliable ? "d'atelier disponible" : '')
                + (!storagesAvaliable && workbenchsAvaliable ? "de coffre disponible" : '')
                + (!storagesAvaliable && !workbenchsAvaliable ? "d'atelier et de coffre\ndisponible" : ''),
                { fontSize: '14px', fill: '#000'}).setDepth(25).setScrollFactor(0);
            this.tradeInterface.add(unavaliableText);
        }

        const closeButton = this.scene.add.text(160, -180, 'X', { fontSize: '20px', fill: '#000'}).setDepth(25).setInteractive().setScrollFactor(0);
        closeButton.on('pointerdown', () => {
            this.closeTradeInterface();
        })
        this.tradeInterface.add(closeButton);
        this.playerInventory.show();

        let tint = '0xBBAAAA'
        let alpha = 0.7

        this.tradeMask = this.scene.add.container(this.scene.cameras.main.width /2, this.scene.cameras.main.height /2).setDepth(20);
        this.rectangle = this.scene.add.graphics().fillStyle(0x000000, 0.8).fillRect(this.scene.cameras.main.width /2 -170, this.scene.cameras.main.height /2 -130, 320, 235).setDepth(15).setScrollFactor(0);
        const mask = this.rectangle.createGeometryMask();
        this.tradeMask.setMask(mask);

        this.trades.forEach((trade, indexTrade) => {
            const tradeBackground = this.scene.add.sprite(-160, -130 + indexTrade * 50, 'line').setAlpha(alpha).setTint(tint).setScrollFactor(0).setOrigin(0);
            this.tradeInterface.add(tradeBackground);
            this.tradeMask.add(tradeBackground);
            tradeBackground.content = [];

            trade.need.forEach((item, indexItem) => {
                let tile = this.scene.add.sprite(-48 - indexItem * 52, -126 + indexTrade * 50, 'tile_trade').setAlpha(alpha).setTint(tint).setScrollFactor(0).setScale(1.2).setOrigin(0);
                this.tradeInterface.add(tile);
                tradeBackground.content.push(tile);
                let text = this.scene.add.text(-44 - indexItem * 52, -114 + indexTrade * 50, item.quantity, { fontSize: '16px', fill: '#000'}).setScrollFactor(0);
                this.tradeInterface.add(text);
                let sprite = this.scene.add.sprite(-32 - indexItem * 52, -122 + indexTrade * 50, item.item).setScrollFactor(0).setOrigin(0);
                this.tradeInterface.add(sprite);
                tradeBackground.content.push(sprite);
                
                this.tradeMask.add(tile);
                this.tradeMask.add(text);
                this.tradeMask.add(sprite);

                if (dictionary[item.item] && dictionary[item.item].origin) {
                    sprite.setOrigin(dictionary[item.item].origin[0] +0.5, dictionary[item.item].origin[1] +0.25);
                }
            })

            let arrow = this.scene.add.sprite(0, -122 + indexTrade * 50, 'arrow_right').setAlpha(alpha).setTint(0xFFCACA).setScrollFactor(0).setOrigin(0);
            this.tradeInterface.add(arrow);
            tradeBackground.content.push(arrow);

            let tile = this.scene.add.sprite(36, -126 + indexTrade * 50, 'tile_trade').setAlpha(alpha).setTint(tint).setScrollFactor(0).setScale(1.2).setOrigin(0);
            this.tradeInterface.add(tile);
            tradeBackground.content.push(tile);
            let text = this.scene.add.text(40, -114 + indexTrade * 50, trade.create.quantity, { fontSize: '16px', fill: '#000'}).setScrollFactor(0);
            this.tradeInterface.add(text);
            let sprite = this.scene.add.sprite(52, -122 + indexTrade * 50, trade.create.item).setScrollFactor(0).setOrigin(0);
            this.tradeInterface.add(sprite);
            tradeBackground.content.push(sprite);

            this.tradeMask.add(tile);
            this.tradeMask.add(arrow);
            this.tradeMask.add(text);
            this.tradeMask.add(sprite);

            this.scene.input.on('wheel', this.handleWheelEvent, this);

            if (dictionary[trade.create.item] && dictionary[trade.create.item].origin) {
                sprite.setOrigin(dictionary[trade.create.item].origin[0], dictionary[trade.create.item].origin[1]);
            }
            
            let tradePossible = (workbenchsAvaliable && storagesAvaliable);

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
                tradeBackground.setAlpha(1).setTint(0xFFFFFF);
                let tradeProcessed = false;

                tradeBackground.content.forEach(icon => {
                    icon.setTint(0xFFFFFF);
                    icon.setAlpha(1);
                });

                tradeBackground.setInteractive();
                tradeBackground.on('pointerdown', () => {
                    if (!tradeProcessed) {
                        tradeProcessed = true;
                        trade.need.forEach((need) => {
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
        })
        this.scene.currentOpenedInterface = this.tradeInterface;
    }

    closeTradeInterface() {
        if (this.tradeInterface) {
            this.tradeInterface.destroy();
            this.tradeInterface = null;

            this.rectangle.destroy();
            this.rectangle = null;

            if (this.tradeInProgress.length > 0) {
                this.addAction('crafting');
                
            }
            this.isInteracting = false;
            this.start();

            this.playerInventory.hide();
            inventoryQueue(this.scene, 'tradeOpen', 'can');
            walkingQueue(this.scene, 'tradeOpen', 'can');

            this.scene.input.off('wheel', this.handleWheelEvent, this);
        }
        if (this.tradeMask) {
            this.tradeMask.destroy();
            this.tradeMask = null;
        }
        this.scene.currentOpenedInterface = null;
    }

    handleWheelEvent(pointer, gameObject, deltaX, deltaY, deltaZ) {
        if (this.name == 'blacksmith') {
            if (deltaY > 0) {
                this.tradeMask.y -= 2;
            }
            else {
                this.tradeMask.y += 2;
            }
        
            this.tradeMask.y = Phaser.Math.Clamp(this.tradeMask.y, 24 * this.trades.length, 360);
        }
    }
}