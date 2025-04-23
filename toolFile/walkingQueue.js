export function walkingQueue(scene, element, canOrCannot) {
    let isInTab = scene.canWalk.indexOf(element);

    if (isInTab >= 0 && canOrCannot == 'can') {
        scene.canWalk = scene.canWalk.filter(e => e != element);
    }
    else if (isInTab == -1 && canOrCannot == 'cannot'){
        scene.canWalk.push(element);
    }
}

export function inventoryQueue(scene, element, canOrCannot) {
    let isInTab = scene.canOpenInventory.indexOf(element);

    if (isInTab >= 0 && canOrCannot == 'can') {
        scene.canOpenInventory = scene.canOpenInventory.filter(e => e != element);
    }
    else if (isInTab == -1 && canOrCannot == 'cannot') {
        scene.canOpenInventory.push(element);
    }
}