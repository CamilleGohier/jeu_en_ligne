export function setCamera(scene) {
    scene.cameras.main.startFollow(scene.character, true, 0.1, 0.1);
    scene.cameras.main.setZoom(1);
    scene.cameras.main.setDeadzone(200, 150);
    scene.cameras.main.setBounds(0, 0, 1920, 1080);
}