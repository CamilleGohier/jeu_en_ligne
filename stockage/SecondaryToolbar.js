import { updateItemToDrag } from "../action/placing.js";
import { dictionary } from "../data/dictionary.js";
import { tools } from "../data/variables.js";

export default class SecondaryToolbar {
    constructor(scene, name, indexTool, indexOrder) {
        this.scene = scene;
        this.indexOrder = indexOrder * 40;
        this.startX = this.scene.cameras.main.width /2 + 35;
        this.tileSize = 24;
        this.indexTool = indexTool;
        this.valid = true;

        this.tile = this.scene.add.sprite(78, -150 + this.indexOrder, 'tile').setDepth(25).setScale(1.1).setOrigin(0);
        this.toolIcon = this.scene.add.sprite(80, -149 + this.indexOrder, name).setDepth(25).setOrigin(0);
        this.arrow = this.scene.add.sprite(89, -118 + this.indexOrder, 'arrow').setDepth(25).setScale(0.75).setOrigin(0);
        this.area = this.scene.add.rectangle(35, -106 + this.indexOrder, 120, 24).setOrigin(0);

        this.fixedInterface = this.scene.add.container(this.scene.cameras.main.width/2, this.scene.cameras.main.height/2 + this.indexOrder).setDepth(25).setScrollFactor(0);
        this.fixedInterface.add(this.tile);
        this.fixedInterface.add(this.toolIcon);
        this.fixedInterface.add(this.arrow);
        this.fixedInterface.add(this.area);

        let positions = [];

        this.selectedSecondary = ((scene.toolbar.primaryItems[indexTool].secondarySelected -2 +5) % 5);

        for (let posBefore = 0; posBefore < 5; posBefore++) {
            let posAfter = (this.selectedSecondary + posBefore) % 5;
            positions[posBefore] = posAfter;
        }

        this.content = {
            tiles: [],
            sprites: []
        };

        positions.forEach((pos, col) => {
            const tile = this.scene.add.sprite(35 + col * this.tileSize, -106 + this.indexOrder, 'tile').setDepth(25).setScale(0.75).setOrigin(0);
            const sprite = this.scene.add.sprite(35 + col * this.tileSize, -106 + this.indexOrder, (tools[this.indexTool].secondary[pos].key != null ? tools[this.indexTool].secondary[pos].key : 'empty')).setDepth(25).setScale(0.75).setOrigin(0).setInteractive();
            sprite.name = (tools[this.indexTool].secondary[pos].key != null ? tools[this.indexTool].secondary[pos].key : 'empty');
            sprite.on('pointerdown', (pointer) => {
                if (pointer.rightButtonDown()) {
                    this.removeSprite(col, sprite);
                }
            })

            this.content.tiles[col] = tile;
            this.content.sprites[col] = sprite;

            this.fixedInterface.add(tile);
            this.fixedInterface.add(sprite);

            if (dictionary[tools[this.indexTool].secondary[pos].key] && dictionary[tools[this.indexTool].secondary[pos].key].origin) {
                this.content.sprites[col].setOrigin(dictionary[tools[this.indexTool].secondary[pos].key].origin[0], dictionary[tools[this.indexTool].secondary[pos].key].origin[1]);
            }
            else {
                this.content.sprites[col].setOrigin(0);
            }
        })
    }

    addItem(col, name) {
        if (this.valid) {
            if (this.content.sprites[col].name != 'empty') {
                this.content.sprites[col].setTexture(name);
            }
            else {
                let sprite = this.scene.add.sprite(35 + this.tileSize*col, -106 + this.indexOrder, name).setDepth(25).setScale(0.75).setOrigin(0).setInteractive();
                sprite.on('pointerdown', (pointer) => {
                    if (pointer.rightButtonDown()) {
                        this.removeSprite(col, sprite);
                    }
                })
                this.fixedInterface.add(sprite);
                this.content.sprites[col] = sprite;
                this.content.sprites[col].name = name;
            }

            if (dictionary[name] && dictionary[name].origin) {
                this.content.sprites[col].setOrigin(dictionary[name].origin[0], dictionary[name].origin[1]);
            }
            else {
                this.content.sprites[col].setOrigin(0);
            }

            tools[this.indexTool].secondary[(col + this.selectedSecondary) % 5].key = name;

            if (col == 2) {
                let toolbar = this.scene.toolbar;

                if (toolbar.primaryItems[this.indexTool].secondarySprite) {
                    toolbar.primaryItems[this.indexTool].secondarySprite.setTexture(name);
                }
                else {
                    toolbar.primaryItems[this.indexTool].secondarySprite = this.scene.add.sprite(toolbar.primaryItems[this.indexTool].x + 9, toolbar.primaryItems[this.indexTool].y + 9, 'name').setDepth(25).setInteractive().setScale(0.5).setScrollFactor(0);
                }

                updateItemToDrag(this.scene, {x: this.scene.input.activePointer.x, y: this.scene.input.activePointer.y})

                if (dictionary[name] && dictionary[name].origin) {
                    toolbar.primaryItems[this.indexTool].secondarySprite.setOrigin(dictionary[name].origin[0] +0.5, dictionary[name].origin[1] + 0.25);
                }
                else {
                    toolbar.primaryItems[this.indexTool].secondarySprite.setOrigin(0.5);
                }
            }
        }
    }

    destroyToolbar() {
        this.area.destroy();
        this.arrow.destroy();
        this.toolIcon.destroy();
        this.tile.destroy();

        this.content.sprites.forEach(sprite => {
            sprite.destroy();
        })

        this.content.tiles.forEach(tile => {
            tile.destroy();
        })
    }

    setTint() {
        let tint = '0xBBAAAA';

        this.content.tiles.forEach(tile => {
            tile.setAlpha(0.5);
            tile.setTint(tint);
        });

        this.content.sprites.forEach(sprite => {
            sprite.setAlpha(0.7);
            sprite.setTint(tint);
        });

        this.arrow.setAlpha(0.7);
        this.toolIcon.setAlpha(0.7);
        this.tile.setAlpha(0.5);

        this.arrow.setTint(tint);
        this.toolIcon.setTint(tint);
        this.tile.setTint(tint);

        this.valid = false;
    }

    removeTint() {
        let tint = '0xFFFFFF';

        this.content.tiles.forEach(tile => {
            tile.setAlpha(1);
            tile.setTint(tint);
        });

        this.content.sprites.forEach(sprite => {
            sprite.setAlpha(1);
            sprite.setTint(tint);
        });

        this.arrow.setAlpha(1);
        this.toolIcon.setAlpha(1);
        this.tile.setAlpha(1);

        this.arrow.setTint(tint);
        this.toolIcon.setTint(tint);
        this.tile.setTint(tint);

        this.valid = true;
    }

    removeSprite(col, sprite) {
        this.content.sprites[col].name = 'empty';
        sprite.destroy();
        tools[this.indexTool].secondary[(col + this.selectedSecondary) % 5].key = 'empty'
    }
}