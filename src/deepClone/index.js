function getTypeTag(target) { return Object.prototype.toString.call(target) }
const tags = [
    'Object', 'Arguments', 'Error', 'Symbol', 'RegExp', 'Map', 'Set', 'Array', 'Date'
].map((tagStr) => `[object ${tagStr}]`)
const deepTags = [tags.Map, tags.Set, tags.Object, tags.Array, tags.Arguments]


function copyOtherType(target, typeTag) {
    switch (typeTag) {
        case tags.Error:
        case tags.RegExp:
        case tags.Date:
            const Ctr = target.constructor
            return new Ctr(target)
        // NOTE: 似乎并没有必要克隆，如果需要走到这条，需要在 deepClone 卫语句中放开 Symbol
        case tags.Symbol:
            return Object(Symbol.prototype.valueOf.call(target))
        default:
            return null
    }
}

function deepClone(target, map = new Map()) {
    // 基础类型和函数直接返回
    if (typeof target !== 'object' || target === null) return target
    // 防止循环应用
    if (map.get(target)) return map.get(target)

    // 初始化数据对象
    let cloneTarget
    const typeTag = getTypeTag(target)
    if (deepTags.includes(typeTag)) {
        cloneTarget = new target.constructor()
        map.set(target, cloneTarget)
    } else {
        return copyOtherType(target, typeTag)
    }

    switch (typeTag) {
        case tags.Map:
            target.forEach((value, key) => {
                cloneTarget.set(key, deepClone(value))
            });
            break;
        case tags.Set:
            target.forEach((value) => {
                cloneTarget.add(deepClone(value))
            });
            break;
        case tags.Array:
            target.forEach((value) => {
                cloneTarget.push(deepClone(value))
            });
            break;
        default:
            // Object、ArrayLike...
            for (const key in target) {
                if (Object.hasOwnProperty.call(target, key)) {
                    cloneTarget[key] = deepClone(target[key])
                }
            }
            break;
    }
    return cloneTarget
}


