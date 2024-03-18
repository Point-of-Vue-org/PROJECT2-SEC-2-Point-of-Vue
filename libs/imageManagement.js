const jsonServerUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function saveImageURL(imageURL) {
  const response = await fetch(`${jsonServerUrl}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: imageURL })
  })

  return response.json()
}

export async function upload(imageFile) {
  const data = new FormData()
  data.append('image', imageFile)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`, {
    method: 'POST',
    body: data
  })

  const json = await response.json()
  console.log(json);
  return json.data.display_url
}