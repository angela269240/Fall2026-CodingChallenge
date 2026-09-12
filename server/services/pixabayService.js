async function getImageById(pixabayId) {
  const apiKey = process.env.PIXABAY_API_KEY

  const url =
    `https://pixabay.com/api/?key=${apiKey}` +
    `&id=${pixabayId}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Pixabay request failed: ${response.status}`
    )
  }

  const data = await response.json()

  if (!data.hits || data.hits.length === 0) {
    return null
  }

  return data.hits[0]
}

module.exports = {
  getImageById
}