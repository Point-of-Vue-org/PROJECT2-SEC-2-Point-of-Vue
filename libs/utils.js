/**
 * Check if the string is a email or not
 * @param {string} str 
 * @returns 
 */
export function isEmail(str) {
    return /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(str)
}

export function formatDate(rawDate) {

	const date = new Date(rawDate)

	if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
		if (date.getHours() === new Date().getHours()) {
			if (date.getMinutes() === new Date().getMinutes()) {
				return 'Just now'
			}

			return new Date().getMinutes() - date.getMinutes()  + ' minutes ago'
		}
		return 'Today at ' + date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		})
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	})
}

export function sortObject(array, sortBy, order) {
	if(!['asc', 'desc'].includes(order)) throw new Error('Order must be \"asc\" or \"desc\"')

	if (!array.length) return []

	// console.log(object);
	let fieldTypes = null
	if (array.some((obj) => obj[sortBy] === undefined)) throw new Error('Invalid sortBy key')
	else fieldTypes = typeof array[0][sortBy]

	console.log('fieldTypes', fieldTypes);

	const copyArray = [...array]
	
	if (fieldTypes === 'string') {
			copyArray.sort((a, b) => (a[sortBy].localeCompare(b[sortBy])) * (order === 'asc' ? 1 : -1))
	} else if (fieldTypes === 'number'){
			copyArray.sort((a, b) => (a[sortBy] - b[sortBy]) * (order === 'asc' ? 1 : -1))
	} else {
			console.log('fieldTypes', fieldTypes);
			throw new Error('Invalid sortBy key type')
	}
	return copyArray
}