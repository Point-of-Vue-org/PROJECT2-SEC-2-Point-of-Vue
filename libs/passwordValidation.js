/**
 * Check if password is Secure or not
 * @param {String} password
 * @returns {Object} return object {
 *  isPasswordSecure: boolean,
 *  warning: Array
 * }
 */
export function checkPassword(password) {
    const warningMsg = []

    const isLengthValid = password.length >= 8
    const isMaxLengthValid = password.length <= 30
    const isCharacterValid = /^[\x20-\x7E]+$/.test(password) && password !== ''
    const haveLowerCase = /[\x61-\x7A]/.test(password)
    const haveUpperCase = /[\x41-\x5A]/.test(password)
    const haveDigit = /[\x30-\x39]/.test(password)
    const haveSymbol = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(password)

    if (!isLengthValid) warningMsg.push("At least 8 characters long")
    if (!isCharacterValid) warningMsg.push("Contain upper case, lower case, digits and special characters")
    if (!haveLowerCase) warningMsg.push("At least one lower case character")
    if (!haveUpperCase) warningMsg.push("At least one upper case character")
    if (!haveDigit) warningMsg.push("At least one digit")
    if (!haveSymbol) warningMsg.push("Password must contain at least one special character")
    if (!isMaxLengthValid) warningMsg.push("Password must be less than 30 characters long")
    return {
        isPasswordSecure: isLengthValid && haveLowerCase && haveUpperCase && haveDigit && haveSymbol && isCharacterValid && isMaxLengthValid,
        warning: warningMsg,
        status: {
            isLengthValid,
            isMaxLengthValid,
            isCharacterValid,
            haveLowerCase,
            haveUpperCase,
            haveDigit,
            haveSymbol
        }
    }
}

