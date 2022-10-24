class Scheduler {
    max = 1
    runningCount = 0
    waitList = []
    constructor(max) {
        this.max = max
    }
    async add(job) {
        // 如果正在执行中的任务超出并发数，阻塞本次执行， 将
        if (this.runningCount >= this.max) await new Promise((res) => this.waitList.push(res))

        let jobRes
        try {
            this.runningCount++
            jobRes = await job()
        } finally {
            if (this.waitList.length) {
                this.waitList.pop()()
            }
            return jobRes
        }

    }
}

const promiseJob = (time, order) => new Promise(resolve => {
    setTimeout(() => resolve(order), time);
})

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
    //add返回一个promise，参数也是一个promise
    scheduler.add(() => promiseJob(time, order)).then((res) => console.log(
        `✅ order: ${order} | res: ${res}`
    ))
}

addTask(2000, 1)
addTask(100, 2)
addTask(1000, 3)