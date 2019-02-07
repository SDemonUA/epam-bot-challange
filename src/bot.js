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
    isEnemy, inFury, findSnakes, inFly, getBoardSize
} from './utils';

var CONSUMABLE_ELEMENTS = [
    ELEMENT.APPLE, ELEMENT.GOLD, ELEMENT.FLYING_PILL, ELEMENT.FURY_PILL//, ELEMENT.STONE
];

const MAX_SEARCH = 5;
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

let hasStone = false;
let furyTicks = 0;
let flyTicks = 0;
let enemySnakes = null;

function resetState() {
    console.log('RESET');
    hasStone = false;
    furyTicks = 0;
    flyTicks = 0;
    enemySnakes = null;
}

let valueMap = [];

export function getNextSnakeMove(board, logger) {
    valueMap = [];

    if (isGameOver(board)) {
        resetState();
        return '';
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        resetState();
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));

    if (board.indexOf(ELEMENT.HEAD_SLEEP) != -1) { // New game started
        resetState();
    }

    if (furyTicks) {
        furyTicks--;
    }

    if (flyTicks) {
        flyTicks--;
    }

    enemySnakes = findSnakes(board);
    board = markDangerZone(board, enemySnakes);

    const snakeSize = getSelfSnakeSize(board);
    const stonesEatable = canEatStone(board);
    const consumables = getConsumables(board, stonesEatable);

    // Add vulnarable snakes as targets
    enemySnakes.filter(snake => {
        if (snake.fury != !inFury(board) && snake.fury) return false;
        if (snake.fly != inFly(board)) return false;
        if (snakeSize - snake.points.length < 2 && !inFury(board)) return false;

        logger('Eatable snake on distance: (' + getDistance(snake.head, headPosition) + ') , head position: ' + JSON.stringify(snake.head));
        if (getDistance(snake.head, headPosition) > 8) return false;

        return true;
    }).forEach(snake => {
        if (!inFury(board)) {
            consumables.push({ point: snake.head, element: snake.headElement })
        }
        else {
            const canEatWhole = !snake.fury || snakeSize - snake.points.length >= 2;
            (canEatWhole ? snake.points : snake.points.slice(1)).map( point => consumables.push({ point, element:getElementByXY(board, point) }))
        }
    });

    // Sort by distance and rate - higher rate will give priority over distance
    consumables.sort((c1, c2) => {
        const distance_rate1 = Math.abs(c1.point.x - headPosition.x) + Math.abs(c1.point.y - headPosition.y) - rateElement(c1.element);
        const distance_rate2 = Math.abs(c2.point.x - headPosition.x) + Math.abs(c2.point.y - headPosition.y) - rateElement(c2.element);

        return distance_rate1 - distance_rate2;// || rateElement(c2.element) - rateElement(c1.element);
    });

    let current_path;

    const paths = findPaths(board, headPosition, consumables.map(cons => cons.point));
    if (!paths.length || !paths[0] || !paths[0].length) {
        logger('No path to was found');
    }
    else {
        const point = paths[0][paths[0].length - 1];
        const element = getElementByXY(board, point);
        current_path = {
            path: paths[0],
            rating: rateElement(element),
            element: element,
            point: point
        }
    }
    // for (let i = 0; i < consumables.length && i < MAX_SEARCH; i++) {
    //     const item = consumables[i];
    //     const paths = getPaths(board, headPosition.x, headPosition.y, item.point.x, item.point.y, stonesEatable);
    //     const rating = rateElement(item.element);

    //     // console.log('Distance:', Math.abs(item.point.x - headPosition.x) + Math.abs(item.point.y - headPosition.y), item.element);

    //     if (!paths.length) {
    //         logger('No path to ' + JSON.stringify(item));
    //         continue;
    //     }

    //     if (
    //         !current_path ||
    //         paths[0].length - rating < current_path.path.length - current_path.rating
    //     ) {
    //         current_path = {
    //             path: paths[0],
    //             rating: rating,
    //             element: item.element,
    //             point: item.point
    //         }
    //     }
    // }

    let command = '';
    if (current_path) {
        const point = current_path.path[0]/* {
            x: current_path.path[0][0],
            y: current_path.path[0][1]
        } */;

        command = getCommandByPoints(headPosition, point);
        logger('Winned path ' + current_path.element + ' ' + JSON.stringify(current_path.point) + ' ' + JSON.stringify(current_path.path));

        // if (command) {
        //     return command;
        // }
        // else if (current_path.path.length > 1){
        //     return getCommandByPoints(headPosition, {
        //         x: current_path.path[1][0],
        //         y: current_path.path[1][1]
        //     })
        // }
    }

    if (!command) {
        logger('Warning: no desicition for move was made.\n'+ JSON.stringify(current_path)+'\n'+ JSON.stringify(consumables));

        const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
        logger('Sorround: ' + JSON.stringify(sorround));

        const safeElements = getSafeElements(board);
        const raitings = sorround
            .map((el, i) => {
                var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
                if (isDeadEnd(board, getPointFromCommand(board, indexToCommand[i]))) {
                    return null;
                }
                return el;
            })
            .map(element => safeElements.indexOf(element) != -1 ? element : ELEMENT.WALL)
            .map(rateElement);
        logger('Raitings:' + JSON.stringify(raitings));

        command = getCommandByRaitings(raitings);
    }

    command = correctBackFlip(board, command);

    const nextPoint = getPointFromCommand(command, headPosition);
    switch (getElementByXY(board, nextPoint)) {
        case ELEMENT.STONE:
            hasStone = true;
            break;
        case ELEMENT.FURY_PILL:
            furyTicks = 10;
            break;
        case ELEMENT.FLYING_PILL:
            flyTicks = 10;
            break;
        default:
            break;
    }
    logger(`Next move ` + JSON.stringify(nextPoint));
    logger(`Has stone: ${hasStone}, fury ticks: ${furyTicks}, fly ticks: ${flyTicks}`);

    return command;
}


function canEatStone(board) {
    return inFury(board) || getSelfSnakeSize(board) >= STONE_EATER_MIN_SIZE;
}

function isDeadEnd(board, point) {
    return getSorround(board, point).filter(element => {
        return element === ELEMENT.WALL || element === ELEMENT.START_FLOOR;
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
            return { x: headPosition.x, y: headPosition.y + 1 };
        case COMMANDS.LEFT:
            return { x: headPosition.x - 1, y: headPosition.y };
        default:
        case COMMANDS.RIGHT:
            return { x: headPosition.x + 1, y: headPosition.y };
    }
}

/** @deprecated */
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
        // else if (isEnemy(element) && inFury(board)) {
        //     items.push({
        //         point,
        //         element
        //     });
        // }
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

function getSorroundPoints(point, boardSize) {
    const points = [];
    if (point.y != 0) points.push({ x: point.x, y: point.y - 1 });
    if (point.y != boardSize) points.push({ x: point.x, y: point.y + 1 });
    if (point.x != 0) points.push({ x: point.x - 1, y: point.y });
    if (point.x != boardSize) points.push({ x: point.x + 1, y: point.y });
    return points;
}

function markDangerZone(board, enemySnakes) {
    const safeSnakeSize = getSelfSnakeSize(board) + 1;
    const headPosition = getHeadPosition(board);
    const boardSize = getBoardSize(board);
    enemySnakes.filter(snake => {
        if (furyTicks < getDistance(headPosition, snake.head) != snake.fury) {
            return snake.fury;
        }

        return snake.points.length > safeSnakeSize;
    }).forEach(snake => {
        const firstCircle = getSorroundPoints(snake.head, boardSize);
        const secondSircle = firstCircle.concat.apply(firstCircle, firstCircle.map(p => getSorroundPoints(p, boardSize)));

        secondSircle.forEach( point => {
            const position = point.x + point.y * boardSize;
            const element = board[position];
            if (element == ELEMENT.FURY_PILL && getDistance(point, headPosition) < getDistance(point, snake.head)) {
                return;
            }

            board[position] = ELEMENT.WALL;
        })
    });

    return board;
}

/**
 *
 * @param {String} board Game board
 * @param {{x:number, y:number}} start Starting point
 * @param {{x:number, y:number}[]} ends End points
 */
function findPaths(board, start, ends) {
    const boardSize = getBoardSize(board);
    /** @type number[][] */
    const valueMap = [];
    for (let i = 0; i < boardSize; i++) valueMap[i] = [];

    const points = [
        {
            point: start,
            snakeSize: getSelfSnakeSize(board),
            value: 0
        }
    ];

    valueMap[start.x][start.y] = 0;

    let max = 10000;
    while (points.length) {
        if (!max--) {
            debugger;
            break;
        };
        let { point, snakeSize, value } = points.shift();

        if (ends.every(p => typeof valueMap[p.x][p.y] !== 'undefined')) {
            break; // All points found
        }

        switch (getElementByXY(board, point)) {
            case ELEMENT.STONE:
                if (value > furyTicks && value > flyTicks) snakeSize -= 3;
            case ELEMENT.APPLE:
                snakeSize += 1;
        }

        const nextPoints = [
            { point:{ x: point.x, y: point.y - 1}, snakeSize, value:value + 1 },
            { point:{ x: point.x, y: point.y + 1}, snakeSize, value:value + 1 },
            { point:{ x: point.x - 1, y: point.y}, snakeSize, value:value + 1 },
            { point:{ x: point.x + 1, y: point.y}, snakeSize, value:value + 1 }
        ];

        nextPoints
            .filter(({point}) => point.x >= 0 && point.y >= 0 && point.x < boardSize && point.y < boardSize)
            .filter(({ point, snakeSize, value }) => {
                return typeof valueMap[point.x][point.y] === 'undefined' &&
                    isWalkable(board, point, snakeSize, value);
            })
            .forEach(p => {
                valueMap[p.point.x][p.point.y] = p.value;
                points.push(p)
            });
    }

    const paths = [];

    for (let i = 0; i < ends.length; i++) {
        const end = ends[i];

        if (typeof valueMap[end.x][end.y] === 'undefined') {
            continue; // This point unreachable
        }

        const path = [end];

        for (let j = 0; j < path.length; j++) {
            const point = path[j];
            const surroundPoints = [
                { x: point.x, y: point.y - 1 },
                { x: point.x, y: point.y + 1 },
                { x: point.x - 1, y: point.y },
                { x: point.x + 1, y: point.y }
            ].filter(p => valueMap[p.x][p.y] < valueMap[point.x][point.y] && valueMap[p.x][p.y])
                .sort((p1, p2) => valueMap[p1.x][p1.y] - valueMap[p2.x][p2.y]);

            if (surroundPoints.length)
                path.push(surroundPoints[0]);
        }

        path.reverse();
        paths.push(path);
    }
    return paths;
}

function isWalkable(board, point, snakeSize, distance) {
    const element = getElementByXY(board, point);

    switch (element) {
        case ELEMENT.START_FLOOR:
        case ELEMENT.WALL:
            return false;

        case ELEMENT.APPLE:
        case ELEMENT.NONE:
        case ELEMENT.GOLD:
        case ELEMENT.FLYING_PILL:
        case ELEMENT.FURY_PILL:
            return true;

        case ELEMENT.TAIL_END_DOWN:
        case ELEMENT.TAIL_END_UP:
        case ELEMENT.TAIL_END_LEFT:
        case ELEMENT.TAIL_END_RIGHT:
        case ELEMENT.TAIL_INACTIVE:
            return snakeSize > 2;

        case ELEMENT.STONE:
            return snakeSize >= 5 || distance < furyTicks;

        case ELEMENT.BODY_HORIZONTAL:
        case ELEMENT.BODY_VERTICAL:
        case ELEMENT.BODY_LEFT_DOWN:
        case ELEMENT.BODY_LEFT_UP:
        case ELEMENT.BODY_RIGHT_DOWN:
        case ELEMENT.BODY_RIGHT_UP:
            return distance < furyTicks && distance > 1;

        case ELEMENT.ENEMY_HEAD_FLY:
            if (distance < flyTicks) return false;
        case ELEMENT.ENEMY_HEAD_EVIL:
            if (distance < furyTicks) return false;
        case ELEMENT.ENEMY_HEAD_DOWN:
        case ELEMENT.ENEMY_HEAD_LEFT:
        case ELEMENT.ENEMY_HEAD_RIGHT:
        case ELEMENT.ENEMY_HEAD_UP:
        case ELEMENT.ENEMY_HEAD_SLEEP:
            const snake = getSnakeByPoint(point);
            if (!snake) {
                console.warn(`No snake at point ${JSON.stringify(point)} with element "${element}"`);
                return false;
            }

            if (
                snake.fury == distance < furyTicks &&
                snakeSize - snake.points.length < 2
            ) return false;

            return true;

        case ELEMENT.ENEMY_BODY_HORIZONTAL:
        case ELEMENT.ENEMY_BODY_LEFT_DOWN:
        case ELEMENT.ENEMY_BODY_LEFT_UP:
        case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
        case ELEMENT.ENEMY_BODY_RIGHT_UP:
        case ELEMENT.ENEMY_BODY_VERTICAL:

        case ELEMENT.ENEMY_TAIL_END_DOWN:
        case ELEMENT.ENEMY_TAIL_END_UP:
        case ELEMENT.ENEMY_TAIL_END_LEFT:
        case ELEMENT.ENEMY_TAIL_END_RIGHT:
        case ELEMENT.ENEMY_TAIL_INACTIVE:
            return distance < furyTicks;

        case ELEMENT.ENEMY_HEAD_DEAD:
        default:
            return false;
    }
}

function getSnakeByPoint(point) {
    if (!enemySnakes) return null;
    return enemySnakes.find(snake => snake.points.some(snakePoint => {
        return point.x == snakePoint.x && point.y == snakePoint.y
    }));
}
