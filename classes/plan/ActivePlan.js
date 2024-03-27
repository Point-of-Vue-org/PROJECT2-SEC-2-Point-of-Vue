import { createOrUpdatePlan } from '../../libs/planManagement'
import BasePlan from './BasePlan.js'

export default class ActivePlan extends BasePlan {
    constructor(activePlanData = {}) {
        super(activePlanData)
        this.startDate = activePlanData?.startDate || null
        this.type = 'active'
    }
    
    start() {
        this.startDate = Date.now()
        createOrUpdatePlan(this, 'active')
    }

    getDraft() {
        return new BasePlan(this)
    }
}