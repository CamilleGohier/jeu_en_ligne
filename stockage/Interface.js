import Inventory from "./Inventory.js";
import { tools } from "../data/variables.js";
import SecondaryToolbar from "./SecondaryToolbar.js";
import { toolbarContent } from "../data/toolbarContent.js";

export default class Interface extends Inventory {

    constructor(scene) {
        super (scene, 475, 460, 32, 2, 10, 0);
        this.scene = scene;
        this.areas = [];
    }

    showInterface() {
        if (this.interface) {
            this.interface.destroy();
        }

        const background = this.scene.add.graphics().setDepth(20).fillStyle(0x909090, 0.8).fillRect(-200, -200, 400, 400);
        const character = this.scene.add.sprite(-100, -50, 'character').setDepth(25).setScale(0.75).setScale(4);

        this.interface = this.scene.add.container(this.scene.cameras.main.width /2, this.scene.cameras.main.height /2).setDepth(20).setScrollFactor(0);
        this.interface.add(background);
        this.interface.add(character);

        let indexOrder = 0;
        tools.forEach((tool, indexTool) => {
            if (tool.secondary != null) {
                const secondaryToolbar = new SecondaryToolbar(this.scene, tool.key, indexTool, indexOrder);
                this.areas.push(secondaryToolbar);
                indexOrder += 1;
            }
        });
        this.show();
    }

    hideInterface() {
        if (this.interface) {
            this.interface.destroy();
            this.interface = null;
        }

        this.areas.forEach(secondaryToolbar => {
            secondaryToolbar.destroyToolbar();
            secondaryToolbar = null;
        })
        this.areas = [];

        this.hide();
    }

    setDragInterface(name) {
        
        toolbarContent.forEach((tab, index) => {
            if (tab.includes(name)) {
                this.areas[index].removeTint();
            }
            else {
                this.areas[index].setTint();
            }
        });
    }

    removeDragInterface() {
        this.areas.forEach(tab => {
            tab.removeTint();
            // Rajouter une validité sur la tuile genre .valid = true ?
        });
    }
}