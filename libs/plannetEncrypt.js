const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'secret'

export function encrypt(str) {
  let encrypted = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const keyChar = SECRET_KEY[i % SECRET_KEY.length]
    const encryptedChar = String.fromCharCode(
      char.charCodeAt(0) + keyChar.charCodeAt(0)
    )
    encrypted += encryptedChar
  }
  return btoa(encrypted)
}

export function decrypt(str) {
  if (!str) return null
  const aStr = atob(str)
  let decrypted = ''
  for (let i = 0; i < aStr.length; i++) {
    const char = aStr[i]
    const keyChar = SECRET_KEY[i % SECRET_KEY.length]
    const decryptedChar = String.fromCharCode(
      char.charCodeAt(0) - keyChar.charCodeAt(0)
    )
    decrypted += decryptedChar
  }
  return decrypted
}

export function hash(password) {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    let char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return btoa(hash.toString())
}
