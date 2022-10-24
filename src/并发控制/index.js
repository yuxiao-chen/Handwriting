/**
 * 实现多任务执行， 最大可并发N个
 */

function doFetch(mark) {
    return new Promise((res) => {
        console.log(`🚀 ${mark} -- start fetch`)
        setTimeout(() => {
            console.log(`✅ ${mark} -- fetch end`)
            res(mark)
        }, 500)
    })
}


function limitPool(jobs, limit) {
    const jobsCopy = [...jobs]
    // 先取出头部 N 个，开始执行
    const limitJobs = jobsCopy.splice(0, limit).map((item, idx) => {
        // 此处返回任务位置下标，为了给下一个任务让位置
        if (typeof item === 'function') {
            return item().then(() => idx)
        } else {
            console.error('非函数', item)
            return Promise.resolve(idx)
        }
    })
    let p = Promise.race(limitJobs)
    // 每次都需要等 limitJobs 池中有一个任务优先完成(race)， 再将该任务的位置让给 jobsCopy 中的下一个任务并开始执行， 继续等待 limitJobs 中下一个完成的任务(race)，以此往复；
    for (let i = 0; i < jobsCopy.length; i++) {
        // 相当于不停的在做p.then().then().then() ... 
        p = p.then((idx) => {
            if (typeof jobsCopy[i] === 'function') {
                limitJobs[idx] = jobsCopy[i]().then(() => idx)
            } else {
                console.error('[limitPool] job 必须是函数，检查到非函数 job:', jobsCopy[i])
                limitJobs[idx] = Promise.resolve(idx) 
            }
            return Promise.race(limitJobs)
        })
    }
}

const fetchPaths = [1, 2, 3, 4, 5, 6, 7]
limitPool(fetchPaths.map(item => {
    return () => {
        return doFetch(item)
    }
}).concat([8, 9, 10]), 3)