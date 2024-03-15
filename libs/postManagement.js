/**
 * Get all posts
 
 * @returns { Array<Post>} return array of posts
 */
export async function getPosts() {
    return fetch('http://localhost:5000/posts')
       .then(response => response.json())
       .then(json => json)
}

export function slicePost(value,postObject){
    return postObject.slice(0,value)
}

/**
 * Check if  user existed by id
 * @param {string} id - postId
 * @returns {Promise<Boolean>} A promise that resolves to boolean
 */
export async function isPostExist(id) {
    let response = await fetch(`http://localhost:5000/posts?id=${id}`)
    const json = await response.json()
    if (json.length > 0) {
        return true
    } else {
        return false
    }
}

/**
 * Check post by key
 * @param {string} key - The key to search by
 * @param {string} value - The value to search for
 * @returns {Promise<Post>} - A promise that resolves to Post object
 */
export async function getPostBy(key, value) {
    let response = await fetch(`http://localhost:5000/posts?${key}=${value}`)
    const json = await response.json()
    return json[0]
}

/**
 * Delete post by id
 * @param {string} id - The id of post
 * @returns {Promise<Post>} - A promise that resolves to Post object
 */
export async function deletePost(id) {
    let response = await fetch(`http://localhost:5000/posts/${id}`, {
        method: 'DELETE',
    })
    return await response.json()
}

/**
 * Create or update post
 * @param {string} postData - Data from post
 * @returns {Promise<Post>} - A promise that resolves to Post object
 */
export async function createPostOrUpdatePost(postData) {
    if (await isPostExist(postData.id)) {
        let response = await fetch(`http://localhost:5000/posts/${postData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })

        return await response.json()

    }

    else {
        let response = await fetch('http://localhost:5000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        return await response.json()
    }
}

/**
 * Sorting by upvote count
 * @param {string} posts - Message from post
 * @returns {Array<Post>} - A promise that resolves to post array
 */
export async function sortByUpvote(posts) {
    return posts.sort((a, b) => b.upvote - a.upvote)
}

/**
 * Sorting by postdate
 * @param {string} posts - Message from post
 * @returns {Array<Post>} - A promise that resolves to post array
 */
export async function sortByDate(posts) {

    return posts.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())

}

/**
 * Calculate task completion by percentage
 * @param {string} posts - Message from post
 * @returns {Number} - A promise that resolves a number of tasks
 */
export async function completedTasksByPercent(posts) {
    let completedTasks = 0
    let totalTasks = 0
    posts.forEach(post => {
        totalTasks += post.tasks.length
        post.tasks.forEach(task => {
            if (task.isCompleted) {
                completedTasks++
            }
        })
    })

    if (totalTasks === 0) {
        return 0
    }

    return (completedTasks / totalTasks) * 100
}
