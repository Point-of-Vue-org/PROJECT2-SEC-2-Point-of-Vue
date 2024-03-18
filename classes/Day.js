import DayTemplate from './templates/Day.json'

export class Day {
    constructor(dayData) {
        let day = dayData || DayTemplate
        for (let key in day) {
            this[key] = day[key]
        }
    }
}