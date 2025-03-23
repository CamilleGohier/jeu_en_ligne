import { DistortionPipeline, VignettePipeline } from "./image/shaders/myPipelines.js";

export function createEffectScene(scene) {
    scene.lights.enable();
    scene.lights.setAmbientColor(0x606090);
    scene.character.setPipeline('Light2D');

    scene.light = scene.lights.addLight(scene.character.x, scene.character.y, 400, 0x505050, 1);

    scene.worldGrid.forEach(row => {
        row.forEach(item => {
            if (item.ground) {
                item.ground.setPipeline('Light2D');
            }
        })
    });

    scene.worldGrid.forEach(row => {
        row.forEach(item => {
            if (item.object && typeof item.object.setPipeline == 'function') {
                item.object.setPipeline('Light2D');
            }
        })
    });

    scene.npcs.forEach(npc => {
        npc.sprite.setPipeline('Light2D');
    });

    scene.storages.forEach(storage => {
        storage.sprite.setPipeline('Light2D');
    });

    const graphic = scene.add.graphics();
    graphic.fillStyle(0xffffff, 0.5).fillRect(0, 0, 2, 2).generateTexture('spark', 2, 2).destroy();

    const dynamicPosition = {
        getRandomPoint: function (out) {
            out = out || new Phaser.Math.Vector2();
            out.x = Phaser.Math.Between(scene.cameras.main.worldView.x, scene.cameras.main.worldView.x + scene.cameras.main.width);
            out.y = Phaser.Math.Between(scene.cameras.main.worldView.y, scene.cameras.main.worldView.y + scene.cameras.main.height);
            return out;
        }
    }

    const particles = scene.add.particles(0, 0, 'spark', {
        emitZone: {
            type: 'random',
            source: dynamicPosition
        },
        lifespan : Phaser.Math.Between(5000, 20000),
        speedX : { min: -10, max: 10 },
        speedY : { min: -10, max: 10 },
        scale: { start: 1, end: 0 },
        alpha: { start: 0.5, end: 0},
        blendMode: 'ADD',
        quantity: 5,
        frequency: 1000
    })

    scene.particles = particles;

    scene.game.renderer.pipelines.addPostPipeline('distortionPipeline', DistortionPipeline);
    scene.game.renderer.pipelines.addPostPipeline('vignettePipeline', VignettePipeline);

    scene.cameras.main.setPostPipeline(['distortionPipeline', 'vignettePipeline']);
}

export function updateLight(scene) {
    scene.light.x = scene.character.x;
    scene.light.y = scene.character.y;
}

export function addEffectSceneToItem(scene, item) {
    item.setPipeline('Light2D');
}