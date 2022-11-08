function New() {
    const fn = arguments[0]
    const args = Array.prototype.slice.call(arguments, 1)
    const obj = {}
    if (typeof fn !== 'function') return obj

    obj.__proto__ = fn.prototype
    fn.apply(obj, args)

    return obj
}

function Cat (name) {
    this.name = name || 'cat'
}

console.log(New(Cat, 'cat1'))