export class Post {
    constructor(postData) {
        this.id = postData?.id || undefined
        this.title = postData?.title || ''
        this.content = postData?.content || ''
        this.upvote = postData?.upvote || 0
        this.downvote = postData?.downvote || 0
        this.postDate = postData
}