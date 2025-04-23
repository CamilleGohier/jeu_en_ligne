// import { dictionary } from "../data/dictionary.js";

// export function checkDistance(scene, distance, sprite1, sprite2 = null) {
//     if (!sprite2) {
//         sprite2 = scene.character;
//     }
//     const coordsSprite1 = getSpriteCenter(scene, sprite1);
//     const coordsSprite2 = getSpriteCenter(scene, sprite1);

//     Phaser.Math.Between(coordsItem1.x, coordsItem1.y, coordsItem2.x, coordsItem2.y);
// }

// export function getSpriteCenter(scene, item) {
//     console.log(item);
//     let origin = (dictionary[item.name] && dictionary[item.name].origin ? dictionary[item.name].origin : [0, 0])
//     let center = { x: item.sprite.x + (item.sprite.displayWidth * 0.5 - origin[0]), y: item.sprite.y + (item.sprite.displayHeight * 0.5 - origin[1]) }

//     scene.add.circle(center.x, center.y, 1, 0xFFFFFF).setDepth(100) // Penser à ajouter scene
//     return center;
// }