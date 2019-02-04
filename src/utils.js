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

export function getPaths(board, from_x, from_y, to_x, to_y) {
    var dirs = _getSurroundCells(from_x, from_y);
    var paths = [];

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

                if (WALKABLE.indexOf(element) !== -1) {
                    var next_cell = [dirs[j][0], dirs[j][1]];
                    if (!moved) {
                        path.push(next_cell);
                        moved = 1;
                    }
                    else {
                        var new_path = path.slice();
                        new_path[new_path.length - 1] = next_cell;
                        paths.push(new_path);
                    }
                }
            }

            if (!moved) {
                paths.splice(i--, 1); // Remove dead end path
                break;
            }

        }

        if (i >= 3) { // We have found 3 succesfull paths
            paths = paths.slice(0, 3);
            break;
        }
    }

    paths.sort((p1, p2) => p1.length - p2.length); // Sort paths by length

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
