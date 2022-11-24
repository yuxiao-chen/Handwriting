Function.prototype.callPolyfill = function (ctx, ...args) {
    ctx = typeof ctx === 'undefined' ? window : ctx
    const key = Symbol()
    ctx[key] = this
    const res = ctx[key](...args)
    delete ctx[key]
    return res
}

Function.prototype.callPolyfill2 = function (ctx) {
    ctx = typeof ctx === 'undefined' ? window : ctx
    const key = '__call_fn_' + +new Date()
    ctx[key] = this
    const args = []
    for (let i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']')
    }
    const res = eval('ctx[' + key + ']' + '(' + args + ')')
    delete ctx[key]
    return res
}

Function.prototype.applyPolyfill = function (ctx, args = []) {
    if (!Array.isArray(args)) {
        throw TypeError('args must be a arrayLike')
    }
    ctx = typeof ctx === 'undefined' ? window : ctx
    const key = Symbol()
    ctx[key] = this
    const res = ctx[key](...args)
    delete ctx[key]
    return res
}

Function.prototype.bindPolyfill = function (ctx, ...args) {
    const fn = this
    delete ctx[key]
    return function (...args2) {
        return fn.apply(ctx, [...args, ...args2])
    }
}
