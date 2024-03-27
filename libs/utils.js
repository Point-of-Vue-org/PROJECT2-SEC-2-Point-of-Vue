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