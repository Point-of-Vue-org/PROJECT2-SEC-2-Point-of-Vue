import ActivePlan from "../classes/plan/ActivePlan"
import BasePlan from "../classes/plan/BasePlan"
import PostPlan from "../classes/plan/PostPlan"
import { updateUserData } from "./userManagement"

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'

function mapPlanObject(planData, type) {
    switch (type) {
        case 'post':
            return new PostPlan(planData)
        case 'active':
            return new ActivePlan(planData)
        default:
            return new BasePlan(planData)
    }
}

export async function getPlans(type, start, amount) {

    if (!['post', 'active', 'draft'].includes(type)) throw new Error('Type must be "post", "active", or "draft"')

    const url = `${JSON_SERVER_URI}/${type}Plans`
    const res = await fetch(url)
    const data = await res.json()

    const plans = data.map(planObj => mapPlanObject(planObj, type))

    if (start && amount) return plans.slice(start, amount)
    return plans
}

export async function isPlanExist(id, type) {
    if(id=== undefined){
        return false
    }
    if (!['post', 'active', 'draft'].includes(type)) throw new Error('Type must be "post", "active", or "draft"')

    const url = `${JSON_SERVER_URI}/${type}Plans/${id}`
    const res = await fetch(url)
    return res.status !== 404
}

export async function getPlansBy(key, value, type) {
    const url = `${JSON_SERVER_URI}/${type}Plans?${key}=${value}`
    const res = await fetch(url)
    const data = await res.json()
    return  data.map((planData) => mapPlanObject(planData, type))
}

export async function getPlanBy(key, value, type) {
    const plans = await getPlansBy(key, value, type)
    return plans[0]
}

export async function deletePlan(id, type) {
    const url = `${JSON_SERVER_URI}/${type}Plans/${id}`
    const res = await fetch(url, {
        method: 'DELETE',
    })
    return await res.json()
}

export async function createOrUpdatePlan(planObj, type) {
    const isPostExist = await isPlanExist(planObj.id, type)
    if (!type) type = planObj.type
    const url = `${JSON_SERVER_URI}/${type}Plans${isPostExist ? `/${planObj.id}` : ''}`
    const response = await fetch(url, {
        method: isPostExist ? 'PATCH' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(planObj),
    })

    return await response.json()
}

export async function updatePlanData(id, updateData, type) {
    const url = `${JSON_SERVER_URI}/${type}Plans/${id}`
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    })

    return await res.json()
}

// export async function sortByUpvote(posts, order) {
//     if(!['asc', 'desc'].includes(order)) throw new Error('Order must be \"asc\" or \"desc\"')
//     return posts.sort((a, b) => (a.upVote - b.upVote) * order === 'asc' ? 1 : -1)
// }

export async function toggleUpVote(userData, postPlanData) {
    let upVoted = userData.upVotedPlans.includes(postPlanData.id)

    const updatedPlan = await updatePlanData(postPlanData.id, {
        upVote: postPlanData.upVote + (upVoted ? -1 : 1),
        upVotedUserIds: upVoted ? postPlanData.upVotedUserIds.filter(userId => userId !== userData.id) : [...postPlanData.upVotedUserIds, userData.id]
    }, 'post')
    if (updatedPlan) postPlanData.upVote += upVoted ? -1 : 1

    if (!upVoted) userData.upVotedPlans.push(postPlanData.id)
    else userData.upVotedPlans.splice(userData.upVotedPlans.indexOf(postPlanData.id), 1)
    const updatedUser = await updateUserData(userData.id, { upVotedPlans: userData.upVotedPlans })
    if (updatedUser) upVoted = !upVoted

    return upVoted
}

export async function toggleDownVote(userData, postPlanData) {
    let downVoted = userData.downVotedPlans.includes(postPlanData.id)

    const updatedPlan = await updatePlanData(postPlanData.id, {
        downVote: postPlanData.downVote + (downVoted ? -1 : 1),
        downVotedUserIds: downVoted ? postPlanData.downVotedUserIds.filter(userId => userId !== userData.id) : [...postPlanData.downVotedUserIds, userData.id]
    }, 'post')
    if (updatedPlan) postPlanData.downVote += downVoted ? -1 : 1

    if (!downVoted) userData.downVotedPlans.push(postPlanData.id)
    else userData.downVotedPlans.splice(userData.downVotedPlans.indexOf(postPlanData.id), 1)
    const updatedUser = await updateUserData(userData.id, { downVotedPlans: userData.downVotedPlans })
    if (updatedUser) downVoted = !downVoted

    return downVoted
}