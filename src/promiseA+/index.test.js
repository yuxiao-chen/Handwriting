const PROMISE = require('./index')

const Promise1 = PROMISE

// TODO: 首次 res(一个新的Promise)
const p = new Promise1((res, rej) => {
    setTimeout(() => {
        res(new Promise1((res1, rej1) => {
            setTimeout(() => {
                console.log('p1 setTimeOut2 End')
                res1(111)
            }, 1000)
        }))
        console.log('p1 setTimeOut1 End')
    }, 1000)
})

p.then((res) => {
    console.log('✅ p1 1 -- then', res)
    return new Promise1((res1, rej1) => {
        setTimeout(() => {
            console.log('setTimeOut3 End')
            res1(222)
        }, 1000)
    })
}, rej => {
    console.log('❌ p1 1 -- then', rej)
    return rej++
}).then(res => {
    console.log('✅ p1 2 -- then', res)
    return res++
}).then().then((e) => {
    console.log('✅ p1 3 -- then', e)
})
// .catch((err)=>{
//     console.log('catch err', err)
// })

const p2 = new Promise1((res) => {
    setTimeout(() => {
        console.log('完成 p2 end')
        res('p2222222')
    }, 500)
})

Promise1.race([p, p2]).then((res) => {
    console.log('race 结果：' + res)
})

Promise1.all([p, p2]).then(() => {
    console.log('✅ [p1, p2] end')
})



var a = ()=>{
    return new Promise((res,rej)=>{

        throw new Error('111')
    })
}

// a().then(res=>{}).catch(e=>console.log('---err---\n', e))
a().then(res=>{}, rej=>{
    console.log('--rej-- \n',rej)
}).catch(e=>console.log('--e--\n', e))