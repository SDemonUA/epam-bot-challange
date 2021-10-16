const rewire = require("rewire")
const utils = rewire("./utils")
const getIdealPaths = utils.__get__("getIdealPaths")
const _getSurroundCells = utils.__get__("_getSurroundCells")
// @ponicode
describe("utils.getBoardAsString", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getBoardAsString(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getBoardAsString("da7588892")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getBoardAsString("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getBoardAsString(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getBoardAsString("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getBoardAsString(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getBoardAsArray", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getBoardAsArray("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getBoardAsArray(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getBoardAsArray("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getBoardAsArray("da7588892")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getBoardAsArray(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getBoardAsArray(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getBoardSize", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getBoardSize({ length: 10 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getBoardSize({ length: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getBoardSize({ length: 64 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getBoardSize({ length: 16 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getBoardSize({ length: 32 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getBoardSize(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.isGameOver", () => {
    test("0", () => {
        let callFunction = () => {
            utils.isGameOver("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.isGameOver(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.isGameOver("da7588892")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.isGameOver(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.isGameOver("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isGameOver(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.isAt", () => {
    test("0", () => {
        let callFunction = () => {
            utils.isAt("c466a48309794261b64a4f02cfcc3d64", 410, 410, 1000)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.isAt("c466a48309794261b64a4f02cfcc3d64", 4, 70, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.isAt(12345, 50, 400, 10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.isAt("bc23a9d531064583ace8f67dad60f6bb", 320, 400, 1000)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.isAt("c466a48309794261b64a4f02cfcc3d64", 550, 50, 1000)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isAt(undefined, undefined, -Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getAt", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getAt("c466a48309794261b64a4f02cfcc3d64", 1, 50)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getAt(12345, 1, 90)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getAt("bc23a9d531064583ace8f67dad60f6bb", 70, 70)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getAt(12345, 350, 350)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getAt("bc23a9d531064583ace8f67dad60f6bb", 400, 70)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getAt("", -Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.isNear", () => {
    test("0", () => {
        let callFunction = () => {
            utils.isNear(12345, 410, 520, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.isNear("bc23a9d531064583ace8f67dad60f6bb", 400, 0.0, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.isNear("a1969970175", 550, 30, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.isNear("bc23a9d531064583ace8f67dad60f6bb", -10, 90, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.isNear("a1969970175", 10, "bar", true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isNear(undefined, undefined, undefined, false)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.isOutOf", () => {
    test("0", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 9876], [9876, "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64"], ["c466a48309794261b64a4f02cfcc3d64", "da7588892", "bc23a9d531064583ace8f67dad60f6bb"]]
        let callFunction = () => {
            utils.isOutOf(param1, 4, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1 = [["bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb"], ["bc23a9d531064583ace8f67dad60f6bb", "da7588892", "bc23a9d531064583ace8f67dad60f6bb"], [12345, "da7588892", "bc23a9d531064583ace8f67dad60f6bb"]]
        let callFunction = () => {
            utils.isOutOf(param1, 1, 380)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1 = [[9876, "bc23a9d531064583ace8f67dad60f6bb", 12345], [9876, "da7588892", 9876], ["c466a48309794261b64a4f02cfcc3d64", "da7588892", 9876]]
        let callFunction = () => {
            utils.isOutOf(param1, 50, 0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1 = [["da7588892", 12345, "da7588892"], ["bc23a9d531064583ace8f67dad60f6bb", "da7588892", 9876], ["c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb"]]
        let callFunction = () => {
            utils.isOutOf(param1, 520, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", "da7588892", "bc23a9d531064583ace8f67dad60f6bb"], ["da7588892", "bc23a9d531064583ace8f67dad60f6bb", 9876], ["c466a48309794261b64a4f02cfcc3d64", 12345, "bc23a9d531064583ace8f67dad60f6bb"]]
        let callFunction = () => {
            utils.isOutOf(param1, 100, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isOutOf([], NaN, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getHeadPosition", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getHeadPosition("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getHeadPosition(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getHeadPosition(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getHeadPosition("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getHeadPosition("da7588892")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getHeadPosition(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getFirstPositionOf", () => {
    test("0", () => {
        let object = [[10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"], ["foo bar", -0.353, "**text**", 4653]]
        let object2 = [["a", "b", "043", "holasenior"], [-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "holasenior"]]
        let object3 = [["foo bar", -0.353, "**text**", 4653], [-1, 0.5, 1, 2, 3, 4, 5], [10, -45.9, 103.5, 0.955674]]
        let object4 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"]]
        let object5 = [[10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653]]
        let param2 = [object, object2, object3, object4, object5]
        let callFunction = () => {
            utils.getFirstPositionOf(9876, param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object = [[10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"]]
        let object2 = [["a", "b", "043", "holasenior"], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"]]
        let object3 = [["foo bar", -0.353, "**text**", 4653], [10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674]]
        let object4 = [[10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674]]
        let object5 = [[-1, 0.5, 1, 2, 3, 4, 5], [-1, 0.5, 1, 2, 3, 4, 5], [-1, 0.5, 1, 2, 3, 4, 5]]
        let param2 = [object, object2, object3, object4, object5]
        let callFunction = () => {
            utils.getFirstPositionOf(9876, param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object = [[-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "holasenior"], ["a", "b", "043", "holasenior"]]
        let object2 = [[-1, 0.5, 1, 2, 3, 4, 5], [10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"]]
        let object3 = [["a", "b", "043", "holasenior"], [-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "holasenior"]]
        let object4 = [["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"]]
        let object5 = [["a", "b", "043", "holasenior"], [-1, 0.5, 1, 2, 3, 4, 5], [-1, 0.5, 1, 2, 3, 4, 5]]
        let param2 = [object, object2, object3, object4, object5]
        let callFunction = () => {
            utils.getFirstPositionOf("c466a48309794261b64a4f02cfcc3d64", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object = [[10, -45.9, 103.5, 0.955674], ["a", "b", "043", "holasenior"], [10, -45.9, 103.5, 0.955674]]
        let object2 = [["foo bar", -0.353, "**text**", 4653], [-1, 0.5, 1, 2, 3, 4, 5], ["a", "b", "043", "holasenior"]]
        let object3 = [[10, -45.9, 103.5, 0.955674], [-1, 0.5, 1, 2, 3, 4, 5], ["foo bar", -0.353, "**text**", 4653]]
        let object4 = [["foo bar", -0.353, "**text**", 4653], [-1, 0.5, 1, 2, 3, 4, 5], ["foo bar", -0.353, "**text**", 4653]]
        let object5 = [[10, -45.9, 103.5, 0.955674], [-1, 0.5, 1, 2, 3, 4, 5], ["foo bar", -0.353, "**text**", 4653]]
        let param2 = [object, object2, object3, object4, object5]
        let callFunction = () => {
            utils.getFirstPositionOf("c466a48309794261b64a4f02cfcc3d64", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object = [["foo bar", -0.353, "**text**", 4653], ["a", "b", "043", "holasenior"], ["a", "b", "043", "holasenior"]]
        let object2 = [[-1, 0.5, 1, 2, 3, 4, 5], [10, -45.9, 103.5, 0.955674], ["foo bar", -0.353, "**text**", 4653]]
        let object3 = [["foo bar", -0.353, "**text**", 4653], ["foo bar", -0.353, "**text**", 4653], [-1, 0.5, 1, 2, 3, 4, 5]]
        let object4 = [["a", "b", "043", "holasenior"], [10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674]]
        let object5 = [[10, -45.9, 103.5, 0.955674], [10, -45.9, 103.5, 0.955674], [-1, 0.5, 1, 2, 3, 4, 5]]
        let param2 = [object, object2, object3, object4, object5]
        let callFunction = () => {
            utils.getFirstPositionOf("c466a48309794261b64a4f02cfcc3d64", param2)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getFirstPositionOf(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getXYByPosition", () => {
    test("0", () => {
        let param1 = [[12345, "da7588892", 12345], ["da7588892", 9876, 12345], [9876, "da7588892", "da7588892"]]
        let callFunction = () => {
            utils.getXYByPosition(param1, -10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", "da7588892", 12345], [12345, "da7588892", "da7588892"], ["c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 9876]]
        let callFunction = () => {
            utils.getXYByPosition(param1, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1 = [["bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb"], ["bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", 9876], [9876, "da7588892", "c466a48309794261b64a4f02cfcc3d64"]]
        let callFunction = () => {
            utils.getXYByPosition(param1, 8)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", "da7588892", 9876], ["bc23a9d531064583ace8f67dad60f6bb", 9876, "bc23a9d531064583ace8f67dad60f6bb"], [9876, "da7588892", 9876]]
        let callFunction = () => {
            utils.getXYByPosition(param1, 3600)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1 = [["da7588892", "bc23a9d531064583ace8f67dad60f6bb", "da7588892"], ["bc23a9d531064583ace8f67dad60f6bb", 12345, 12345], [9876, "da7588892", "da7588892"]]
        let callFunction = () => {
            utils.getXYByPosition(param1, -10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getXYByPosition(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getElementByXY", () => {
    test("0", () => {
        let param1 = [["da7588892", "bc23a9d531064583ace8f67dad60f6bb", 9876], ["da7588892", "da7588892", 12345], [12345, 12345, "da7588892"]]
        let callFunction = () => {
            utils.getElementByXY(param1, { y: 30, x: 90 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1 = [["bc23a9d531064583ace8f67dad60f6bb", 9876, "da7588892"], ["c466a48309794261b64a4f02cfcc3d64", "da7588892", 9876], [9876, 12345, "da7588892"]]
        let callFunction = () => {
            utils.getElementByXY(param1, { y: 320, x: -1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1 = [["bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", 12345], ["da7588892", "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb"], ["bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb"]]
        let callFunction = () => {
            utils.getElementByXY(param1, { y: 0.0, x: 1 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1 = [["da7588892", "da7588892", 12345], [9876, "da7588892", "bc23a9d531064583ace8f67dad60f6bb"], [9876, "bc23a9d531064583ace8f67dad60f6bb", 9876]]
        let callFunction = () => {
            utils.getElementByXY(param1, { y: 30, x: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1 = [["da7588892", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64"], ["c466a48309794261b64a4f02cfcc3d64", "da7588892", "c466a48309794261b64a4f02cfcc3d64"], [9876, 9876, 9876]]
        let callFunction = () => {
            utils.getElementByXY(param1, { y: 1, x: 50 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getElementByXY(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getPaths", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getPaths("bc23a9d531064583ace8f67dad60f6bb", 30, 350, 0.0, 1, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getPaths("c466a48309794261b64a4f02cfcc3d64", 90, 410, 100, -10, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getPaths(9876, 320, 410, -10, 10, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getPaths(9876, 400, 410, 0.0, -1, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getPaths("c466a48309794261b64a4f02cfcc3d64", 520, 50, -1, 0, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getPaths(undefined, undefined, -Infinity, -Infinity, -Infinity, false)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.isWalkable", () => {
    test("0", () => {
        let callFunction = () => {
            utils.isWalkable("bc23a9d531064583ace8f67dad60f6bb", 1, 400, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.isWalkable("c466a48309794261b64a4f02cfcc3d64", 50, 410, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.isWalkable(9876, 320, 90, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.isWalkable(12345, 550, 320, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.isWalkable(9876, 70, 410, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isWalkable(undefined, Infinity, Infinity, true)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.inFury", () => {
    test("0", () => {
        let callFunction = () => {
            utils.inFury("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.inFury("da7588892")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.inFury("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.inFury(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.inFury(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.inFury(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.inFly", () => {
    test("0", () => {
        let callFunction = () => {
            utils.inFly("da7588892")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.inFly("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.inFly("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.inFly(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.inFly(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.inFly(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.getSnakeModifiers", () => {
    test("0", () => {
        let callFunction = () => {
            utils.getSnakeModifiers("da7588892", 520, 4)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.getSnakeModifiers("bc23a9d531064583ace8f67dad60f6bb", 400, 30)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.getSnakeModifiers("c466a48309794261b64a4f02cfcc3d64", 350, 520)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.getSnakeModifiers("da7588892", 1, 520)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.getSnakeModifiers(12345, 1, 4)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.getSnakeModifiers(undefined, -Infinity, -Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.isEnemy", () => {
    test("0", () => {
        let callFunction = () => {
            utils.isEnemy([true, true, true, true, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            utils.isEnemy([true, true, false, true, true, true])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            utils.isEnemy([false, false, true, false, false, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            utils.isEnemy([true, false, false, false, true, true])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            utils.isEnemy([true, false, false, true, true, false])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.isEnemy(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getIdealPaths", () => {
    test("0", () => {
        let callFunction = () => {
            getIdealPaths(987650, 4, 410, 380, 380, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            getIdealPaths("a1969970175", 320, 50, 410, 350, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            getIdealPaths(12345, 90, 50, 410, 520, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            getIdealPaths("bc23a9d531064583ace8f67dad60f6bb", 30, 30, 400, 30, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            getIdealPaths(12, 400, 4, 50, 550, true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            getIdealPaths(NaN, NaN, undefined, NaN, NaN, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("_getSurroundCells", () => {
    test("0", () => {
        let callFunction = () => {
            _getSurroundCells(-1, 0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            _getSurroundCells(10, 350)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            _getSurroundCells(100, 10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            _getSurroundCells(-1, 1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            _getSurroundCells(0, 320)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            _getSurroundCells(NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("utils.findSnakes", () => {
    test("0", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", 12345, "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", 9876, 12345, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64"], ["da7588892", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", 12345, "c466a48309794261b64a4f02cfcc3d64", "da7588892", 9876, 9876], ["da7588892", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", 12345, 12345, 12345, "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb"], ["da7588892", 12345, "da7588892", 9876, "c466a48309794261b64a4f02cfcc3d64", "da7588892", "da7588892", "da7588892"], ["da7588892", 12345, "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "da7588892", "c466a48309794261b64a4f02cfcc3d64", "da7588892", "da7588892"], ["da7588892", 12345, 9876, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 9876, "da7588892", 9876], [9876, "bc23a9d531064583ace8f67dad60f6bb", 12345, 9876, 9876, 12345, 12345, 9876], [12345, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "da7588892", 9876, 12345, "da7588892"]]
        let callFunction = () => {
            utils.findSnakes(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1 = [[12345, "bc23a9d531064583ace8f67dad60f6bb", 12345, 12345, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "da7588892", 9876], ["bc23a9d531064583ace8f67dad60f6bb", 9876, 9876, 9876, "da7588892", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 12345], ["da7588892", "c466a48309794261b64a4f02cfcc3d64", 12345, 12345, "da7588892", 12345, 12345, "da7588892"], [9876, "da7588892", 9876, 12345, "c466a48309794261b64a4f02cfcc3d64", 9876, 12345, "c466a48309794261b64a4f02cfcc3d64"], ["bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", 12345, 12345, "da7588892", "bc23a9d531064583ace8f67dad60f6bb", "da7588892", "bc23a9d531064583ace8f67dad60f6bb"], [9876, 12345, "bc23a9d531064583ace8f67dad60f6bb", "da7588892", "c466a48309794261b64a4f02cfcc3d64", 12345, "c466a48309794261b64a4f02cfcc3d64", 9876], ["da7588892", "bc23a9d531064583ace8f67dad60f6bb", "da7588892", 9876, "bc23a9d531064583ace8f67dad60f6bb", 12345, 12345, 9876], [12345, "da7588892", "bc23a9d531064583ace8f67dad60f6bb", 9876, 9876, "da7588892", 12345, 12345]]
        let callFunction = () => {
            utils.findSnakes(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", "da7588892", "da7588892", 12345, 9876, "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", 9876], [12345, "da7588892", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", 9876, "c466a48309794261b64a4f02cfcc3d64"], ["bc23a9d531064583ace8f67dad60f6bb", 12345, 12345, "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", 12345, 9876, 12345], ["bc23a9d531064583ace8f67dad60f6bb", "da7588892", "da7588892", 9876, "da7588892", "da7588892", "da7588892", 12345], ["bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "da7588892", 12345, "c466a48309794261b64a4f02cfcc3d64", 9876, "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb"], ["da7588892", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "da7588892", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "da7588892"], ["c466a48309794261b64a4f02cfcc3d64", 9876, 9876, 9876, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 12345, 9876], ["da7588892", "c466a48309794261b64a4f02cfcc3d64", 9876, "c466a48309794261b64a4f02cfcc3d64", "da7588892", 12345, "bc23a9d531064583ace8f67dad60f6bb", "da7588892"]]
        let callFunction = () => {
            utils.findSnakes(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 12345, "da7588892", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "da7588892", "da7588892"], [9876, "da7588892", 9876, "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", 12345, 9876, 12345], [9876, "da7588892", "da7588892", "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb"], [12345, 12345, 12345, "bc23a9d531064583ace8f67dad60f6bb", 9876, "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb"], ["bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "da7588892", "da7588892", "bc23a9d531064583ace8f67dad60f6bb"], ["bc23a9d531064583ace8f67dad60f6bb", 12345, 9876, "bc23a9d531064583ace8f67dad60f6bb", "bc23a9d531064583ace8f67dad60f6bb", "da7588892", "c466a48309794261b64a4f02cfcc3d64", "da7588892"], ["bc23a9d531064583ace8f67dad60f6bb", 12345, 12345, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 9876, 12345, "bc23a9d531064583ace8f67dad60f6bb"], ["da7588892", 12345, 9876, 9876, 12345, "bc23a9d531064583ace8f67dad60f6bb", 12345, 9876]]
        let callFunction = () => {
            utils.findSnakes(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1 = [["c466a48309794261b64a4f02cfcc3d64", 9876, 12345, 12345, 12345, 12345, "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64"], [12345, "c466a48309794261b64a4f02cfcc3d64", 12345, "da7588892", 12345, 9876, "da7588892", 9876], [12345, "da7588892", 12345, "c466a48309794261b64a4f02cfcc3d64", 9876, 9876, "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64"], ["bc23a9d531064583ace8f67dad60f6bb", "da7588892", "da7588892", 9876, "da7588892", "da7588892", "c466a48309794261b64a4f02cfcc3d64", 9876], [9876, 9876, "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", 12345, 12345, "da7588892", "c466a48309794261b64a4f02cfcc3d64"], [9876, 9876, "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", 9876], ["c466a48309794261b64a4f02cfcc3d64", "da7588892", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 12345, "da7588892", 9876, "c466a48309794261b64a4f02cfcc3d64"], ["da7588892", 9876, "da7588892", "da7588892", "bc23a9d531064583ace8f67dad60f6bb", "c466a48309794261b64a4f02cfcc3d64", "c466a48309794261b64a4f02cfcc3d64", 9876]]
        let callFunction = () => {
            utils.findSnakes(param1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            utils.findSnakes(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
