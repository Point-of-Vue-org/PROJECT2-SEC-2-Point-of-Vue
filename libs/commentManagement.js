import { Comment } from "../classes/Comment"
import { getPlanBy, updatePlanData } from "./planManagement"
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
  console.log('data', data);

  if (data) {
    // console.log(data.postId);
    const postPlan = await getPlanBy('id', data.postId, 'post')
    console.log(postPlan);
    const res = await updatePlanData(postPlan.id, { commentsCount: postPlan.commentsCount + 1 }, 'post')
    if (!res) throw new Error('Error updating post plan comments count')
  } else {
    // console.error('Error creating comment:', res)
    throw new Error('Error creating comment')
  }

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

	const updatedPlan = await updateCommentData(commentData.id, {
    upVote: commentData.upVote + (upVoted ? -1 : 1),
    upVotedUserIds: upVoted ? commentData.upVotedUserIds.filter((id) => id !== userData.id) : [...commentData.upVotedUserIds, userData.id]
  })
	if (updatedPlan) commentData.upVote += upVoted ? -1 : 1

	if (!upVoted) userData.upVotedComments.push(commentData.id)
	else userData.upVotedComments.splice(userData.upVotedComments.indexOf(commentData.id), 1)
	const updatedUser = await updateUserData(userData.id, { upVotedComments: userData.upVotedComments })
	if (updatedUser) upVoted = !upVoted

  return upVoted
}
