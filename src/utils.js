/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import {
  ELEMENT
} from './constants';

// Here is utils that might help for bot development
export function getBoardAsString(board) {
    const size = getBoardSize(board);

    return getBoardAsArray(board).join("\n");
}

export function getBoardAsArray(board) {
  const size = getBoardSize(board);
  var result = [];
  for (var i = 0; i < size; i++) {
      result.push(board.substring(i * size, (i + 1) * size));
  }
  return result;
}

export function getBoardSize(board) {
    return Math.sqrt(board.length);
}

export function isGameOver(board) {
    return board.indexOf(ELEMENT.HEAD_DEAD) !== -1;
}

export function isAt(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false;
    }
    return getAt(board, x, y) === element;
}

export function getAt(board, x, y) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }
    return getElementByXY(board, { x, y });
}

export function isNear(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }

    return isAt(board, x + 1, y, element) ||
			  isAt(board, x - 1, y, element) ||
			  isAt(board, x, y + 1, element) ||
			  isAt(board, x, y - 1, element);
}

export function isOutOf(board, x, y) {
    const boardSize = getBoardSize(board);
    return x >= boardSize || y >= boardSize || x < 0 || y < 0;
}

export function getHeadPosition(board) {
    return getFirstPositionOf(board, [
        ELEMENT.HEAD_DOWN,
        ELEMENT.HEAD_LEFT,
        ELEMENT.HEAD_RIGHT,
        ELEMENT.HEAD_UP,
        ELEMENT.HEAD_DEAD,
        ELEMENT.HEAD_EVIL,
        ELEMENT.HEAD_FLY,
        ELEMENT.HEAD_SLEEP,
    ]);
}

export function getFirstPositionOf(board, elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var position = board.indexOf(element);
        if (position !== -1) {
            return getXYByPosition(board, position);
        }
    }
    return null;
}

export function getXYByPosition(board, position) {
    if (position === -1) {
        return null;
    }

    const size = getBoardSize(board);
    return {
        x:  position % size,
        y: (position - (position % size)) / size
    };
}

export function getElementByXY(board, position) {
    const size = getBoardSize(board);
    return board[size * position.y + position.x];
}

var WALKABLE = [
    ELEMENT.NONE, ELEMENT.APPLE, ELEMENT.FLYING_PILL, ELEMENT.FURY_PILL,
    ELEMENT.GOLD, //ELEMENT.STONE,
    ELEMENT.TAIL_END_DOWN, ELEMENT.TAIL_END_UP, ELEMENT.TAIL_END_LEFT,
    ELEMENT.TAIL_END_RIGHT, ELEMENT.TAIL_INACTIVE
];

const MAX_PATHS = 2;

export function getPaths(board, from_x, from_y, to_x, to_y, canEatStones) {
    var dirs = _getSurroundCells(from_x, from_y);
    var paths = getIdealPaths(board, from_x, from_y, to_x, to_y, canEatStones);

    dirs.forEach(dir => {
        var element = getAt(board, dir[0], dir[1]);
        if (WALKABLE.indexOf(element) !== -1) {
            paths.push([dir]);
        }
    })

    var notEnded = function(path) {
        var last_cell = path[path.length - 1];
        return last_cell[0] != to_x || last_cell[1] != to_y;
    }

    var byDistance = function(dir1, dir2) {
        var dist1 = Math.abs(dir1[0] - to_x) + Math.abs(dir1[1] - to_y);
        var dist2 = Math.abs(dir2[0] - to_x) + Math.abs(dir2[1] - to_y);
        return dist1 - dist2;
    }

    for (let i = 0; i < paths.length; i++) {
        var path = paths[i];
        while (notEnded(path)) {
            var last_cell = path[path.length - 1];
            var dirs = _getSurroundCells(last_cell[0], last_cell[1]);

            dirs.sort(byDistance);

            var moved = 0;
            for (let j = 0; j < dirs.length; j++) {
                var any_path_crossed = paths.some(path_to_check => {
                    return path_to_check.some(passed_cell => passed_cell[0] == dirs[j][0] && passed_cell[1] == dirs[j][1]);
                })
                if (any_path_crossed && (dirs[j][0] !== to_x || dirs[j][1] !== to_y)) {
                    continue; // exclude passed cells
                }

                var element = getAt(board, dirs[j][0], dirs[j][1]);

                if (isWalkable(board, dirs[j][0], dirs[j][1], canEatStones)) {
                    var next_cell = [dirs[j][0], dirs[j][1]];
                    if (!moved) {
                        path.push(next_cell);
                        moved = 1;
                    }
                    else {
                        var new_path = path.slice();
                        new_path[new_path.length - 1] = next_cell;
                        paths.splice(i+1, 0, [new_path]);
                        // paths.push(new_path);
                    }
                }
            }

            if (!moved) {
                paths.splice(i--, 1); // Remove dead end path
                break;
            }

        }

        if (i >= MAX_PATHS) { // We have found MAX succesfull paths
            paths = paths.slice(0, MAX_PATHS);
            break;
        }
    }

    paths.sort((p1, p2) => p1.length - p2.length); // Sort paths by length

    return paths;
}

function isWalkable(board, x, y, canEatStones) {
    const element = getAt(board, x, y);
    if (WALKABLE.indexOf(element) !== -1) return true;
    else if (canEatStones && element === ELEMENT.STONE) return true;
    else if (inFury(board) && isEnemy(element) && !getSnakeModifiers(board, x, y).fury) return true;
    return false;
}

export function inFury(board) {
    return board.indexOf(ELEMENT.HEAD_EVIL) !== -1;
}

export function getSnakeModifiers(board, x, y) {
    let snakeElement = getAt(board, x, y);

    if (!snakeElement) {
        return {
            fury: board.indexOf(ELEMENT.HEAD_EVIL),
            fly: board.indexOf(ELEMENT.HEAD_FLY),
            dead: board.indexOf(ELEMENT.HEAD_DEAD)
        };
    }

    const heads = [
        ELEMENT.ENEMY_HEAD_DEAD,
        ELEMENT.ENEMY_HEAD_DOWN,
        ELEMENT.ENEMY_HEAD_EVIL,
        ELEMENT.ENEMY_HEAD_FLY,
        ELEMENT.ENEMY_HEAD_LEFT,
        ELEMENT.ENEMY_HEAD_RIGHT,
        ELEMENT.ENEMY_HEAD_SLEEP,
        ELEMENT.ENEMY_HEAD_UP,
    ];

    const body = [{ x, y, element: snakeElement }];
    for (let i = 0; i < body.length; i++) {
        const item = body[i];

        if (heads.indexOf(item.element) !== -1) {
            return {
                fury: item.element === ELEMENT.ENEMY_HEAD_EVIL,
                fly: item.element === ELEMENT.ENEMY_HEAD_FLY,
                dead: item.element === ELEMENT.ENEMY_HEAD_DEAD
            };
        }

        const surroundings = _getSurroundCells(item.x, item.y);
        surroundings
            .filter(coord => isEnemy(getAt(board, coord[0], coord[1])))
            .filter(coord => !body.some(it => it.x == coord[0] && it.y == coord[1]))
            .forEach(coord => {
                body.push({
                    x: coord[0],
                    y: coord[1],
                    element: getAt(board, coord[0], coord[1])
                })
            });
    }

    return {
        fury: false,
        fly: false,
        dead: false
    };
}

export function isEnemy(element) {
    return [
        ELEMENT.ENEMY_HEAD_DEAD,
        ELEMENT.ENEMY_HEAD_DOWN,
        ELEMENT.ENEMY_HEAD_EVIL,
        ELEMENT.ENEMY_HEAD_FLY,
        ELEMENT.ENEMY_HEAD_LEFT,
        ELEMENT.ENEMY_HEAD_RIGHT,
        ELEMENT.ENEMY_HEAD_SLEEP,
        ELEMENT.ENEMY_HEAD_UP,

        ELEMENT.ENEMY_BODY_HORIZONTAL,
        ELEMENT.ENEMY_BODY_LEFT_DOWN,
        ELEMENT.ENEMY_BODY_LEFT_UP,
        ELEMENT.ENEMY_BODY_RIGHT_DOWN,
        ELEMENT.ENEMY_BODY_RIGHT_UP,
        ELEMENT.ENEMY_BODY_VERTICAL,

        ELEMENT.ENEMY_TAIL_END_DOWN,
        ELEMENT.ENEMY_TAIL_END_LEFT,
        ELEMENT.ENEMY_TAIL_END_RIGHT,
        ELEMENT.ENEMY_TAIL_END_UP,
        ELEMENT.ENEMY_TAIL_INACTIVE
    ].indexOf(element) !== -1;
}

function getIdealPaths(board, from_x, from_y, to_x, to_y, canEatStones) {
    const paths = [];

    HV: {
        const hv = [];
        for (let x = from_x; x != to_x;){
            if (x > to_x) x--;
            else x++;

            if (!isWalkable(board, x, from_y, canEatStones)) {
                break HV;
            }

            hv.push([x, from_y]);
        }

        for (let y = from_y; y != to_y;) {
            if (y > to_y) y--;
            else y++;

            if (!isWalkable(board, to_x, y, canEatStones)) {
                break HV;
            }

            hv.push([to_x, y]);
        }

        paths.push(hv);
    }

    VH: {
        const vh = [];
        for (let y = from_y; y != to_y;) {
            if (y > to_y) y--;
            else y++;

            if (!isWalkable(board, from_x, y)) {
                break VH;
            }

            vh.push([from_x, y]);
        }

        for (let x = from_x; x != to_x;) {
            if (x > to_x) x--;
            else x++;

            if (!isWalkable(board, x, to_y)) {
                break VH;
            }

            vh.push([x, to_y]);
        }

        paths.push(vh);
    }

    return paths;
}

function _getSurroundCells(x, y) {
    return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y]
    ];
}
