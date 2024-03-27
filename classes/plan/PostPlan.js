import { createComment, getCommentsBy } from '../../libs/commentManagement'
import { createOrUpdatePlan } from '../../libs/planManagement'
import BasePlan from './BasePlan.js'

export default class PostPlan extends BasePlan {
    constructor(postPlanData = {}) {
        super(postPlanData)
        this.postDate = postPlanData?.postDate || null
        this.upVote = postPlanData?.upVote || 0
        this.downVote = postPlanData?.downVote || 0
        this.comments = postPlanData?.comments || []
        this.published = postPlanData?.published || false
        this.getComments()
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

    async getComments() {
        const comments = await getCommentsBy('postId', this.id)
        this.comments = comments
        return this.comments.reverse()
    }

    async addComment(commentObject) {
        commentObject.postId = this.id
        const comment = await createComment(commentObject)
        return comment
    }

    getDraft() {
        return new BasePlan(this)
    }
}