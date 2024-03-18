/**
 * Check if password is Secure or not

 @param {String} newPassword

 * @returns { Object } return object {
    isPasswordSecure: boolean,
    warning: Array
 }
 */
export function checkPassword(newPassword) {
    let passwdWarning = []
    let passwdLengthRequired = false
    let isAlphabet = false
    let lowLetterChecked = false
    let capLetterChecked = false
    let digitChecked = false
    let specialCharChecked = false
    if (newPassword.length < 8) {
        passwdLengthRequired = false
        passwdWarning.push("Password must be at least 8 characters long")
    } else {
        passwdLengthRequired = true
    }

    if (/^[\x20-\x7E]+$/.test(newPassword) && newPassword !== '') {
        isAlphabet = true
    }

    if (/[\x61-\x7A]/.test(newPassword)) {
        lowLetterChecked = true
    } else {
        lowLetterChecked = false
        passwdWarning.push("Password must contain at least one lowercase letter")
    }

    if (/[\x41-\x5A]/.test(newPassword)) {
        capLetterChecked = true
    } else {
        capLetterChecked = false
        passwdWarning.push("Password must contain at least one uppercase letter")
    }

    if (/[\x30-\x39]/.test(newPassword)) {
        digitChecked = true
    } else {
        digitChecked = false
        passwdWarning.push("Password must contain at least one digit")
    }

    if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(newPassword)) {
        specialCharChecked = true
    } else {
        specialCharChecked = false
        passwdWarning.push("Password must contain at least one special character")
    }

    if (passwdLengthRequired && lowLetterChecked && capLetterChecked && digitChecked && specialCharChecked && isAlphabet) {
        return {
            isPasswordSecure: true,

        }
    }
    else {
        return {
            isPasswordSecure: passwdLengthRequired && lowLetterChecked && capLetterChecked && digitChecked && specialCharChecked && isAlphabet,
            warning: passwdWarning
        }

    }


}

