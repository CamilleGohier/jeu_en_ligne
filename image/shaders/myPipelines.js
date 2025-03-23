export class DistortionPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
      // Récupère le code GLSL du shader depuis le cache
      const shaderCode = game.cache.text.get('distortionShader');
      super({
        game: game,
        name: 'distortionPipeline',
        fragShader: shaderCode,
        uniforms: [
          'uMainSampler',
          'uTime',
          'uDistortionIntensity'
        ]
      });
    }
  
    onPreRender() {
      // Met à jour les uniformes avant chaque rendu
      this.set1f('uTime', this.game.loop.time / 1000.0);
      this.set1f('uDistortionIntensity', 0.0); // Vous pouvez rendre cette valeur dynamique
    }
  }
  
  export class VignettePipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
      const shaderCode = game.cache.text.get('vignetteShader');
      super({
        game: game,
        name: 'vignettePipeline',
        fragShader: shaderCode,
        uniforms: [
          'uMainSampler',
          'uVignetteIntensity'
        ]
      });
    }
  
    onPreRender() {
      this.set1f('uVignetteIntensity', 1.0); // Ajustez cette valeur selon vos besoins
    }
  }
  