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
    isGameOver, getHeadPosition, getElementByXY, getXYByPosition, getPaths, getAt,
    isEnemy, inFury, findSnakes, inFly, isWalkable
} from './utils';

var CONSUMABLE_ELEMENTS = [
    ELEMENT.APPLE, ELEMENT.GOLD, ELEMENT.FLYING_PILL, ELEMENT.FURY_PILL//, ELEMENT.STONE
];

const MAX_SEARCH = 3;
const STONE_EATER_MIN_SIZE = 5;
const RATINGS = {
    [ELEMENT.NONE]: 0,
    [ELEMENT.FLYING_PILL]: 1,
    [ELEMENT.FURY_PILL]: 10,
    [ELEMENT.STONE]: 5,
    [ELEMENT.APPLE]: 5,
    [ELEMENT.GOLD]: 7,

    [ELEMENT.ENEMY_HEAD_DEAD]: 20,
    [ELEMENT.ENEMY_HEAD_DOWN]: 20,
    // [ELEMENT.ENEMY_HEAD_EVIL]: 20,
    [ELEMENT.ENEMY_HEAD_FLY]: 20,
    [ELEMENT.ENEMY_HEAD_LEFT]: 20,
    [ELEMENT.ENEMY_HEAD_RIGHT]: 20,
    [ELEMENT.ENEMY_HEAD_SLEEP]: 20,
    [ELEMENT.ENEMY_HEAD_UP]: 20,

    [ELEMENT.ENEMY_BODY_HORIZONTAL]: 15,
    [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 15,
    [ELEMENT.ENEMY_BODY_LEFT_UP]: 15,
    [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 15,
    [ELEMENT.ENEMY_BODY_RIGHT_UP]: 15,
    [ELEMENT.ENEMY_BODY_VERTICAL]: 15,

    // [ELEMENT.ENEMY_TAIL_END_DOWN]: 10,
    // [ELEMENT.ENEMY_TAIL_END_LEFT]: 10,
    // [ELEMENT.ENEMY_TAIL_END_RIGHT]: 10,
    // [ELEMENT.ENEMY_TAIL_END_UP]: 10,
};

function getSafeElements(board) {
    const safeElements = [
        ELEMENT.NONE, ELEMENT.FLYING_PILL, ELEMENT.FURY_PILL, ELEMENT.APPLE, ELEMENT.GOLD,
        ELEMENT.TAIL_END_DOWN, ELEMENT.TAIL_END_LEFT, ELEMENT.TAIL_END_RIGHT, ELEMENT.TAIL_END_UP,
        ELEMENT.TAIL_INACTIVE, ELEMENT.ENEMY_TAIL_END_DOWN, ELEMENT.ENEMY_TAIL_END_LEFT, ELEMENT.ENEMY_TAIL_END_RIGHT,
        ELEMENT.ENEMY_TAIL_END_UP, ELEMENT.ENEMY_TAIL_INACTIVE
    ];

    if (inFury(board) || inFly(board)){
        safeElements.push(
            ELEMENT.ENEMY_HEAD_DEAD,
            ELEMENT.ENEMY_HEAD_DOWN,
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
            ELEMENT.ENEMY_BODY_VERTICAL
        );
    }

    if (getSelfSnakeSize(board) >= 5) safeElements.push(ELEMENT.STONE);

    return safeElements;
}

function getDistance(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));

    const snakeSize = getSelfSnakeSize(board);
    const stonesEatable = canEatStone(board);
    const consumables = getConsumables(board, stonesEatable);

    // Add vulnarable snakes as targets
    const enemySnakes = findSnakes(board);
    enemySnakes.filter(snake => {
        if (snake.fury && !inFury(board)) return false;
        if (snake.fly && inFly(board)) return false;
        if (getDistance(snake.head, headPosition) > 4) return false;
        if (snakeSize - snake.points.length < 2) return false;
        return true;
    }).forEach(snake => consumables.push({ point:snake.head, element:snake.headElement }));

    // Sort by distance and rate - higher rate will give priority over distance
    consumables.sort((c1, c2) => {
        const distance_rate1 = Math.abs(c1.point.x - headPosition.x) + Math.abs(c1.point.y - headPosition.y);// - rateElement(c1.element);
        const distance_rate2 = Math.abs(c2.point.x - headPosition.x) + Math.abs(c2.point.y - headPosition.y);// - rateElement(c2.element);

        return distance_rate1 - distance_rate2 || rateElement(c2.element) - rateElement(c1.element);
    });

    let current_path;

    for (let i = 0; i < consumables.length && i < MAX_SEARCH; i++) {
        const item = consumables[i];
        const paths = getPaths(board, headPosition.x, headPosition.y, item.point.x, item.point.y, stonesEatable);
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

        const command = correctBackFlip(board, getCommandByPoints(headPosition, point));

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


    const safeElements = getSafeElements(board);
    const raitings = sorround.map(element => safeElements.indexOf(element) != -1 ? element : ELEMENT.WALL).map(rateElement);
    logger('Raitings:' + JSON.stringify(raitings));

    const command = correctBackFlip(board, getCommandByRaitings(raitings));



    return command;
}


function canEatStone(board) {
    return inFury(board) || getSelfSnakeSize(board) >= STONE_EATER_MIN_SIZE;
}

function isDeadEnd(board, point) {
    return getSorround(board, point).filter(element => {
        return element === ELEMENT.STONE || element === ELEMENT.START_FLOOR;
    }).length >= 2;
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

function getPointFromCommand(command, headPosition) {
    switch (command) {
        case COMMANDS.UP:
            return { x: headPosition.x, y: headPosition.y - 1 };
        case COMMANDS.DOWN:
            return { x: headPosition.x, y: headPosition.y - 1 };
        case COMMANDS.LEFT:
            return { x: headPosition.x - 1, y: headPosition.y };
        case COMMANDS.RIGHT:
            return { x: headPosition.x + 1, y: headPosition.y };

    }
}

function correctBackFlip(board, command) {
    const target = getPointFromCommand(command, getHeadPosition(board));
    const element = getAt(board, target.x, target.y);
    const TAILS = [
        ELEMENT.TAIL_END_DOWN,
        ELEMENT.TAIL_END_LEFT,
        ELEMENT.TAIL_END_RIGHT,
        ELEMENT.TAIL_END_UP
    ];
    if (TAILS.indexOf(element) !== -1 && getSelfSnakeSize(board) == 2) {
        if (command == COMMANDS.UP || command == COMMANDS.DOWN) {
            return [COMMANDS.LEFT, command].join(',');
        }
        else {
            return [COMMANDS.UP, command].join(',');
        }
    }
    else return command;
}

function getConsumables(board, canEatStones) {
    const items = [];
    for (let i = 0; i < board.length; i++) {
        const element = board[i];
        const point = getXYByPosition(board, i);
        if (isDeadEnd(board, point)) {
            continue;
        }

        if (CONSUMABLE_ELEMENTS.indexOf(element) !== -1) {
            items.push({
                point,
                element
            });
        }
        else if (element === ELEMENT.STONE && canEatStones) {
            items.push({
                point,
                element
            });
        }
        else if (isEnemy(element) && inFury(board)) {
            items.push({
                point,
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
