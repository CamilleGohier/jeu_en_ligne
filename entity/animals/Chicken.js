import { createRandomPathfinding, createDirectPathfinding } from '../../easystar/pathfinding.js';
import { dropLoot } from '../../toolFile/drop.js';
import { createLoadingBar } from '../../toolFile/loadingBar.js';
import { walkingQueue } from '../../toolFile/walkingQueue.js';
import { schedule } from '../../data/schedule.js';
import { calculateDepth } from '../../calculateDepth.js';

export default class Chicken {
    constructor(scene, row, col) {
        this.scene = scene;
        this.row = row;
        this.col = col;

        this.sprite = this.scene.add.sprite(col*32, row*32, 'chicken').setOrigin(0.25, 0.25).setInteractive();
        this.sprite.setPipeline('Light2D');
        this.sprite.play('chicken_idle');

        this.eggCooldown = null;

        this.isInteracting = false;
        this.currentAction = false;
        this.lastMove = 'left';

        this.start();
    }

    start() {
        if (this.currentAction || this.isInteracting) {
            return;
        }

        for (const task of schedule.chicken) {
            if (this.checkCondition(task.type)) {
                this.currentAction = true;
                
                this[task.action](() => {
                    this.currentAction = false;
                    this.start();
                });
                return;
            }
        }
    }

    checkCondition(condition) {
        switch (condition) {
            case 'feeder':
                return (this.eggCooldown == null && this.scene.feeders.length > 0 && this.scene.feeders.some(feeder => feeder.quantity > 0) && (Phaser.Math.Between(0, 9) == 0));
            case 'nest':
                return (this.eggCooldown && (this.eggCooldown + 5000 < this.scene.time.now) && this.scene.nests.length > 0 && this.scene.nests.some(nest => !nest.egg) && (Phaser.Math.Between(0, 9) == 0));
            case 'randomMovement':
                return true;
        }
    }

    goToFeeder(callback) {
        let validPathfinding = false;

        this.scene.feeders.some((feeder) => {
            if (feeder.quantity > 0) {
                createDirectPathfinding(this.scene, this, { row: feeder.row + feeder.positionNPC.row, col: feeder.col + feeder.positionNPC.col }, (path) => {
                    if (path && !validPathfinding) {
                        validPathfinding = true;
                        this.followPath(path, 0, () => {
                            feeder.empty(1);
    
                            setTimeout(() => {
                                this.eggCooldown = this.scene.time.now;
                                callback();
                            }, 2000);
                        }, [], this);
                    }
                })
            }
        })
    }

    goToNest(callback) {
        let validPathfinding = false;

        this.scene.nests.some((nest) => {
            if (!nest.egg) {
                createDirectPathfinding(this.scene, this, { row: nest.row, col: nest.col}, (path) => {
                    if (path && !validPathfinding) {
                        validPathfinding = true;
                        this.followPath(path, 0, () => {
    
                            setTimeout(() => {
                                this.eggCooldown = null;
                                nest.fill(1);
                                callback();
                            }, 2000);
                        }, [], this);
                    }
                })
            }
        })
    }

    move(callback) {
        if (this.isInteracting) {
            return;
        }

        createRandomPathfinding(this.scene, this, 2, (path) => {
            if (path) {
                this.followPath(path);
            }
            else {
                this.start();
            }
        });
        setTimeout(() => {
            callback();
        }, Phaser.Math.Between(3000, 5000));
    }

    followPath(path, index = 0, onComplete = null) {
        if (this.isInteracting) {
            return;
        }

        if (index >= path.length) {
            this.chooseAnimation(null);
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
                this.chooseAnimation(step);
            },
            onUpdate: () => {
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

    stopMovement() {
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
        this.chooseAnimation(null);
    }

    chooseAnimation(step) {
        if (step) {
            if (step.x - this.col > 0) {
                this.lastMove = 'right';
            }
            else if (step.x - this.col < 0) {
                this.lastMove = 'left';
            }
            this.sprite.anims.play('chicken_walk', true);
        }
        else {
            this.sprite.anims.play('chicken_idle', true);
        }

        if (this.lastMove == 'left') {
            this.sprite.flipX = false;
        }
        else if (this.lastMove == 'right') {
            this.sprite.flipX = true;
        }
    }
}