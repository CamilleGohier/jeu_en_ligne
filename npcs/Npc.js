import Inventory from "../stockage/Inventory.js";
import { walkingQueue, inventoryQueue } from '../tool_file/walking_queue.js';

export default class Npc {
    constructor(scene, name, x, y) {
        this.scene = scene;
        this.name = name;
        this.speed = 50;
        this.x = x;
        this.y = y;
        this.lastMove = 'down';
        this.isInteracting = false;

        this.tradeInterface = null;
        this.trades = this.generateTrades();
        this.playerInventory = new Inventory(this.scene, 500, this.scene.game.config.height /2 + 130, this.scene.inventory.tileSize, this.scene.inventory.rows, this.scene.inventory.cols, 0);

        this.sprite = this.scene.physics.add.sprite(x, y, 'npc_idle');
        this.currentTween = null;

        this.move();
    }

    move() {
        if (this.isInteracting) {
            return;
        }
        const directions = [
            { x: 32, y: 0 },
            { x: -32, y: 0 },
            { x: 0, y: 32 },
            { x: 0, y: -32 }
        ];
        const directionNames = [
            'right',
            'left',
            'down',
            'up'
        ]

        let target = {x: -1, y: -1};
        let choice = -1;

        while (target.x >= this.scene.game.config.width || target.x < 0 || target.y >= this.scene.game.config.height || target.y < 0) {
            choice = Phaser.Math.RND.between(0, 3);
            const dir = directions[choice];
            const dist = Phaser.Math.RND.between(0, 5);
            target = {
                x: this.x + dir.x * dist,
                y: this.y + dir.y * dist
            };
        }

        this.lastMove = directionNames[choice];

        if (target.x > this.x) {
            this.sprite.anims.play('npc_walk_right', true);
        }
        else if (target.x < this.x) {
            this.sprite.anims.play('npc_walk_left', true);
        }
        else if (target.y > this.y) {
            this.sprite.anims.play('npc_walk_down', true);
        }
        else if (target.y < this.y) {
            this.sprite.anims.play('npc_walk_up', true);
        }
        else {
            this.sprite.anims.play('npc_idle_' + this.lastMove, true);
        }

        this.currentTween = this.scene.tweens.add({
            targets: this.sprite,
            x: target.x,
            y: target.y,
            duration: Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) / this.speed * 1000,
            onComplete: () => {
                this.x = target.x;
                this.y = target.y;
                this.sprite.anims.play('npc_idle_' + this.lastMove, true);
                this.scene.time.delayedCall(Phaser.Math.RND.between(1000, 5000), this.move, [], this);
            }
        })
    }

    generateTrades() {
        return [
            [
                { item: 'wood', quantity: 1, french: 'bûche'},
                { item: 'stick', quantity: 4, french: 'bâton' }
            ],
            [
                { item: 'tomato', quantity: 1, french: 'tomate' },
                { item: 'tomato_seed', quantity: 1, french: 'graine de tomate' }
            ],
            [
                { item: 'wheat', quantity: 2, french: 'blé' },
                { item: 'wheat_seed', quantity: 1, french: 'graine de blé' }
            ]
        ]
    }

    openInterface(scene) {
        const distance = 50;

        if (distance > Phaser.Math.Distance.Between(scene.character.x, scene.character.y, this.sprite.x, this.sprite.y)) {
            this.showTradeInterface();
            this.stopMovement();
        }
    }

    showTradeInterface() {
        if (this.tradeInterface) {
            this.tradeInterface.destroy();
        }

        inventoryQueue(this.scene, 'tradeOpen', 'cannot');
        walkingQueue(this.scene, 'tradeOpen', 'cannot');

        this.tradeInterface = this.scene.add.container(this.scene.game.config.width /2, this.scene.game.config.height /2).setDepth(1);
        const background = this.scene.add.graphics().fillStyle(0x909090, 0.8).fillRect(-200, -200, 400, 400).setScrollFactor(0);
        this.tradeInterface.add(background);

        const closeButton = this.scene.add.text(160, -180, 'X', { fontSize: '20px', fill: '#000'}).setInteractive().setScrollFactor(0);
        closeButton.on('pointerdown', () => {
            this.closeTradeInterface();
        })
        this.tradeInterface.add(closeButton);
        this.playerInventory.show();

        this.trades.forEach((trade, index) => {
            const tradeText = this.scene.add.text(-180, -140 + index * 40, trade.map(trade => `${trade.quantity} x ${trade.french}`).join(' => '), { fontSize: '16px', fill: '#900'}).setScrollFactor(0);

            let tradeProcessed = false;
            this.playerInventory.content.forEach(row => {
                row.forEach(item => {
                    if (item && item.name == trade[0].item && item.quantity.text >= trade[0].quantity) {
                        let totalQuantity = trade[0].quantity;
                        tradeText.setInteractive();
                        tradeText.setStyle({ fill: '#009'});
                        tradeText.on('pointerdown', () => {
                            if (!tradeProcessed) {
                                tradeProcessed = true;
                                if (totalQuantity > 0) {
                                    this.playerInventory.removeItem(trade[0].item, trade[0].quantity);
                                    this.playerInventory.addItem(trade[1].item, trade[1].quantity);
                                }
                                totalQuantity -= trade[0].quantity;
                                this.showTradeInterface();
                                }
                            }
                        )
                    }
                })
            })
            this.tradeInterface.add(tradeText);
        })
    }

    closeTradeInterface() {
        if (this.tradeInterface) {
            this.tradeInterface.destroy();
            this.tradeInterface = null;

            this.resumeMovement();
            this.playerInventory.hide();
            inventoryQueue(this.scene, 'tradeOpen', 'can');
            walkingQueue(this.scene, 'tradeOpen', 'can');
        }
    }

    stopMovement() {
        this.isInteracting = true;
        if (this.currentTween) {
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.currentTween.stop();
        }
        this.sprite.anims.play('npc_idle_down', true);
    }

    resumeMovement() {
        this.isInteracting = false;
        this.move();
    }
}