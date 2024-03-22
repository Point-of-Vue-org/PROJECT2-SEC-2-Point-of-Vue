const defaultDailyTaskData = {
    title: '',
    hourlyTasks: [],
    isDone: false,
}

export class DailyTask {
    constructor(dailyTaskData = {}) {
        for (let key in defaultDailyTaskData) {
            if (defaultDailyTaskData[key] === undefined) continue
            this[key] = dailyTaskData[key] || defaultDailyTaskData[key]
        }
    }

    getHourlyTasks(index) {
        if (index === undefined) return this.hourlyTasks.map(task => new HourlyTask(task))
        return new HourlyTask(this.hourlyTasks[index])
    }

    addHourlyTask(task) {
        this.hourlyTasks.push(task)
    }
}