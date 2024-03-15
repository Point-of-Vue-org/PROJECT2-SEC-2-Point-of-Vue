import Post from '../object_template/PostTemplate.json';
export class Post {
    constructor(postData) {
        if (postData === undefined) {
            return Post

        }
        else{
            for (let key in postData) {
                this[key] = postData[key]
            }
        }
    }

}