import { Comment } from "../classes/Comment"
import { updateUserData } from "./userManagement"

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'

export async function getCommentsBy(key, value) {
  const url = `${JSON_SERVER_URI}/comments?${key}=${value}`
  const res = await fetch(url)
  const data = await res.json()
  return data.map((commentData) => new Comment(commentData))
}

export async function createComment(commentObject) {
  const url = `${JSON_SERVER_URI}/comments`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commentObject)
  })
  const data = await res.json()
  return new Comment(data)
}

export async function updateCommentData(id, updateData) {
  const url = `${JSON_SERVER_URI}/comments/${id}`
  const res = await fetch(url, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
  })

  return await res.json()
}

export async function toggleUpVoteComment(userData, commentData) {
  let upVoted = userData.upVotedComments.includes(commentData.id)

	const updatedPlan = await updateCommentData(commentData.id, { upVote: commentData.upVote + (upVoted ? -1 : 1) })
	if (updatedPlan) commentData.upVote += upVoted ? -1 : 1

	if (!upVoted) userData.upVotedComments.push(commentData.id)
	else userData.upVotedComments.splice(userData.upVotedComments.indexOf(commentData.id), 1)
	const updatedUser = await updateUserData(userData.id, { upVotedComments: userData.upVotedComments })
	if (updatedUser) upVoted = !upVoted

  return upVoted
}
