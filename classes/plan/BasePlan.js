import { DailyTask } from '../DailyTask'

const defaultPlanData = {
    id: undefined,
    authorId: '',
    userId: '',
    title: '',
    imageUrl: '',
    description: '',
    dailyTasks: [],
    isDone: false,
}

export default class BasePlan {

    constructor(planData = {}) {
        for (let key in defaultPlanData) {
            // if (!Object.keys(defaultPlanData).includes(key)) continue
            this[key] = planData[key] || defaultPlanData[key]
        }
        this.type = 'draft'
    }

    getDailyTasks(index) {
        if (index === undefined) return this.dailyTasks.map(task => new DailyTask(task))
        return new DailyTask(this.dailyTasks[index])
    }

    addDailyTask(dailyTask) {
        if (dailyTask instanceof DailyTask) this.dailyTasks.push(dailyTask)
        else this.dailyTasks.push(new DailyTask(dailyTask))
    }
}