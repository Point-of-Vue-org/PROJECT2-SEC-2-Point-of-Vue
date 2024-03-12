export function encrypt(str, key) {
  let encrypted = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const keyChar = key[i % key.length]
    const encryptedChar = String.fromCharCode(
      char.charCodeAt(0) + keyChar.charCodeAt(0)
    )
    encrypted += encryptedChar
  }
  return btoa(encrypted)
}

export function decrypt(str, key) {
  if (!str || !key) return null
  const aStr = atob(str)
  let decrypted = ''
  for (let i = 0; i < aStr.length; i++) {
    const char = aStr[i]
    const keyChar = key[i % key.length]
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
    console.log(char, hash)
    hash = (hash << 5) - hash + char
    console.log(hash)
    hash = hash & hash
    console.log(hash)
    console.log(hash.toString())
  }
  return btoa(hash.toString())
}
