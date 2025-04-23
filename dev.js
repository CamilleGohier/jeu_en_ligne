export function dev_functions(scene) {
    window.addItem = scene.inventory.addItem.bind(scene.inventory);

    window.removeItem = scene.inventory.removeItem.bind(scene.inventory);

    window.getCoords = () => {
        const screen = scene.input.activePointer;
        const world = scene.cameras.main.getWorldPoint(scene.input.activePointer.x, scene.input.activePointer.y);
        return {
            'écran': { y: screen.y, x: screen.x },
            'monde': { y: world.y, x: world.x },
            'tuile' : { y: Math.floor(world.y/32), x: Math.floor(world.x/32) },
            'contenu' : scene.worldGrid[Math.floor(world.y/32)][Math.floor(world.x/32)]
        }
    }

    window.get = () => {
        const world = scene.cameras.main.getWorldPoint(scene.input.activePointer.x, scene.input.activePointer.y);
        // return {x: world.x - scene.character.x, y: world.y - scene.character.y};
        const x = Math.abs(world.x - scene.character.x);
        const y = Math.abs(world.y - scene.character.y);
        return { xAbsolu: x, yAbsolu: y};
    }
}