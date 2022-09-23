/**
 * 树形结构转数组
 */
const tree = [
    {
        "id": 2,
        "name": "部门B",
        "parentId": 0,
        "children": [
            {
                "id": 1,
                "name": "部门A",
                "parentId": 2,
                "children": [
                    {
                        "id": 3, "name": "部门C", "parentId": 1,
                        "children": [{ "id": 6, "name": "部门F", "parentId": 3 }]
                    },
                    {
                        "id": 4, "name": "部门D", "parentId": 1,
                        "children": [{ "id": 8, "name": "部门H", "parentId": 4 }]
                    }]
            },
            { "id": 5, "name": "部门E", "parentId": 2 },
            { "id": 7, "name": "部门G", "parentId": 2 }
        ]
    }
]

function tree2arr(tree) {
    if (!tree?.length) return []
    const nodes = [...tree]
    const result = []
    while (nodes.length > 0) {
        const { children, ...other } = nodes.shift()
        result.push(other)
        children?.length && nodes.push(...children)
    }

    return result
}

console.dir(tree2arr(tree))
