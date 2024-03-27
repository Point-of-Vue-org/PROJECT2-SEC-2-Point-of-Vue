const defaultCommentData = {
    id: undefined,
    authorId: '',
    postId: '',
    content: '',
    upVote: 0,
    downVote: 0,
    date: null,
    repliedTo: '',
}

export class Comment {
    constructor(commentData = {}) {
        for (let key in defaultCommentData) {
            // if (defaultCommentData[key] === undefined) continue
            this[key] = commentData[key] || defaultCommentData[key]
        }
    }
}