const defaultTodoData = {
    id:'',
    description: '',
    isDone: false,
}

export class Todo {
    constructor(TodoData = {}) {
        for (let key in defaultTodoData) {
            if (defaultTodoData[key] === undefined) continue
            this[key] = TodoData[key] || defaultTodoData[key]
        }
    }
}