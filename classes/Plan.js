import PlanTemplate from './templates/Plan.json'

export class Plan {
    constructor(planData) {
        let plan = planData || PlanTemplate
        for (let key in plan) {
            this[key] = plan[key]
        }
    }
}