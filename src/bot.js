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
    ELEMENT.APPLE, ELEMENT.GOLD, ELEMENT.FURY_PILL//, ELEMENT.FLYING_PILL //, ELEMENT.STONE
];

const MAX_SEARCH = 5;
const STONE_EATER_MIN_SIZE = 5;
const RATINGS = {
    [ELEMENT.NONE]: 0,
    [ELEMENT.FLYING_PILL]: 0,
    [ELEMENT.FURY_PILL]: 15,
    [ELEMENT.STONE]: 5,
    [ELEMENT.APPLE]: 5,
    [ELEMENT.GOLD]: 5,

    [ELEMENT.ENEMY_HEAD_DEAD]: 20,
    [ELEMENT.ENEMY_HEAD_DOWN]: 20,
    [ELEMENT.ENEMY_HEAD_EVIL]: 15,
    [ELEMENT.ENEMY_HEAD_FLY]: 20,
    [ELEMENT.ENEMY_HEAD_LEFT]: 20,
    [ELEMENT.ENEMY_HEAD_RIGHT]: 20,
    [ELEMENT.ENEMY_HEAD_SLEEP]: 20,
    [ELEMENT.ENEMY_HEAD_UP]: 20,

    [ELEMENT.ENEMY_BODY_HORIZONTAL]: 18,
    [ELEMENT.ENEMY_BODY_LEFT_DOWN]: 18,
    [ELEMENT.ENEMY_BODY_LEFT_UP]: 18,
    [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: 18,
    [ELEMENT.ENEMY_BODY_RIGHT_UP]: 18,
    [ELEMENT.ENEMY_BODY_VERTICAL]: 18,

    // [ELEMENT.ENEMY_TAIL_END_DOWN]: 10,
    // [ELEMENT.ENEMY_TAIL_END_LEFT]: 10,
    // [ELEMENT.ENEMY_TAIL_END_RIGHT]: 10,
    // [ELEMENT.ENEMY_TAIL_END_UP]: 10,
};

/**
 *
 * @param {String} board
 * @returns {String[]}
 */
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

/**
 *
 * @param {{x:number, y:number}} point1
 * @param {{x:number, y:number}} point2
 * @returns {number}
 */
function getDistance(point1, point2) {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

// State
let stones = 0;
let furyTicks = 0;
let flyTicks = 0;
let enemySnakes = null;
let prevCommand = '';
let tick = 0;

function resetState() {
    stones = 0;
    furyTicks = 0;
    flyTicks = 0;
    enemySnakes = null;
    prevCommand = '';
    tick = 0;
}

function doTick() {
    if (furyTicks) {
        furyTicks--;
    }

    if (flyTicks) {
        flyTicks--;
    }

    tick++;
}

let initialBoardSize;

/**
 *
 * @param {String} board Current board state
 * @param {function} logger Logger function
 * @returns {String}
 */
export function getNextSnakeMove(board, logger) {
    initialBoardSize = board.length;
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

    enemySnakes = findSnakes(board);

    board = markDangerZone(board, enemySnakes);
    console.assert(board.length == initialBoardSize, 'mark danger zone');

    board = denieBackFlip(board, prevCommand);
    console.assert(board.length == initialBoardSize, 'after backflip denie');

    logger(`Snakes ${enemySnakes.length}| ${enemySnakes.map(s => JSON.stringify(s.head) + ' size ' + s.points.length).join(', ')}`);

    const snakeSize = getSelfSnakeSize(board);
    const stonesEatable = canEatStone(board);
    const consumables = getConsumables(board, stonesEatable);

    // Add vulnarable snakes as targets
    enemySnakes.filter(snake => {
        if (snake.fury != !inFury(board) && snake.fury) return false;
        if (snake.fly != inFly(board)) return false;
        if (snakeSize - snake.points.length < 2 && !inFury(board)) return false;

        logger('Eatable snake on distance: ' + getDistance(snake.head, headPosition) + ' , head position: ' + JSON.stringify(snake.head));
        if (getDistance(snake.head, headPosition) > 8) return false;

        return true;
    }).forEach(snake => {
        if (!inFury(board)) {
            consumables.push({ point: snake.head, element: snake.headElement });
            getSorroundPoints(snake.head, getBoardSize(board))
                .filter(p => !isEnemy(getElementByXY(board, p)))
                .filter(p => isWalkable(board, p, snakeSize, getDistance(p, headPosition)))
                .forEach(p => consumables.push({ point: p, element: snake.headElement }));

        }
        else {
            const canEatWhole = !snake.fury || snakeSize - snake.points.length >= 2;
            (canEatWhole ? snake.points : snake.points.slice(1)).map( point => consumables.push({ point, element:getElementByXY(board, point) }))
        }
    });



    let current_path;

    const paths = findPaths(board, headPosition, consumables.map(cons => cons.point));

    // Sort by distance and rate - higher rate will give priority over distance
    paths.sort((p1, p2) => {
        const densityRate1 = consumables.filter(c => getDistance(c.point, p1.path[p1.path.length - 1]) <= 5)
            .map(c => rateElement(c.element))
            .reduce((total, cur) => total + cur, 0) / 2;
        const densityRate2 = consumables.filter(c => getDistance(c.point, p2.path[p2.path.length - 1]) <= 5)
            .map(c => rateElement(c.element))
            .reduce((total, cur) => total + cur, 0) / 2;

        return p1.path.length - p2.path.length + rateElement(p2.target) - rateElement(p1.target) + densityRate2 - densityRate1;
    });

    if (!paths.length) {
        logger('No path to was found');
    }
    else {
        const point = paths[0].path[paths[0].path.length - 1];
        const element = getElementByXY(board, point);
        current_path = {
            path: paths[0].path,
            rating: rateElement(element),
            element: element,
            point: point
        }
    }

    let command = '';
    if (current_path) {
        const point = current_path.path[0]
        command = getCommandByPoints(headPosition, point);
        logger('Winned path ' + current_path.element + ' ' + JSON.stringify(current_path.point) + ' ' + JSON.stringify(current_path.path));
    }

    if (!command) {
        logger('Warning: no desicition for move was made.\n'+ JSON.stringify(current_path)+'\n'+ JSON.stringify(consumables));

        const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
        logger('Sorround: ' + JSON.stringify(sorround));

        const safeElements = getSafeElements(board);
        const raitings = sorround
            .map((el, i) => {
                var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
                if (isDeadEnd(board, getPointFromCommand(indexToCommand[i], headPosition))) {
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

    doTick();

    const nextPoint = getPointFromCommand(command, headPosition);

    prevCommand = command;

    if (stones && furyTicks >= 1 && !flyTicks) {
        command += ',' + COMMANDS.ACT;
        stones--;
    }

    logger(`Has stones: ${stones}, fury ticks: ${furyTicks}, fly ticks: ${flyTicks}, Tick: ${tick}`);

    switch (getElementByXY(board, nextPoint)) {
        case ELEMENT.STONE:
            stones++;
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

    return command;
}

/**
 *
 * @param {String} board
 * @returns {boolean}
 */
function canEatStone(board) {
    return inFury(board) || getSelfSnakeSize(board) >= STONE_EATER_MIN_SIZE;
}

/**
 *
 * @param {String} board
 * @param {{x:number, y:number}} point
 * @returns {boolean}
 */
function isDeadEnd(board, point) {
    return getSorround(board, point).filter(element => {
        return element === ELEMENT.WALL || element === ELEMENT.START_FLOOR;
    }).length >= 2;
}

/**
 *
 * @param {{x:number, y:number}} from
 * @param {{x:number, y:number}} to
 * @returns {String}
 */
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

/**
 *
 * @param {String} command
 * @param {{x:number, y:number}} headPosition
 * @returns {{x:number, y:number}}
 */
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

/**
 *
 * @deprecated
 * @param {String} board
 * @param {String} command
 * @returns {String}
 */
function correctBackFlip(board, command) {
    const target = getPointFromCommand(command, getHeadPosition(board));
    // const element = getAt(board, target.x, target.y);
    // const TAILS = [
    //     ELEMENT.TAIL_END_DOWN,
    //     ELEMENT.TAIL_END_LEFT,
    //     ELEMENT.TAIL_END_RIGHT,
    //     ELEMENT.TAIL_END_UP
    // ];
    if (isSelf(board, target)) {
    // if (TAILS.indexOf(element) !== -1 && getSelfSnakeSize(board) == 2) {
        if (command == COMMANDS.UP || command == COMMANDS.DOWN) {
            return [COMMANDS.LEFT, command].join(',');
        }
        else {
            return [COMMANDS.UP, command].join(',');
        }
    }
    else return command;
}

/**
 *
 * @param {String} board
 * @param {boolean} canEatStones
 * @returns {{point:{x:number, y:number}, element:String}[]}
 */
function getConsumables(board, canEatStones) {
    const items = [];
    const snakeSize = getSelfSnakeSize(board);

    for (let i = 0; i < board.length; i++) {
        const element = board[i];
        const point = getXYByPosition(board, i);

        if (Math.round(point.x) != point.x || Math.round(point.y) != point.y) {
            console.warn('Point', point, 'Position', i, 'Board length', board.length, getBoardSize(board), 'Initial', initialBoardSize);
            point.x = Math.round(point.x);
            point.y = Math.round(point.y);
        }

        if (isDeadEnd(board, point)) {
            continue;
        }

        if (CONSUMABLE_ELEMENTS.indexOf(element) !== -1) {
            items.push({
                point,
                element
            });
        }
        else if (element === ELEMENT.STONE && canEatStones && !flyTicks) {

            // Avoid targeting stones if your snake become smaller than biggest enemy snake
            if (/* tick > 200 &&  */!furyTicks && snakeSize < enemySnakes.reduce(function(max, snake) { return Math.max(max, snake.points.length) }, 0) + 3) {
                continue;
            }

            items.push({
                point,
                element
            });
        }
    }

    return items;
}

/**
 *
 * @param {String} board
 * @param {{x:number, y:number}} position
 * @returns {String[]}
 */
function getSorround(board, position) {
    const p = position;
    return [
        getElementByXY(board, {x: p.x - 1, y: p.y }), // LEFT
        getElementByXY(board, {x: p.x, y: p.y -1 }), // UP
        getElementByXY(board, {x: p.x + 1, y: p.y}), // RIGHT
        getElementByXY(board, {x: p.x, y: p.y + 1 }) // DOWN
    ];
}

/**
 *
 * @param {String} element
 * @returns {number}
 */
function rateElement(element) {
    let rating = RATINGS[element];

    if (typeof rating == undefined) {
        return -1;
    }

    return rating;
}

/**
 *
 * @param {number[]} raitings
 * @returns {String}
 */
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

/**
 *
 * @param {String} board
 * @returns {number}
 */
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

/**
 *
 * @param {{x:number, y:number}} point
 * @param {number} boardSize
 * @returns {{x:number, y:number}[]}
 */
function getSorroundPoints(point, boardSize) {
    const points = [];
    if (point.y > 0) points.push({ x: point.x, y: point.y - 1 });
    if (point.y < boardSize - 1) points.push({ x: point.x, y: point.y + 1 });
    if (point.x > 0) points.push({ x: point.x - 1, y: point.y });
    if (point.x < boardSize - 1) points.push({ x: point.x + 1, y: point.y });
    return points;
}

/**
 *
 * @param {String} board
 * @param {Snake[]} enemySnakes
 * @returns {String}
 */
function markDangerZone(board, enemySnakes) {
    const safeSnakeSize = getSelfSnakeSize(board) - 2;
    const dangerSnakeSize = getSelfSnakeSize(board) + 2;
    const headPosition = getHeadPosition(board);
    const boardSize = getBoardSize(board);

    enemySnakes.filter(snake => {
        if ((furyTicks >= getDistance(headPosition, snake.head)) != snake.fury) {
            return snake.fury;
        }
        return snake.points.length > safeSnakeSize;
    }).forEach(snake => {
        const firstCircle = getSorroundPoints(snake.head, boardSize);

        let dangerArea = firstCircle;
        if (snake.points.length >= dangerSnakeSize) {
            const secondSircle = firstCircle.concat.apply(firstCircle, firstCircle.map(p => getSorroundPoints(p, boardSize)));
            dangerArea = secondSircle;
        }

        dangerArea.forEach(point => {
            const position = point.x + point.y * boardSize;
            const element = board[position];

            if (element == ELEMENT.FURY_PILL && getDistance(point, headPosition) < getDistance(point, snake.head)) {
                return;
            }

            if (isSelf(board, point)) {
                return;
            }

            if (getDistance(point, snake.head) > getDistance(headPosition, snake.head)) {
                return;
            }

            const before = board.length;
            board = board.substring(0, position) + ELEMENT.WALL + board.substring(position + 1);
            console.assert(before == board.length, `Size changed position: ${position}, point: ${JSON.stringify(point)}, size: ${boardSize}`);
        });
    });

    return board;
}

/**
 *
 * @param {String} board
 * @param {String} prevCommand
 * @returns {String}
 */
function denieBackFlip(board, prevCommand) {
    if (!prevCommand) return board;
    const opositeCommand = {
        [COMMANDS.LEFT]: COMMANDS.RIGHT,
        [COMMANDS.RIGHT]: COMMANDS.LEFT,
        [COMMANDS.UP]: COMMANDS.DOWN,
        [COMMANDS.DOWN]: COMMANDS.UP
    }[prevCommand];

    const headPosition = getHeadPosition(board);

    if (!headPosition) return board;

    const point = getPointFromCommand(opositeCommand, headPosition);
    const possition = point.x + point.y * getBoardSize(board);
    return board.substring(0, possition) + ELEMENT.WALL + board.substring(possition + 1);
}

/**
 *
 * @param {String} board Game board
 * @param {{x:number, y:number}} start Starting point
 * @param {{x:number, y:number}[]} ends End points
 * @returns {{path:{x:number, y:number}[], target:String}[]}
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
            console.warn('Max points for wave algorithm reached');
            break;
        };
        let { point, snakeSize, value } = points.shift();

        if (ends.every(p => {
            try {
                return typeof valueMap[p.x][p.y] !== 'undefined'
            }
            catch (e) {
                console.error(e, p);
                console.log(JSON.stringify(valueMap));
            }
            return false;
        })) {
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
        paths.push({path, target:getElementByXY(board, end)});
    }
    return paths;
}

/**
 *
 * @param {String} board
 * @param {{x:number, y:number}} point
 * @param {number} snakeSize
 * @param {number} distance
 * @returns {boolean}
 */
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

/**
 *
 * @param {{x:number, y:number}} point
 * @returns {Snake}
 */
function getSnakeByPoint(point) {
    if (!enemySnakes) return null;
    return enemySnakes.find(snake => snake.points.some(snakePoint => {
        return point.x == snakePoint.x && point.y == snakePoint.y
    }));
}

/**
 *
 * @param {String} board
 * @param {{x:number, y:number}} point
 * @returns {boolean}
 */
function isSelf(board, point) {
    switch (getElementByXY(board, point)) {
        case ELEMENT.HEAD_DEAD:
        case ELEMENT.HEAD_DOWN:
        case ELEMENT.HEAD_EVIL:
        case ELEMENT.HEAD_FLY:
        case ELEMENT.HEAD_LEFT:
        case ELEMENT.HEAD_RIGHT:
        case ELEMENT.HEAD_SLEEP:
        case ELEMENT.HEAD_UP:

        case ELEMENT.BODY_HORIZONTAL:
        case ELEMENT.BODY_LEFT_DOWN:
        case ELEMENT.BODY_LEFT_UP:
        case ELEMENT.BODY_RIGHT_DOWN:
        case ELEMENT.BODY_RIGHT_UP:
        case ELEMENT.BODY_VERTICAL:

        case ELEMENT.TAIL_END_DOWN:
        case ELEMENT.TAIL_END_LEFT:
        case ELEMENT.TAIL_END_RIGHT:
        case ELEMENT.TAIL_END_UP:
        case ELEMENT.TAIL_INACTIVE:
            return true;
        default:
            return false;
    }
}
