import { User } from '../classes/User'
import { isEmail } from './utils'
import { decrypt, hash } from './plannetEncrypt.js'

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'

/**
 * Fetches all users from the JSON server API
 * @param {boolean} computeDerivedData - A boolean that indicates if the derived data should be computed
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects
 * @example
 * const users = await getUsers()
 * console.log(users) // [User, User, User, ...]
 */
export async function getUsers(computeDerivedData = false){
  const response = await fetch(`${JSON_SERVER_URI}/users`)
  const data = await response.json()
  const users = data.map(userData => {
    const user = new User(userData)
    return user
  })

  if (computeDerivedData) {
    for (const user of users) {
      await user.computeDerivedData()
    }
  }

  return users
}

/**
 * Fetches a user by a given key and value
 * @param {string} key - The key to search by
 * @param {string} value - The value to search for
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects
 */
export async function getUsersBy(key, value) {
  if (!key || !value) return null
  const response = await fetch(
    `${JSON_SERVER_URI}/users?${key}=${value}`
  )
  const data = await response.json()
  if (!data) return null
  return data
}

/**
 * Fetches a first user that match by a given key and value
 * @param {string} key - The key to search by
 * @param {string} value - The value to search for
 * @returns {Promise<User>} A promise that resolves to a User object
 */
export async function getUserBy(key, value) {
  if (!key || !value) return null
  const data = await getUsersBy(key, value)
  if (!data[0]) return null
  return data[0]
}

export async function updateUserData(id, updateData) {
  const response = await fetch(`${JSON_SERVER_URI}/users/${id}`, {
    method: 'PATCH',
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
  const user = await getUserBy('username', username)
  return user ? true : false
}

export async function isUserIdExist(userId) {
  const user = await getUserBy('id', userId)
  return user ? true : false
}

/** 
 * Check if the email is already exist or not
 * @param {string} email
 * @returns {Promise<boolean>} A promise that resolves to a boolean
 */
export async function isEmailExist(email) {
  const user = await getUserBy('email', email)
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
  const user = await getUserBy(isEmail(usernameOrEmail) ? 'email' : 'username', usernameOrEmail)

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
export async function register(username, email, password) {
  const response = await fetch(`${JSON_SERVER_URI}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(new User({ username, email, password: hash(password) })),
  })
  const newuser = await response.json()
  return newuser
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
  const decryptedLocalToken = JSON.parse(decrypt(localStorage.getItem('plannet_token')))
  const actualToken = await fetchTokenById(decryptedLocalToken?.id)

  if (!decryptedLocalToken || !actualToken) {
    return validationStatus
  }

  if (actualToken.token === decryptedLocalToken.token) {
    if(actualToken.expired_at - Date.now() < 0) {
      return validationStatus
    }
    validationStatus.isTokenValid = true
    validationStatus.userId = actualToken.id
    return validationStatus
  } else {
    return validationStatus
  }
}

/**
 * The function `deleteUser` sends a DELETE request to a JSON server API to delete a user with the
 * specified userId.
 * @param userId - The `userId` parameter is the unique identifier of the user that you want to delete
 * from the server.
 * @returns The `fetch` function is being returned, which sends a DELETE request to the specified JSON
 * server URI to delete a user with the given `userId`.
 */
export function deleteUser(userId){
  return fetch(`${JSON_SERVER_URI}/users/${userId}`, {
    method: 'DELETE',
  })
}