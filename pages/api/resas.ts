const baseURL = 'https://opendata.resas-portal.go.jp'

export const getRESAS = async (path: string, headers = {}) => {
  try {
    const response = await fetch(baseURL + path, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.RESAS_API_KEY || '',
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error. status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error catched while fetching: ', error)
    throw error
  }
}
