import PostTemplate from '../object_template/PostTemplate.json'

export class Post {
    constructor(postData) {
        let post = postData || PostTemplate
        for (let key in post) {
            this[key] = post[key]
        }
    }
}