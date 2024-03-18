class Task {
    constructor(taskData) {
        let task = taskData || TaskTemplate
        for (let key in task) {
            this[key] = task[key]
        }
    }
}