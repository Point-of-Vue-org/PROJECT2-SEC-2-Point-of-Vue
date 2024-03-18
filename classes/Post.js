import { createPostOrUpdatePost } from '../libs/postManagement'
import PostTemplate from './templates/Post.json'

export class Post {
    constructor(postData) {
        let post = postData || PostTemplate
        for (let key in post) {
            this[key] = post[key]
        }
    }

    publish() {
        if (this.postDate === '') this.postDate = Date.now()
        this.published = true
        createPostOrUpdatePost(this)
    }

    archive() {
        this.published = false
        createPostOrUpdatePost(this)
    }
}