import { Comment } from "../classes/Comment"

const JSON_SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:5000'

export async function getCommentsBy(key, value) {
  const url = `${JSON_SERVER_URI}/comments?${key}=${value}`
  const res = await fetch(url)
  const data = await res.json()
  return data.map((commentData) => new Comment(commentData))
}