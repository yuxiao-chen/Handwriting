const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'reject'

class Promise1 {
    status = PENDING
    value
    onFulFiledCallbacks = []
    onRejectedCallbacks = []
    constructor(executor) {
        const onFulFiled = (value) => {
            if (this.status !== PENDING) return
            this.status = FULFILLED
            this.value = value
            while (this.onFulFiledCallbacks.length) {
                const cb = this.onFulFiledCallbacks.pop()
                cb(this.value)
            }
        }
        const onRejected = (err) => {
            if (this.status !== PENDING) return
            this.status = REJECTED
            this.value = err
            while (this.onRejectedCallbacks.length) {
                const cb = this.onRejectedCallbacks.pop()
                cb(this.err)
            }
        }
        try {
            executor(onFulFiled, onRejected)
        } catch (error) {
            onRejected(error)
        }
    }
    then(resolveFn, rejectFn) {
        const p2 = new Promise1((resolve, reject) => {
            const onResolvedFn = () => {
                setTimeout(() => {
                    try {
                        const x = resolveFn(this.value)
                        if (x === p2) throw new Error('p2 === x')

                        x instanceof Promise1 ? x.then(resolve, reject) : resolve(x)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            const onRejectedFn = () => {
                setTimeout(() => {
                    try {
                        const x = rejectFn(this.value)
                        if (x === p2) throw new Error('p2 === x')

                        x instanceof Promise1 ? x.then(resolve, reject) : resolve(x)
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            switch (this.status) {
                case FULFILLED:
                    onResolvedFn()
                    break;
                case REJECTED:
                    onRejectedFn()
                    break
                default:
                    this.onFulFiledCallbacks.push(onResolvedFn)
                    this.onRejectedCallbacks.push(onRejectedFn)
                    break;
            }
        })
        return p2
    }
}

Promise1.prototype.resolve = (resolve) => {
    return new Promise1(resolve)
}

const p1 = new Promise1((resolve, reject) => {
    setTimeout(() => {
        console.log('✅ p1 timer', 1)
        resolve(1)
    }, 1000)
})
const p2 = p1.then((v) => {
    console.log('✅ p1 then1 res', v + 1)
    return p2
})

p2.then((v2) => {
    console.log('✅ p2 then2 res', v2 + 1)
}, rej => {
    console.log('🙅 p2 then2 rej', rej)
})



var urls = [
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
    "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
];
function loadImg(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            console.log("一张图片加载完成:" + url);
            resolve(img);
        };
        img.onerror = function () {
            reject(new Error('Could not load image at' + url));
        };
        img.src = url;
    })
}

var scheduler = (jobs, limit) => {
    const jobsCp = [...jobs]
    const limitedJobs = jobsCp.slice(0, limit).map(async (item, index) => item().then(index))
    let p = Promise.race(limitedJobs)
    jobsCp.forEach((item) => {
        p = p.then((index) => {
            limitedJobs[index] = item()
            return Promise.race(limitedJobs)
        })
    })

}
scheduler(urls.map((item) => loadImg(item)), 3)