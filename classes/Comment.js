import CommentTemplate from './templates/Comment.json'

class Comment {
    constructor(commentData) {
        let comment = commentData || CommentTemplate
        for (let key in comment) {
            this[key] = comment[key]
        }
    }
}