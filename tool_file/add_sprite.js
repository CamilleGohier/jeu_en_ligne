import { dictionary } from '../data/items.js';

export default class Item {
    static init(s) {
        Item.scene = s;
    }

    constructor(col, row, name) {
        this.name = name;
        this.scene = Item.scene;
        this.row = row;
        this.col = col;

        // if (dictionary[this.name].group) {
        //     if (!this.scene[dictionary[this.name].group]) {
        //         this.scene[dictionary[this.name].group] = this.scene.physics.add.staticGroup();
        //     }
        //     this.sprite = this.scene[dictionary[this.name].group].create(x, y, this.name);
        // }
        // else {
        this.sprite = this.scene.physics.add.staticSprite(this.col *32, this.row *32, this.name);
        // }

        if (this.name == 'empty') {
            return;
        }

        this.sprite.setOrigin(0);
        this.sprite.setPipeline('Light2D');

        if (dictionary[this.name].type) {
            this.type = dictionary[this.name].type;
            this.setTypes(dictionary[this.name].type);
        }

        if (dictionary[this.name].depth) {
            this.sprite.setDepth(dictionary[this.name].depth);
        }

        if (dictionary[this.name].size) {
            this.sprite.setSize(dictionary[this.name].size.x, dictionary[this.name].size.y);
        }

        if (dictionary[this.name].offset) {
            this.sprite.setOffset(dictionary[this.name].offset.x, dictionary[this.name].offset.y);
        }
    }

    setTypes(type) {
        if (type.includes('floor')) {
            this.sprite.setFrame(Phaser.Math.Between(1, 2)); // Faudrait que ce soit entre 1 et le max (0 étant l'icone)
            this.scene.worldGrid[this.row][this.col].floor = this;
        }
        else {
            this.scene.physics.add.collider(this.scene.character, this.sprite);
            this.scene.worldGrid[this.row][this.col].object = this;
        }

        if (type.includes('rotateable')) {
            this.currentFrame = this.currentFrame ? this.currentFrame : 0;

            this.sprite.on('pointerdown', () => {
                const frameOffset = Math.floor(this.currentFrame / 2) * 2;
                this.currentFrame = (this.currentFrame == frameOffset) ? frameOffset + 1 : frameOffset;
                this.sprite.setFrame(this.currentFrame);
                this.sprite.body.checkCollision.none = !this.sprite.body.checkCollision.none;
            })
        }

        if (type.includes('connectable')) {
            const index = this.checkDirectionSprite();
            this.sprite.setFrame(index);
        }

        if (type.includes('interactive')) {
            let circle = this.scene.add.circle(this.col * 32 + 8, (this.row -1) * 32 + 8, 8, 0x905090).setDepth(dictionary[this.name].depth - 5).setOrigin(0);
            this.positionNPC = {row: this.row -1, col: this.col, circle: circle};
        }
    }

    checkDirectionSprite() {
        let index = 1; // (0 étant l'icone)
        const position = { x: this.col, y: this.row };
        // Système plus complexe abandonné pour l'instant
        // if (scene.worldGrid[position.y][position.x -1] && scene.worldGrid[position.y][position.x -1].object && scene.worldGrid[position.y][position.x -1].object.name == name) {
        //     scene.worldGrid[position.y][position.x -1].object.currentFrame += 2;
        //     scene.worldGrid[position.y][position.x -1].object.setFrame(scene.worldGrid[position.y][position.x -1].object.currentFrame);
        //     index += 1;
        // }
        // if (scene.worldGrid[position.y][position.x +1] && scene.worldGrid[position.y][position.x +1].object && scene.worldGrid[position.y][position.x +1].object.name == name) {
        //     scene.worldGrid[position.y][position.x +1].object.currentFrame += 1;
        //     scene.worldGrid[position.y][position.x +1].object.setFrame(scene.worldGrid[position.y][position.x +1].object.currentFrame);
        //     index += 2;
        // }
        // if (scene.worldGrid[position.y -1] && scene.worldGrid[position.y -1][position.x].object && scene.worldGrid[position.y -1][position.x].object.name == name) {
        //     scene.worldGrid[position.y -1][position.x].object.currentFrame += 8;
        //     scene.worldGrid[position.y -1][position.x].object.setFrame(scene.worldGrid[position.y -1][position.x].object.currentFrame);
        //     index += 4;
        // }
        // if (scene.worldGrid[position.y +1] && scene.worldGrid[position.y +1][position.x].object && scene.worldGrid[position.y +1][position.x].object.name == name) {
        //     scene.worldGrid[position.y +1][position.x].object.currentFrame += 4;
        //     scene.worldGrid[position.y +1][position.x].object.setFrame(scene.worldGrid[position.y +1][position.x].object.currentFrame);
        //     index += 8;
        // }
    
        if (this.scene.worldGrid[position.y -1] && this.scene.worldGrid[position.y -1][position.x].object && this.scene.worldGrid[position.y -1][position.x].object.name == this.name) {
            this.scene.worldGrid[position.y -1][position.x].object.currentFrame = 1;
            this.scene.worldGrid[position.y -1][position.x].object.sprite.setFrame(2);
            index = 1;
        }
    
        if (this.scene.worldGrid[position.y +1] && this.scene.worldGrid[position.y +1][position.x].object && this.scene.worldGrid[position.y +1][position.x].object.name == this.name) {
            index = 2;
        }
    
        return index;
    }
}