class Comment {
    constructor(commentData) {
        let comment = commentData || CommentTemplate
        for (let key in comment) {
            this[key] = comment[key]
        }
    }
}