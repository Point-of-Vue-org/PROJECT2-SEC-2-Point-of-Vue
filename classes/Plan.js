class Plan {
    constructor(planData) {
        let plan = planData || PlanTemplate
        for (let key in plan) {
            this[key] = plan[key]
        }
    }
}