import { User } from '../classes/User'
import { isEmail } from './utils'
import { decrypt, hash } from './plannetEncrypt.js'
const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'
const secretKey = import.meta.env.VITE_SECRET_KEY || 'secret'

/**
 * Fetches a user by a given key and value
 * @param {string} key - The key to search by
 * @param {string} value - The value to search for
 * @returns {Promise<User>} A promise that resolves to a User object
 */
export async function fetchUserBy(key, value) {
  const response = await fetch(
    `${JSON_SERVER_URI}/users?${key}=${value}`
  )
  const data = await response.json()
  console.log(key, value, data[0])

  if (!data[0]) return null

  return data[0]
}

export async function updateUserData(id, updateData) {
  const response = await fetch(`${JSON_SERVER_URI}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  const data = await response.json()

  return data
}

/** 
 * Check if the username is already exist or not
 * @param {string} username
 * @returns {Promise<boolean>} A promise that resolves to a boolean
 */
export async function isUsernameExist(username) {
  const user = await fetchUserBy('username', username)
  console.log(user)
  return user ? true : false
}

/** 
 * Check if the email is already exist or not
 * @param {string} email
 * @returns {Promise<boolean>} A promise that resolves to a boolean
 */
export async function isEmailExist(email) {
  const user = await fetchUserBy('email', email)
  return user ? true : false
}

/** 
 * Fetches a token by a given id
 * @param {string} id - The id of the token
 * @returns {Promise<object>} A promise that resolves to a token object
 */
export async function fetchTokenById(id) {
  const response = await fetch(
    `${JSON_SERVER_URI}/tokens?id=${id}`
  )
  const data = await response.json()
  return data[0]
}

/** 
 * Check if the token id is already exist or not
 * @param {string} id - The id of the token
 * @returns {Promise<boolean>} A promise that resolves to a boolean
 */
export async function isTokenIdExist(id) {
  const response = await fetchTokenById(id)
  return response ? true : false
}

/**
 * Create or update a token by a given user id
 * @param {string} userId - The id of the user
 * @returns {Promise<object>} A promise that resolves to a token object
 * @example
 * const token = await createOrUpdateToken('1')
 * console.log(token) // { id: '1', token: 'randomString123' }
 */ 
export async function createOrUpdateToken(userId) {
  const isTokenExist = await isTokenIdExist(userId)
  console.log(isTokenExist)
  const tokenObj = {
    id: userId,
    token: Math.random().toString(36).split('.')[1],
  }

  await fetch(
    `${JSON_SERVER_URI}/tokens${
      isTokenExist ? `/${userId}` : ''
    }`,
    {
      method: isTokenExist ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...tokenObj, expired_at: Date.now() + 604_800_000}),
    }
  )
    .then((response) => response.json())
    .then((data) => {
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  return tokenObj
}

/** 
 * Delete a token by a given id
 * @param {string} id - The id of the token
 * @returns {Promise<void>} A promise that resolves to void
 */
export async function deleteTokenById(id) {
  const response = await fetch(`${JSON_SERVER_URI}/tokens/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

/** 
 * Login the user by username or email and password 
 * @param {string} usernameOrEmail - The username or email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<object>} A promise that resolves to a token object or null if the user is not found or the password is incorrect
 * @example
 * const token = await login('username', 'password')
 * console.log(token) // { id: '1', token: 'randomString' }
 */
export async function login(usernameOrEmail, password) {
  const user = await fetchUserBy(isEmail(usernameOrEmail) ? 'email' : 'username', usernameOrEmail)

  if (user && user.password === hash(password)) {
    const token = await createOrUpdateToken(user.id)
    return token
  } else {
    return null
  }
}

/** 
 * Logout the user by user id
 * @param {string} userId - The id of the user
 * @returns {Promise<void>} A promise that resolves to void
 */
export async function logout(userId) {
  await deleteTokenById(userId)
}

/**
 * Register a new user
 * @param {string} username - The username of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {Promise<object>} A promise that resolves to a user object
 * @example
 * const user = await register('username', 'email', 'password')
 * console.log(user) // { id: '1', username: 'username', email: 'email', password: 'password' }
 */
export async function register(username, email, password, nickname = '') {
  const response = await fetch(`${JSON_SERVER_URI}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password: hash(password), nickname }),
  })
  const newUser = await response.json()
  return newUser
}

/**
 * Check if the password is secure or not
 * @param {String} password - The password of the user
 * @returns {boolean} A boolean that indicates if the password is secure or not 
 */
export function isPasswordSecure(password) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return reg.test(password)
}

export async function validateToken(){
  const validationStatus = {
    isTokenValid: false,
    userId: null
  }
  const decryptedLocalToken = JSON.parse(decrypt(localStorage.getItem('todo_token'), secretKey))
  const actualToken = await fetchTokenById(decryptedLocalToken?.id)

  console.log('localToken', decryptedLocalToken)
  console.log('actualToken', actualToken)

  if (!decryptedLocalToken || !actualToken) {
    console.log('Token not found')
    return validationStatus
  }

  if (actualToken.token === decryptedLocalToken.token) {
    if(actualToken.expired_at - Date.now() < 0) {
      console.log('Token is expired')
      return validationStatus
    }
    console.log('Token is valid')
    validationStatus.isTokenValid = true
    validationStatus.userId = actualToken.id
    return validationStatus
  } else {
    console.log('Token is invalid')
    return validationStatus
  }
}