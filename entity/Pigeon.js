const height = 100;
const choices = [0, 1, 2];

export default class Pigeon {
    constructor(scene, row, col) {
        this.scene = scene;
        this.row = row;
        this.col = col;

        this.choice = choices[Phaser.Math.Between(0, choices.length -1)];

        this.flipX = (this.scene.worldGrid[0].length/2 > this.col);

        this.sprite = this.scene.add.sprite(this.flipX ? -100 : this.scene.worldGrid[0].length*32 + 100, Phaser.Math.Between(-height, height) + row *32 +8 - 50, 'pigeon' + this.choice).setOrigin().setDepth(15);
        this.sprite.flipX = this.flipX;
        this.sprite.setPipeline('Light2D');


        this.sprite.play('pigeon_flying' + this.choice);

        // this.scene.time.delayedCall(5000, () => {
            this.horizontalMovement();
        // })
    }

    horizontalMovement() {
        this.tween = this.scene.tweens.add({
            targets: this.sprite,
            x: this.col * 32 + (this.flipX ? -2*32 : 2*32) +8,
            y: this.row *32 +8 -50,
            ease: 'Sine.easeInOut',
            duration: 2000,
            onComplete: () => {
                this.goingDown();
            }
        })
    }

    goingDown() {
        this.tween = this.scene.tweens.add({
            targets: this.sprite,
            x: this.col * 32 +8,
            y: this.row *32 +8,
            ease: 'Sine.easeInOut',
            duration: 1000,
            onComplete: () => {
                this.delayedStandingWink();
                this.sprite.play('pigeon_idle_standing' + this.choice);

                this.circle = this.scene.add.circle(this.sprite.x, this.sprite.y, 120);
                this.scene.physics.add.existing(this.circle);
                this.collision = this.scene.physics.add.overlap(this.circle, this.scene.character, () => {
                    this.collision.active = false;
                    this.goingAway();
                })
            }
        })
    }

    delayedStandingWink() {
        this.action = this.scene.time.delayedCall(Phaser.Math.Between(5000, 10000), () => {
            this.sprite.play('pigeon_idle_standing' + this.choice);

            if (Phaser.Math.Between(0, 3) == 0) {
                this.sitting();
            }
            else {
                this.delayedStandingWink();
            }
        })
    }

    sitting() {
        this.action = this.scene.time.delayedCall(Phaser.Math.Between(5000, 10000), () => {
            this.sprite.play('pigeon_sitting' + this.choice);
            this.delayedSittingWink();
        })
    }

    delayedSittingWink() {
        this.action = this.scene.time.delayedCall(Phaser.Math.Between(10000, 15000), () => {
            this.sprite.play('pigeon_idle_sitting' + this.choice);
            this.delayedSittingWink();
        })
    }

    goingAway() {
        let flip = this.sprite.x < this.scene.character.x;
        
        if (!flip && !this.flipX || flip && this.flipX) {
            this.sprite.flipX = !this.sprite.flipX;
        }

        this.action.remove();

        this.sprite.play('pigeon_flying' + this.choice);
        this.tween = this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + (flip ? -1500 : 1500),
            y: this.sprite.y - height,
            ease: 'Sine.easeInOut',
            duration: 5000,
            onComplete: () => {
                this.scene.pigeons = this.scene.pigeons.filter(e => e !== this);
                this.sprite.destroy();
                this.circle.destroy();
                this.scene.worldGrid[this.row][this.col].object = null;
            }
        })
    }
}