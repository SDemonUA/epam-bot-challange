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
import { ELEMENT, COMMANDS } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getXYByPosition, getPaths, getAt
} from './utils';

var CONSUMABLE_ELEMENTS = [
    ELEMENT.APPLE, ELEMENT.GOLD, ELEMENT.FLYING_PILL, ELEMENT.FURY_PILL//, ELEMENT.STONE
];

const MAX_SEARCH = 3;

export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));

    const consumables = getConsumables(board);
    // Sort by distance and rate - higher rate will give priority over distance
    consumables.sort((c1, c2) => {
        const distance_rate1 = Math.abs(c1.point.x - headPosition.x) + Math.abs(c1.point.y - headPosition.y);// - rateElement(c1.element);
        const distance_rate2 = Math.abs(c2.point.x - headPosition.x) + Math.abs(c2.point.y - headPosition.y);// - rateElement(c2.element);

        return distance_rate1 - distance_rate2 || rateElement(c2.element) - rateElement(c1.element);
    });

    let current_path;

    for (let i = 0; i < consumables.length && i < MAX_SEARCH; i++) {
        const item = consumables[i];
        const paths = getPaths(board, headPosition.x, headPosition.y, item.point.x, item.point.y);
        const rating = rateElement(item.element);

        // console.log('Distance:', Math.abs(item.point.x - headPosition.x) + Math.abs(item.point.y - headPosition.y), item.element);

        if (!paths.length) {
            logger('No path to ' + JSON.stringify(item));
            continue;
        }

        if (
            !current_path ||
            paths[0].length - rating < current_path.path.length - current_path.rating
        ) {
            current_path = {
                path: paths[0],
                rating: rating,
                element: item.element,
                point: item.point
            }
        }
    }

    if (current_path) {
        const point = {
            x: current_path.path[0][0],
            y: current_path.path[0][1]
        };

        const command = getCommandByPoints(headPosition, point);

        logger('Winned path ' + current_path.element + ' ' + JSON.stringify(current_path.point) + ' ' + JSON.stringify(current_path.path));

        if (command) {
            return command;
        }
        else if (current_path.path.length > 1){
            return getCommandByPoints(headPosition, {
                x: current_path.path[1][0],
                y: current_path.path[1][1]
            })
        }
    }

    logger('Warning: no desicition for move was made.\n'+ JSON.stringify(current_path)+'\n'+ JSON.stringify(consumables));

    const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Sorround: ' + JSON.stringify(sorround));

    const raitings = sorround.map(rateElement);
    logger('Raitings:' + JSON.stringify(raitings));

    const command = getCommandByRaitings(raitings);

    return command;
}

function getCommandByPoints(from, to) {
    if (from.x == to.x) {
        if (from.y > to.y) {
            return COMMANDS.UP;
        }
        else {
            return COMMANDS.DOWN;
        }
    }
    if (from.y == to.y) {
        if (from.x > to.x) {
            return COMMANDS.LEFT;
        }
        else {
            return COMMANDS.RIGHT;
        }
    }

    return '';
}

function getConsumables(board) {
    const items = [];
    for (let i = 0; i < board.length; i++) {
        const element = board[i];
        if (CONSUMABLE_ELEMENTS.indexOf(element) !== -1) {
            items.push({
                point: getXYByPosition(board, i),
                element
            });
        }
    }

    return items;
}

function getSorround(board, position) {
    const p = position;
    return [
        getElementByXY(board, {x: p.x - 1, y: p.y }), // LEFT
        getElementByXY(board, {x: p.x, y: p.y -1 }), // UP
        getElementByXY(board, {x: p.x + 1, y: p.y}), // RIGHT
        getElementByXY(board, {x: p.x, y: p.y + 1 }) // DOWN
    ];
}

const RATINGS = {
    [ELEMENT.NONE]: 0,
    [ELEMENT.FURY_PILL]: 1,
    [ELEMENT.FLYING_PILL]: 2,
    [ELEMENT.APPLE]: 5,
    [ELEMENT.GOLD]: 7
};

function rateElement(element) {
    let rating = RATINGS[element];

    if (typeof rating == undefined) {
        return -1;
    }

    return rating;
}


function getCommandByRaitings(raitings) {
    var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < raitings.length; i++) {
        var r = raitings[i];
        if (r > max) {
            maxIndex = i;
            max = r;
        }
    }

    return indexToCommand[maxIndex];
}

function getSelfSnakeSize(board) {
    var size = 0;
    var parts = [
        ELEMENT.BODY_HORIZONTAL, ELEMENT.BODY_LEFT_DOWN, ELEMENT.BODY_LEFT_UP,
        ELEMENT.BODY_RIGHT_DOWN, ELEMENT.BODY_RIGHT_UP, ELEMENT.BODY_VERTICAL,
        ELEMENT.TAIL_END_DOWN, ELEMENT.TAIL_END_LEFT, ELEMENT.TAIL_END_RIGHT,
        ELEMENT.TAIL_END_UP, ELEMENT.TAIL_INACTIVE, ELEMENT.HEAD_DEAD,
        ELEMENT.HEAD_DOWN, ELEMENT.HEAD_EVIL, ELEMENT.HEAD_FLY, ELEMENT.HEAD_LEFT,
        ELEMENT.HEAD_RIGHT, ELEMENT.HEAD_SLEEP, ELEMENT.HEAD_UP
    ];

    for (var i = 0; i < board.length; i++){
        if (parts.indexOf(board[i]) !== -1) {
            size++;
        }
    }

    return size;
}
