/**
 * Check if the string is a email or not
 * @param {string} str 
 * @returns 
 */
export function isEmail(str) {
    return /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(str)
}