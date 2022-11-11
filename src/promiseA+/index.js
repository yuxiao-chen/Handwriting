const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'reject'

const resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    let called
    // 判断是否给resolve 传入的是一个promise, 如果是的话，继续调用 resolvePromise
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            const then = x.then
            if (typeof then === 'function') {
                then.call(x, (v) => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, v, resolve, reject)
                }, (r) => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                if (called) return
                called = true
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error)
        }
    } else {
        resolve(x)
    }

}
class CusPromise {
    status = PENDING
    value
    reason
    onResolvedCallbacks = []
    onRejectedCallbacks = []
    constructor(executor) {
        let resolve = (value) => {
            if (this.status !== PENDING) return

            // 如果resolve接收的是一个promise
            if (value instanceof CusPromise) {
                return value.then(resolve, reject)
            }

            this.value = value
            this.status = FULFILLED
            this.onResolvedCallbacks.forEach(fn => fn())
        }
        let reject = (value) => {
            if (this.status !== PENDING) return
            this.value = value
            this.status = REJECTED
            this.onRejectedCallbacks.forEach(fn => fn())
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulFiled, onRejected) {
        onFulFiled = typeof onFulFiled === 'function' ? onFulFiled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

        const promise2 = new CusPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulFiled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)

                    }

                }, 0)
            } else {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulFiled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)

                        }

                    }, 0)
                })
            }
        })
        return promise2
    }
}

CusPromise.defer = CusPromise.deferred = function () {
    let dfd = {};
    dfd.promise = new CusPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}


module.exports = CusPromise