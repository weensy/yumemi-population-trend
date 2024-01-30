import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getRESAS } from '@/pages/api/resas'

export default function Home() {
  const [prefectures, setPrefectures] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await getRESAS('/api/v1/prefectures')
      setPrefectures(response.result || [])
    }

    fetchData()
  }, [])
  return (
    <>
      <Head>
        <title>総人口推移</title>
      </Head>
      <main>
        <div>
          {prefectures.map(
            (prefecture: { prefCode: number; prefName: string }) => (
              <div key={prefecture.prefCode}>
                <input
                  type="checkbox"
                  id={`pref-${prefecture.prefCode}`}
                  name="prefectures"
                  value={prefecture.prefCode}
                />
                <label htmlFor={`pref-${prefecture.prefCode}`}>
                  {prefecture.prefName}
                </label>
              </div>
            )
          )}
        </div>
      </main>
    </>
  )
}
