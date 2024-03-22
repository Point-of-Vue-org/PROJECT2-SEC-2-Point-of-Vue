const defaultHourlyTaskData = {
    header: '',
    imageURL: '',
    description: '',
    start: '',
    end: '',
    todos: [],
    isDone: false,
}

export class HourlyTask {
    constructor(hourlyTaskData = {}) {
        for (let key in defaultHourlyTaskData) {
            if (defaultHourlyTaskData[key] === undefined) continue
            this[key] = hourlyTaskData[key] || defaultHourlyTaskData[key]
        }
    }

    getTodos(index) {
        if (index === undefined) return this.todos.map(todo => new Todo(todo))
        return new Todo(this.todos[index])
    }

    addTodo(todo) {
        this.todos.push(todo)
    }
}