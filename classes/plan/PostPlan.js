import { createComment, getCommentsBy } from '../../libs/commentManagement'
import { createOrUpdatePlan } from '../../libs/planManagement'
import BasePlan from './BasePlan.js'

export default class PostPlan extends BasePlan {
    constructor(postPlanData = {}) {
        super(postPlanData)
        this.postDate = postPlanData?.postDate || null
        this.upVote = postPlanData?.upVote || 0
        this.upVotedUserIds = postPlanData?.upVotedUserIds || []
        this.downVote = postPlanData?.downVote || 0
        this.downVotedUserIds = postPlanData?.downVotedUserIds || []
        this.comments = postPlanData?.comments || []
        this.published = postPlanData?.published || false
        this.type = 'post'
    }

    publish() {
        // if (this.postDate === '') this.postDate = Date.now()
        this.published = true
        createOrUpdatePlan(this, 'post')
    }

    archive() {
        this.published = false
        createOrUpdatePlan(this, 'post')
    }

    upVote() {
        this.upVote++
        createOrUpdatePlan(this, 'post')
    }

    downVote() {
        this.downVote++
        createOrUpdatePlan(this, 'post')
    }

    async loadComments() {
        const comments = await getCommentsBy('postId', this.id)
        this.comments = comments
    }

    getComments() {
        return this.comments
    }

    async addComment(commentObject) {
        commentObject.postId = this.id
        const comment = await createComment(commentObject)
        return comment
    }

    getDraft() {
        const draftPlan = new BasePlan(this)
        draftPlan.id = undefined
        return draftPlan
    }
}