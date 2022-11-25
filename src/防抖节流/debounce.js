function debounce(fn, time) {
    let timer = 0
    fn = typeof fn === 'function' ? fn : () => { }
    time = time ?? 0
    return function (...args) {
        if (timer) clearTimeout(timer)

        const _this = this
        timer = setTimeout(function(){
            fn.apply(_this, args)
        }, time)
    }

}