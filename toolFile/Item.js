import { dictionary } from '../data/dictionary.js';

export default class Item {
    static init(s) {
        Item.scene = s;
    }

    constructor(row, col, name, positionNPC = null, collidable = true) {
        this.name = name;
        this.scene = Item.scene;
        this.row = row;
        this.col = col;
        this.collidable = collidable;

        this.sprite = this.scene.physics.add.staticSprite(this.col *32, this.row *32, this.name);
        this.sprite.setPipeline('Light2D');

        if (dictionary[this.name]) {
            if (dictionary[this.name].type) {
                this.type = dictionary[this.name].type;
                this.setTypes(dictionary[this.name].type, this.name);
            }

            if (dictionary[this.name].depth) {
                this.sprite.setDepth(dictionary[this.name].depth);
            }

            if (dictionary[this.name].origin) {
                this.sprite.setOrigin(dictionary[this.name].origin[0], dictionary[this.name].origin[1]);
            }
            else {
                this.sprite.setOrigin(0);
            }

            if (dictionary[this.name].size) {
                this.sprite.setSize(dictionary[this.name].size.x, dictionary[this.name].size.y);
            }

            if (dictionary[this.name].offset) {
                this.sprite.setOffset(dictionary[this.name].offset.x, dictionary[this.name].offset.y);
            }
            
            if (dictionary[this.name].positionNPC) {
                let circle = this.scene.add.circle((this.col + dictionary[this.name].positionNPC.col) * 32 + 8, (this.row + dictionary[this.name].positionNPC.row) * 32 + 8, 8, 0x905090).setDepth(dictionary[this.name].depth).setOrigin(0);
                this.positionNPC = {row: (positionNPC ? positionNPC.row : dictionary[this.name].positionNPC.row), col: (positionNPC ? positionNPC.col : dictionary[this.name].positionNPC.col), circle: circle, name: 'positionNPC'};
                circle.setPosition((this.col + this.positionNPC.col) *32 +8, (this.row + this.positionNPC.row) *32 +8);
            }
        }
    }

    setTypes(type) {
        if (this.collidable) {
            if (type.includes('floor')) {
                this.sprite.setFrame(Phaser.Math.Between(1, 2)); // Faudrait que ce soit entre 1 et le max (0 étant l'icone)
                this.scene.worldGrid[this.row][this.col].floor = this;
            }
            else {
            
                this.scene.physics.add.collider(this.scene.character, this.sprite);
                this.scene.worldGrid[this.row][this.col].object = this;
            }
        }

        if (type.includes('rotateable')) {
            this.currentFrame = this.currentFrame ? this.currentFrame : 0;
            this.clicked = false;

            this.sprite.on('pointerdown', (pointer) => {
                // Gérer le milieu du sprite pour le calcul de la distance
                let distance = Phaser.Math.Distance.Between(this.scene.character.x, this.scene.character.y, this.sprite.x, this.sprite.y);
                
                if (distance < 50 && pointer.leftButtonDown()) {
                    this.clicked = !this.clicked;
                    this.color = (this.color ? this.color : 1);

                    if (type.includes('clickable')) {
                        if (this.clicked) {
                            this.sprite.setTexture(this.name + (this.color == 1 ? '' : this.color) + '_clicked');
                            this.sprite.setFrame(this.currentFrame);
                        }
                        else {
                            this.sprite.setTexture(this.name + (this.color == 1 ? '' : this.color));
                            this.sprite.setFrame(this.currentFrame);
                        }
                    }
                    
                    if (type.includes('crossable')) {
                        this.sprite.body.checkCollision.none = !this.sprite.body.checkCollision.none;
                        this.crossable = this.sprite.body.checkCollision.none;
                    }
                }
            })
        }

        if (type.includes('connectable')) {
            const index = this.checkDirectionSpritePlacing();
            this.sprite.setFrame(index);
            this.currentFrame = index;
        }

        if (type.includes('crossable')) {
            this.checkDirectionSpritePlacing();
        }
    }

    checkDirectionSpritePlacing() {
        let index = 0;
        const pos = { x: this.col, y: this.row };
        const grid = this.scene.worldGrid;

        if (grid[pos.y][pos.x +1] && grid[pos.y][pos.x +1].object && (dictionary[grid[pos.y][pos.x +1].object.name].type.includes("connectable") || dictionary[grid[pos.y][pos.x +1].object.name].type.includes("crossable"))) {
            if (dictionary[grid[pos.y][pos.x +1].object.name].type.includes("connectable")) {
                grid[pos.y][pos.x +1].object.currentFrame += 4;
                grid[pos.y][pos.x +1].object.sprite.setFrame(grid[pos.y][pos.x +1].object.currentFrame);
            }
            index += 1;
        }

        if (grid[pos.y +1][pos.x] && grid[pos.y +1][pos.x].object && (dictionary[grid[pos.y +1][pos.x].object.name].type.includes("connectable") || dictionary[grid[pos.y +1][pos.x].object.name].type.includes("crossable"))) {
            if (dictionary[grid[pos.y +1][pos.x].object.name].type.includes("connectable")) {
                grid[pos.y +1][pos.x].object.currentFrame += 8;
                grid[pos.y +1][pos.x].object.sprite.setFrame(grid[pos.y +1][pos.x].object.currentFrame);
            }
            index += 2;
        }
        
        if (grid[pos.y][pos.x -1] && grid[pos.y][pos.x -1].object && (dictionary[grid[pos.y][pos.x -1].object.name].type.includes("connectable") || dictionary[grid[pos.y][pos.x -1].object.name].type.includes("crossable"))) {
            if (dictionary[grid[pos.y][pos.x -1].object.name].type.includes("connectable")) {
                grid[pos.y][pos.x -1].object.currentFrame += 1;
                grid[pos.y][pos.x -1].object.sprite.setFrame(grid[pos.y][pos.x -1].object.currentFrame);
            }
            index += 4;
        }
        
        if (grid[pos.y -1] && grid[pos.y -1][pos.x] && grid[pos.y -1][pos.x].object && (dictionary[grid[pos.y -1][pos.x].object.name].type.includes("connectable") || dictionary[grid[pos.y -1][pos.x].object.name].type.includes("crossable"))) {
            if (dictionary[grid[pos.y -1][pos.x].object.name].type.includes("connectable")) {
                grid[pos.y -1][pos.x].object.currentFrame += 2;
                grid[pos.y -1][pos.x].object.sprite.setFrame(grid[pos.y -1][pos.x].object.currentFrame);
            }
            index += 8;
        }

        return index;
    }

    checkDirectionSpriteRemoving() {
        const pos = { x: this.col, y: this.row };
        const grid = this.scene.worldGrid;

        if (grid[pos.y][pos.x +1] && grid[pos.y][pos.x +1].object && (dictionary[grid[pos.y][pos.x +1].object.name].type.includes("connectable"))) {
            if (dictionary[grid[pos.y][pos.x +1].object.name].type.includes("connectable")) {
                grid[pos.y][pos.x +1].object.currentFrame -= 4;
                grid[pos.y][pos.x +1].object.sprite.setFrame(grid[pos.y][pos.x +1].object.currentFrame);
            }
        }

        if (grid[pos.y +1][pos.x] && grid[pos.y +1][pos.x].object && (dictionary[grid[pos.y +1][pos.x].object.name].type.includes("connectable"))) {
            if (dictionary[grid[pos.y +1][pos.x].object.name].type.includes("connectable")) {
                grid[pos.y +1][pos.x].object.currentFrame -= 8;
                grid[pos.y +1][pos.x].object.sprite.setFrame(grid[pos.y +1][pos.x].object.currentFrame);
            }
        }
        
        if (grid[pos.y][pos.x -1] && grid[pos.y][pos.x -1].object && (dictionary[grid[pos.y][pos.x -1].object.name].type.includes("connectable"))) {
            if (dictionary[grid[pos.y][pos.x -1].object.name].type.includes("connectable")) {
                grid[pos.y][pos.x -1].object.currentFrame -= 1;
                grid[pos.y][pos.x -1].object.sprite.setFrame(grid[pos.y][pos.x -1].object.currentFrame);
            }
        }
        
        if (grid[pos.y -1] && grid[pos.y -1][pos.x] && grid[pos.y -1][pos.x].object && (dictionary[grid[pos.y -1][pos.x].object.name].type.includes("connectable"))) {
            if (dictionary[grid[pos.y -1][pos.x].object.name].type.includes("connectable")) {
                grid[pos.y -1][pos.x].object.currentFrame -= 2;
                grid[pos.y -1][pos.x].object.sprite.setFrame(grid[pos.y -1][pos.x].object.currentFrame);
            }
        }
    }
}