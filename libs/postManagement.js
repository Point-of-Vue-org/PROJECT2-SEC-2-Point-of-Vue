import { Post } from "../classes/Post.js"

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'

/**
 * Get all posts
 
 * @returns { Array<Post> } return array of posts
 */
export async function getPosts(start, amount) {
    const res = await fetch(`${JSON_SERVER_URI}/posts`)
    const posts = await res.json()

    if (start && amount) return posts.slice(start, amount)
    return posts
}

/**
 * Check if  user existed by id
 * @param {String} id - postId
 * @returns {Promise<Boolean>} A promise that resolves to boolean
 */
export async function isPostExist(id) {
    let response = await fetch(`${JSON_SERVER_URI}/posts/${id}`)
    return response.status !== 404
}

/**
 * Check post by key
 * @param {String} key - The key to search by
 * @param {String} value - The value to search for
 * @returns {Promise<Post>} - A promise that resolves to Post object
 */
export async function getPostBy(key, value) {
    let response = await fetch(`${JSON_SERVER_URI}/posts?${key}=${value}`)
    const data = await response.json()
    return data
}

/**
 * Delete post by id
 * @param {String} id - The id of post
 * @returns {Promise<Post>} - A promise that resolves to Post object
 */
export async function deletePost(id) {
    const response = await fetch(`${JSON_SERVER_URI}/posts/${id}`, {
        method: 'DELETE',
    })
    return await response.json()
}

/**
 * Create or update post
 * @param {String} postData - Data from post
 * @returns {Promise<Post>} - A promise that resolves to Post object
 */
export async function createPostOrUpdatePost(postData) {
    const isPostExist = await isPostExist(postData.id)

    const response = await fetch(`${JSON_SERVER_URI}/posts` + isPostExist ? `/${postData.id}` : '', {
        method: isPostExist ? 'PATCH' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })

    return await response.json()
}

/**
 * Sorting by upvote count
 * @param {String} posts - Message from post
 * @returns {Array<Post>} - A promise that resolves to post array
 */
export async function sortByUpvote(posts) {
    return posts.sort((a, b) => b.upVote - a.upVote)
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
// export async function completedTasksByPercent(posts) {
//     let completedTasks = 0
//     let totalTasks = 0
//     posts.forEach(post => {
//         totalTasks += post.tasks.length
//         post.tasks.forEach(task => {
//             if (task.isCompleted) completedTasks++
//         })
//     })

//     if (totalTasks === 0) {
//         return 0
//     }

//     return (completedTasks / totalTasks) * 100
// }
