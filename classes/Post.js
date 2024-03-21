import { createOrUpdatePost } from '../libs/postManagement'
import { Day } from './Day'
import PostTemplate from './templates/Post.json'
import { Comment } from './Comment'

export class Post {
    constructor(postData) {
        let post = postData || PostTemplate
        for (let key in post) {
            this[key] = post[key]
        }
    }

    getDailyPlan(index) {
        if (index === undefined) return this.days.map(day => new Day(day))
        return new Day(this.days[index])
    }

    addDailyPlan(day) {
        this.days.push(day)
    }

    getComments(index) {
        if (index === undefined) return this.comments.map(comment => new Comment(comment))
        return new Comment(this.comment[index])
    }

    addComment(comment) {
        this.comments.push(comment)
    }

    publish() {
        if (this.postDate === '') this.postDate = Date.now()
        this.published = true
        createOrUpdatePost(this)
    }

    archive() {
        this.published = false
        createOrUpdatePost(this)
    }
}