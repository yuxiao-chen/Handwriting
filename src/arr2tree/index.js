/**
 * 数组转树形结构
 */
const arr = [
    { id: 2, name: '部门B', parentId: 0},
    { id: 3, name: '部门C', parentId: 1},
    { id: 1, name: '部门A', parentId: 2},
    { id: 4, name: '部门D', parentId: 1},
    { id: 5, name: '部门E', parentId: 2},
    { id: 6, name: '部门F', parentId: 3},
    { id: 7, name: '部门G', parentId: 2},
    { id: 8, name: '部门H', parentId: 4}
]

function arr2tree(arr) {
    if (!arr?.length) return []

    const idMapping = {}
    const result = []
    const arrCopy = arr.map((item = {}) => {
        const itemCopy = {...item}
        idMapping[item.id] = itemCopy
        return itemCopy
    });
    arrCopy.forEach(item => {
        if (item.parentId === 0) {
            result.push(item)
            return
        }
        if (!idMapping[item.parentId].children) idMapping[item.parentId].children = []
        idMapping[item.parentId].children.push(item)
    });
    return result
}

console.log(JSON.stringify(arr2tree(arr)))
