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

const ENEMY_HEADS = [
    ELEMENT.ENEMY_HEAD_DEAD,
    ELEMENT.ENEMY_HEAD_DOWN,
    ELEMENT.ENEMY_HEAD_EVIL,
    ELEMENT.ENEMY_HEAD_FLY,
    ELEMENT.ENEMY_HEAD_LEFT,
    ELEMENT.ENEMY_HEAD_RIGHT,
    ELEMENT.ENEMY_HEAD_SLEEP,
    ELEMENT.ENEMY_HEAD_UP,
];

// Here is utils that might help for bot development
/**
 *
 * @param {String} board
 * @returns {String} For display
 */
export function getBoardAsString(board) {
    // const size = getBoardSize(board);

    return getBoardAsArray(board).join("\n");
}

/**
 *
 * @param {String} board
 * @returns {String[]}
 */
export function getBoardAsArray(board) {
  const size = getBoardSize(board);
  var result = [];
  for (var i = 0; i < size; i++) {
      result.push(board.substring(i * size, (i + 1) * size));
  }
  return result;
}

/**
 *
 * @param {String} board
 * @returns {number}
 */
export function getBoardSize(board) {
    return Math.sqrt(board.length);
}

/**
 * @param {String} board
 * @returns {boolean}
 */
export function isGameOver(board) {
    return board.indexOf(ELEMENT.HEAD_DEAD) !== -1;
}

/**
 *
 * @param {String} board
 * @param {number} x
 * @param {number} y
 * @param {String} element
 * @returns {boolean}
 */
export function isAt(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false;
    }
    return getAt(board, x, y) === element;
}

/**
 *
 * @param {String} board
 * @param {number} x
 * @param {number} y
 * @returns {String}
 */
export function getAt(board, x, y) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }
    return getElementByXY(board, { x, y });
}

/**
 *
 * @param {String} board
 * @param {number} x
 * @param {number} y
 * @param {String} element
 * @returns {boolean}
 */
export function isNear(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false; //ELEMENT.WALL;
    }

    return isAt(board, x + 1, y, element) ||
			  isAt(board, x - 1, y, element) ||
			  isAt(board, x, y + 1, element) ||
			  isAt(board, x, y - 1, element);
}

/**
 *
 * @param {String} board
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isOutOf(board, x, y) {
    const boardSize = getBoardSize(board);
    return x >= boardSize || y >= boardSize || x < 0 || y < 0;
}
/**
 *
 * @param {String} board
 * @returns {{x:number, y:number}}
 */
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

/**
 *
 * @param {String} board
 * @param {String[]} elements
 * @returns {{x:number, y:number}}
 */
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

/**
 *
 * @param {String} board
 * @param {number} position
 * @returns {{x:number, y:number}}
 */
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

/**
 *
 * @param {String} board
 * @param {{x:number, y:number}} position
 */
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

/**
 *
 * @param {String} board
 * @param {number} from_x
 * @param {number} from_y
 * @param {number} to_x
 * @param {number} to_y
 * @param {boolean} canEatStones
 * @returns {[number,number][][]}
 */
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
                    /** @type {[number, number]} */
                    var next_cell = [dirs[j][0], dirs[j][1]];
                    if (!moved) {
                        path.push(next_cell);
                        moved = 1;
                    }
                    else {
                        /** @type {[number, number][]} */
                        var new_path = path.slice();
                        new_path[new_path.length - 1] = next_cell;
                        paths.splice(i+1, 0, new_path);
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

/**
 *
 * @param {String} board
 * @param {number} x
 * @param {number} y
 * @param {boolean} canEatStones
 * @returns {boolean}
 */
export function isWalkable(board, x, y, canEatStones) {
    const element = getAt(board, x, y);
    if (WALKABLE.indexOf(element) !== -1) return true;
    else if (canEatStones && element === ELEMENT.STONE) return true;
    else if (inFury(board) && isEnemy(element) && element != ELEMENT.ENEMY_HEAD_EVIL) return true;// !getSnakeModifiers(board, x, y).fury) return true;
    return false;
}

/**
 *
 * @param {String} board
 * @returns {boolean}
 */
export function inFury(board) {
    return board.indexOf(ELEMENT.HEAD_EVIL) !== -1;
}

/**
 *
 * @param {String} board
 * @returns {boolean}
 */
export function inFly(board) {
    return board.indexOf(ELEMENT.HEAD_FLY) !== -1;
}

/**
 *
 * @param {String} board
 * @param {number} x
 * @param {number} y
 * @returns {{fury:boolean, fly:boolean, dead:boolean}}
 */
export function getSnakeModifiers(board, x, y) {
    let snakeElement = getAt(board, x, y);

    if (!snakeElement) {
        return {
            fury: board.indexOf(ELEMENT.HEAD_EVIL) !== -1,
            fly: board.indexOf(ELEMENT.HEAD_FLY) !== -1,
            dead: board.indexOf(ELEMENT.HEAD_DEAD) !== -1
        };
    }

    const body = [{ x, y, element: snakeElement }];
    for (let i = 0; i < body.length; i++) {
        const item = body[i];

        if (ENEMY_HEADS.indexOf(item.element) !== -1) {
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

/**
 *
 * @param {String} element
 * @returns {boolean}
 */
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

/**
 *
 * @param {String} board
 * @param {number} from_x
 * @param {number} from_y
 * @param {number} to_x
 * @param {number} to_y
 * @param {boolean} canEatStones
 * @returns {[number, number][][]}
 */
function getIdealPaths(board, from_x, from_y, to_x, to_y, canEatStones) {
    const paths = [];

    HV: {
        /** @type {[number, number][]} */
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
        /** @type {[number, number][]} */
        const vh = [];
        for (let y = from_y; y != to_y;) {
            if (y > to_y) y--;
            else y++;

            if (!isWalkable(board, from_x, y, canEatStones)) {
                break VH;
            }

            vh.push([from_x, y]);
        }

        for (let x = from_x; x != to_x;) {
            if (x > to_x) x--;
            else x++;

            if (!isWalkable(board, x, to_y, canEatStones)) {
                break VH;
            }

            vh.push([x, to_y]);
        }

        paths.push(vh);
    }

    return paths;
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {[[number, number], [number, number], [number, number], [number, number]]}
 */
function _getSurroundCells(x, y) {
    return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y]
    ];
}

/**
 * @typedef {object} Snake
 * @property {{x:number, y:number}} head
 * @property {String} headElement
 * @property {boolean} fury
 * @property {boolean} fly
 * @property {boolean} sleep
 * @property {{x:number, y:number}[]} points
 */
/**
 *
 * @param {String} board
 * @returns {Snake[]}
 */
export function findSnakes(board) {
    const snakes = [];
    for (let i = 0; i < board.length; i++) {
        const element = board[i];
        if (ENEMY_HEADS.indexOf(element) !== -1 && element !== ELEMENT.ENEMY_HEAD_DEAD) {
            const point = getXYByPosition(board, i);
            snakes.push({
                head: point,
                headElement: element,
                fury: element === ELEMENT.ENEMY_HEAD_EVIL,
                fly: element === ELEMENT.ENEMY_HEAD_FLY,
                sleep: element === ELEMENT.ENEMY_HEAD_SLEEP,
                points: [point]
            });
        }
    }

    const headPosition = getHeadPosition(board) || {x:0, y:0};

    snakes.sort((s1, s2) => {
        // Operate on empowered snakes after other snakes cause we don't know where their body is
        if (s1.fury != s2.fury) {
            return Number(s1.fury) - Number(s2.fury);
        }

        if (s1.fly != s2.fly) {
            return Number(s1.fly) - Number(s2.fly);
        }

        if (s1.sleep != s2.sleep) {
            return Number(s1.fly) - Number(s2.fly);
        }

        const dist1 = Math.abs(s1.head.x - headPosition.x) + Math.abs(s1.head.y - headPosition.y);
        const dist2 = Math.abs(s2.head.x - headPosition.x) + Math.abs(s2.head.y - headPosition.y);

        return dist1 - dist2;
    });

    snakes.forEach(snake => {
        for (let i = 0; i < snake.points.length; i++) {
            const point = snake.points[i];
            const element = getAt(board, point.x, point.y);

            if (ENEMY_TAILS.indexOf(element) !== -1) {
                break;
            }

            if (element === ELEMENT.ENEMY_HEAD_DEAD || element === ELEMENT.ENEMY_HEAD_EVIL || element === ELEMENT.ENEMY_HEAD_FLY) {
                if (i) break;
            }

            const nextPoints = [];
            const around = {
                top: { x: point.x, y: point.y - 1 },
                bottom: { x: point.x, y: point.y + 1 },
                left: { x: point.x - 1, y: point.y },
                right: { x: point.x + 1, y: point.y }
            };
            switch (element) {
                case ELEMENT.HEAD_DOWN:
                    nextPoints.push(around.top);
                    break;
                case ELEMENT.HEAD_UP:
                    nextPoints.push(around.bottom);
                    break;
                case ELEMENT.HEAD_LEFT:
                    nextPoints.push(around.right);
                    break;
                case ELEMENT.HEAD_RIGHT:
                    nextPoints.push(around.left);
                    break;
                case ELEMENT.ENEMY_BODY_HORIZONTAL:
                    nextPoints.push(around.right, around.left);
                    break;
                case ELEMENT.ENEMY_BODY_VERTICAL:
                    nextPoints.push(around.top, around.bottom);
                    break;
                case ELEMENT.ENEMY_BODY_LEFT_DOWN:
                    nextPoints.push(around.left, around.bottom);
                    break;
                case ELEMENT.ENEMY_BODY_LEFT_UP:
                    nextPoints.push(around.left, around.top);
                    break;
                case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
                    nextPoints.push(around.right, around.bottom);
                    break;
                case ELEMENT.ENEMY_BODY_RIGHT_UP:
                    nextPoints.push(around.right, around.top);
                    break;
                default:
                    nextPoints.push(around.top, around.bottom, around.left, around.right);
                    break;
            }

            nextPoints.forEach(p => {
                if (snake.points.some(prevPoint => { if (!prevPoint || !p) { console.log(prevPoint, p, snake.points, nextPoints); return false;} return p.x == prevPoint.x && p.y == prevPoint.y})) {
                    return; // Skip counted points
                }
                const element = getAt(board, p.x, p.y);

                if (p == around.top && VALID_TOPS.indexOf(element) == -1) {
                    return;
                }

                if (p == around.bottom && VALID_BOTTOMS.indexOf(element) == -1) {
                    return;
                }

                if (p == around.left && VALID_LEFTS.indexOf(element) == -1) {
                    return;
                }

                if (p == around.right && VALID_RIGHTS.indexOf(element) == -1) {
                    return;
                }

                snake.points.push(p);
            });

        }
    });

    return snakes;
}

const VALID_TOPS = [
    ELEMENT.ENEMY_BODY_VERTICAL,
    ELEMENT.ENEMY_BODY_LEFT_DOWN,
    ELEMENT.ENEMY_BODY_RIGHT_DOWN,
    ELEMENT.ENEMY_TAIL_END_UP
];

const VALID_BOTTOMS = [
    ELEMENT.ENEMY_BODY_VERTICAL,
    ELEMENT.ENEMY_BODY_LEFT_UP,
    ELEMENT.ENEMY_BODY_RIGHT_UP,
    ELEMENT.ENEMY_TAIL_END_DOWN
];

const VALID_RIGHTS = [
    ELEMENT.ENEMY_BODY_HORIZONTAL,
    ELEMENT.ENEMY_BODY_LEFT_UP,
    ELEMENT.ENEMY_BODY_LEFT_DOWN,
    ELEMENT.ENEMY_TAIL_END_RIGHT
];

const VALID_LEFTS = [
    ELEMENT.ENEMY_BODY_HORIZONTAL,
    ELEMENT.ENEMY_BODY_RIGHT_UP,
    ELEMENT.ENEMY_BODY_RIGHT_DOWN,
    ELEMENT.ENEMY_TAIL_END_LEFT
];

const ENEMY_TAILS = [
    ELEMENT.ENEMY_TAIL_END_DOWN,
    ELEMENT.ENEMY_TAIL_END_UP,
    ELEMENT.ENEMY_TAIL_END_LEFT,
    ELEMENT.ENEMY_TAIL_END_RIGHT
];
