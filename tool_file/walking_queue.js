export function walking_queue(scene, element, canOrCannot) {
    let isInTab = scene.canWalk.indexOf(element);

    if (isInTab >= 0 && canOrCannot == 'can') {
        scene.canWalk = scene.canWalk.filter(e => e != element);
    }
    else if (isInTab == -1 && canOrCannot == 'cannot'){
        scene.canWalk.push(element);
    }
}