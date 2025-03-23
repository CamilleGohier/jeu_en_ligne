import { tools } from './data/variables.js';

export class Toolbar {
    constructor(scene) {
        this.scene = scene;
        this.primaryItems = [];
        this.secondaryToolbar = null;
        this.selectedTool = 1;
        this.selectedSecondary = 0;
        this.isShowingSecondary = false;

        this.createPrimaryToolbar();
    }

    createPrimaryToolbar() {
        const startX = 490;
        const startY = 680;
        const tileSize = 32;
        const spacing = 8;
        const outerSpacing = 10;

        this.scene.add.image(460, 620, 'inventory_background').setOrigin(0, 0).setDepth(20).setScrollFactor(0);
        tools.forEach((tool, index) => {
            const x = startX + index * (tileSize + spacing) + (index > 0 ? outerSpacing : 0);
    
            this.scene.add.image(x, startY, 'tile').setScale(1.3).setDepth(20).setScrollFactor(0);
            const icon = this.scene.add.sprite(x, startY, tool.key).setDepth(25).setInteractive().setScale(1).setScrollFactor(0);

            if (tool.secondary && tool.secondary.some((icon => icon.key))) {
                icon.secondarySelected = 0;

                const iconSecondaryInPrimaryToolbar = tool.secondary[0].key ? tool.secondary[0].key : 'empty';
                icon.secondarySprite = this.scene.add.sprite(x + 9, startY + 9, iconSecondaryInPrimaryToolbar).setDepth(25).setInteractive().setScale(0.5).setScrollFactor(0);
            }

            icon.name = tool.key;
            this.primaryItems.push(icon);
        });
        
        this.highlightPrimary();
    }

    highlightPrimary() {
        this.primaryItems.forEach((icon, index) => {
            icon.clearTint();
        });
        this.primaryItems[this.selectedTool].setTint(0xff5555);
    }

    selectNextPrimary() {
        this.selectedTool = (this.selectedTool + 1) % this.primaryItems.length;
        this.highlightPrimary();
    }

    selectPreviousPrimary() {
        this.selectedTool = (this.selectedTool - 1 + this.primaryItems.length) % this.primaryItems.length;
        this.highlightPrimary();
    }

    updateSecondaryToolbar() {
        const startX = 18;
        const startY = 633;
        const tileSize = 8;
        const spacing = 16;

        this.clearSecondaryToolbar();

        const selectedTool = tools[this.selectedTool];
        // Si l'outil possède un sous-menu avec au moins 1 élément
        if (selectedTool.secondary && selectedTool.secondary.some((item) => item.key)) {
            const primaryIcon = this.primaryItems[this.selectedTool];
            const background = this.scene.add.sprite(primaryIcon.x - 66, 610, 'inventory_background').setDepth(20).setOrigin(0, 0).setScale(0.4).setScrollFactor(0);

            const arrow = this.scene.add.sprite(background.x + startX + 2 * (tileSize + spacing) + 1, startY + 15, 'arrow').setDepth(25).setScale(0.75).setScrollFactor(0);
            const secondaryTiles = [];
            const secondaryIcons = [];
            selectedTool.secondary.forEach((option, index) => {
                const x = background.x + startX + index * (tileSize + spacing) + (index <= 2 ? 48 : 0) - (index > 2 ? 72 : 0);
                
                const tile = this.scene.add.sprite(x, startY, 'tile').setDepth(20).setScale(0.75).setScrollFactor(0);
                secondaryTiles.push(tile);

                const icon = this.scene.add.sprite(x, startY, option.key ? option.key : 'empty').setDepth(25).setInteractive().setScale(0.7).setScrollFactor(0);
                icon.secondaryData = option;
                secondaryIcons.push(icon);
            })

            this.secondaryToolbar = {
                background,
                arrow,
                tiles: secondaryTiles,
                icons: secondaryIcons
            };

            this.selectedSecondary = primaryIcon.secondarySelected;
            this.isShowingSecondary = true;

            this.updateSecondaryIconPositions();
            this.updateSecondaryIconInPrimaryToolbar();
        }
        else {
            this.isShowingSecondary = false;
        }
    }

    clearSecondaryToolbar() {
        if (this.secondaryToolbar) {
            this.secondaryToolbar.background.destroy();
            this.secondaryToolbar.arrow.destroy();
            this.secondaryToolbar.tiles.forEach(tile => tile.destroy());
            this.secondaryToolbar.icons.forEach(icon => icon.destroy());
            this.secondaryToolbar = null;
        }
    }

    selectNextSecondary() {
        if (!this.secondaryToolbar) {
            return;
        }

        this.selectedSecondary = (this.selectedSecondary + 1) % this.secondaryToolbar.icons.length;
        this.primaryItems[this.selectedTool].secondarySelected = this.selectedSecondary;
        this.updateSecondaryIconInPrimaryToolbar();
        this.updateSecondaryIconPositions();
    }

    selectPreviousSecondary() {
        if (!this.secondaryToolbar) {
            return;
        }
        
        this.selectedSecondary = (this.selectedSecondary - 1 + this.secondaryToolbar.icons.length) % this.secondaryToolbar.icons.length;
        this.primaryItems[this.selectedTool].secondarySelected = this.selectedSecondary;
        this.updateSecondaryIconInPrimaryToolbar();
        this.updateSecondaryIconPositions();
    }

    updateSecondaryIconPositions() {
        const positions = [
            this.primaryItems[this.selectedTool].x - 48,
            this.primaryItems[this.selectedTool].x - 24,
            this.primaryItems[this.selectedTool].x,
            this.primaryItems[this.selectedTool].x + 24,
            this.primaryItems[this.selectedTool].x + 48
        ];

        this.selectedSecondary = this.primaryItems[this.selectedTool].secondarySelected;

        for (let posBefore = 0; posBefore < this.secondaryToolbar.icons.length; posBefore++) {
            let posAfter = (posBefore - this.selectedSecondary + 2 + this.secondaryToolbar.icons.length) % this.secondaryToolbar.icons.length;
            this.secondaryToolbar.icons[posBefore].x = positions[posAfter];
            this.secondaryToolbar.tiles[posBefore].x = positions[posAfter];
        }
    }

    updateSecondaryIconInPrimaryToolbar() {
        const selectedTool = tools[this.selectedTool];

        if (selectedTool.secondary && selectedTool.secondary.some((item) => item.key)) {
            if (this.primaryItems[this.selectedTool].secondarySprite) {
                this.primaryItems[this.selectedTool].secondarySprite.setTexture(this.secondaryToolbar.icons[this.selectedSecondary].secondaryData.key || 'empty');
            }
            else {
                const primaryIcon = this.primaryItems[this.selectedTool];
                primaryIcon.secondarySprite = this.scene.add.sprite(primaryIcon.x + 9, primaryIcon.y + 9, this.secondaryToolbar.icons[this.selectedSecondary].secondaryData.key).setDepth(25).setInteractive().setScale(0.5).setScrollFactor(0);
            }
        }
    }

    hideSecondary() {
        this.clearSecondaryToolbar();
        this.isShowingSecondary = false;
    }
}