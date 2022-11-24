


function pFn(mark) {
    return new Promise((res) => {
        setTimeout(() => {
            console.log('pFn ---- ' + mark)
            res(mark)
        }, 200)
    })
}

async function asyncFn() {
    let i = 1
    console.log('asyncFn start');
    const v1 = await pFn(i++)
    console.log('asyncFn v ---- ' + v1)

    const v2 = await pFn(i++)
    console.log('asyncFn v ---- ' + v2)

    const v3 = await pFn(i++)
    console.log('asyncFn v ---- ' + v3)

    console.log('asyncFn end \n');
    return v3
}
asyncFn().then(res => console.log('✅ async fn done', res))


function generatorToAsync(gen) {
    return function () {
        const genFn = gen.apply(this, arguments)
        return new Promise((resolve, reject) => {
            function go(key, arg) {
                let result
                try {
                    result = genFn[key](arg)
                } catch (error) {
                    reject(error)
                }
                if (result.done) {
                    resolve(result.value)
                } else {
                    Promise.resolve(result.value).then(res => go('next', res), err => go('throw', err))
                }
            }
            go('next')
        })
    }
}

function co(gen) {
    return new Promise((resolve, reject) => {
        function next(arg) {
            const { done, value } = gen.next(arg)
            if (done) {
                resolve(value)
            } else {
                // value 可能会是个 promise
                Promise.resolve(value).then((v) => {
                    next(v)
                }, () => {
                    reject()
                })
            }
        }
        next()
    })
}

function* genFn() {
    let i = 1
    console.log('genFn start', pFn);
    const v1 = yield pFn(i++)
    console.log('genFn v ---- ' + v1)

    const v2 = yield pFn(i++)
    console.log('genFn v ---- ' + v2)

    const v3 = yield pFn(i++)
    console.log('genFn v ---- ' + v3)

    console.log('genFn end \n');
    return v3
}

const gen2Async = generatorToAsync(genFn)
gen2Async().then((res) => {
    console.log('✅ gen2Async done', res)
})


co(genFn()).then(res => {
    console.log('完成 co', res)
})