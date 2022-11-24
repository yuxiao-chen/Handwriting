function throttle(fn, wait) {
    let preTime = 0
    fn = typeof fn === 'function' ? fn : () => { }
    return function () {
        const curTime = +new Date()
        if (curTime - preTime > wait) {
            preTime = curTime
            fn.apply(this, arguments)
        }
    }
}

let mark = 1
const fn = throttle(() => console.log('run fn --- ' + mark++), 1000)
fn()
fn()
fn()
fn()
fn()
setTimeout(() => {
    fn()
}, 1000)
setTimeout(() => {
    fn()
}, 1500)
