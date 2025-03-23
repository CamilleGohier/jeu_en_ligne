const easystar = new EasyStar.js();

export function createRandomPathfinding(scene, character, target, callback = null) {
    const pathFindingGrid = scene.worldGrid.map(row =>
        row.map(cell => {
            if (cell.ground.texture.key == 'grass' && cell.object == null) {
                return 0;
            }
            else if (cell.ground.texture.key == 'grass' && cell.object == "positionNPC") {
                return 0;
            }
            return 1;
        })
    )

    let isValidTargetPos = false;
    let targetPos = { row: Phaser.Math.Clamp(character.row + Phaser.Math.Between(-target, target), 0, scene.worldGrid.length - 1), col: Phaser.Math.Clamp(character.col + Phaser.Math.Between(-target, target), 0, scene.worldGrid[0].length - 1) };
    let tries = 0;

    while (!isValidTargetPos) {
        tries += 1;
        targetPos = { row: Phaser.Math.Clamp(character.row + Phaser.Math.Between(-target, target), 0, scene.worldGrid.length - 1), col: Phaser.Math.Clamp(character.col + Phaser.Math.Between(-target, target), 0, scene.worldGrid[0].length - 1) };
        
        if(scene.worldGrid[targetPos.row][targetPos.col] && !scene.worldGrid[targetPos.row][targetPos.col].object && scene.worldGrid[targetPos.row][targetPos.col].ground.texture.key == 'grass') {
            isValidTargetPos = true;
        }

        if (tries >= 5) {
            targetPos = { row: character.row, col: character.col };
            isValidTargetPos = true;
        }
    }

    easystar.setGrid(pathFindingGrid);
    easystar.setAcceptableTiles([0]);

    easystar.findPath(character.col, character.row, targetPos.col, targetPos.row, (path) => {

        if (path == null) {
            // Pas de chemin
        }
        else {
            if (path.length > 0 && path[0].x == character.col && path[0].y == character.row) {
                // La première position est la postion du personnage alors on l'enlève
                path.shift();
            }
        }

        if (callback) {
            callback(path);
        };
    });

    easystar.calculate();
};

export function createDirectPathfinding(scene, character, target, callback = null) {
    const pathFindingGrid = scene.worldGrid.map(row =>
        row.map(cell => {
            if (cell.ground.texture.key == 'grass' && cell.object == null) {
                return 0;
            }
            else if (cell.ground.texture.key == 'grass' && cell.object == "positionNPC") {
                return 0;
            }
            return 1;
        })
    )

    easystar.setGrid(pathFindingGrid);
    easystar.setAcceptableTiles([0]);

    easystar.findPath(character.col, character.row, target.col, target.row, (path) => {

        if (path == null) {
            character.move();
        }
        else {
            if (path.length > 0 && path[0].x == character.col && path[0].y == character.row) {
                // La première position est la postion du personnage alors on l'enlève
                path.shift();
            }
        }

        if (callback) {
            callback(path);
        };
    });

    easystar.calculate();
};