const baseURL = 'https://opendata.resas-portal.go.jp'

export const getRESAS = async (
  path: string,
  queryParams: Record<string, string | number> = {},
  headers = {}
) => {
  try {
    const searchParams = new URLSearchParams(queryParams as Record<string, string>)
    const url = `${baseURL}${path}?${searchParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_RESAS_API_KEY || '',
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
