import CommentTemplate from './templates/Comment.json'

export class Comment {
    constructor(commentData) {
        const comment = commentData || CommentTemplate
        for (let key in comment) {
            this[key] = comment[key]
        }
    }
}