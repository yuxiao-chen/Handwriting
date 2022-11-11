const PROMISE = require('./index')

const Promise1 = PROMISE

// TODO: 首次 res(一个新的Promise)
const p = new Promise1((res, rej) => {
    setTimeout(() => {
        res(new Promise1((res1, rej1) => {
            setTimeout(() => {
                console.log('setTimeOut2 End')
                res1(111)
            }, 1000)
        }))
        console.log('setTimeOut1 End')
    }, 1000)
})

p.then((res) => {
    console.log('✅ 1 -- then', res)
    return new Promise1((res1, rej1) => {
        setTimeout(() => {
            console.log('setTimeOut3 End')
            res1(222)
        }, 1000)
    })
}, rej => {
    console.log('❌ 1 -- then', rej)
    return rej++
}).then(res => {
    console.log('✅ 2 -- then', res)
    return res++
}).then().then((e) => {
    console.log('✅ 3 -- then', e)
})
// .catch((err)=>{
//     console.log('catch err', err)
// })