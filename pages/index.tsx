import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getRESAS } from '@/pages/api/resas'

export default function Home() {
  interface Prefecture {
    prefCode: number
    prefName: string
  }
  interface SelectedPrefectures {
    [prefCode: number]: boolean
  }

  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefectures, setSelectedPrefectures] = useState<SelectedPrefectures>({})

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRESAS('/api/v1/prefectures')
      setPrefectures(response.result || [])
    }

    fetchData()
  }, [])

  const handleCheckboxChange = async (prefCode: number, isChecked: boolean) => {
    setSelectedPrefectures((prev) => ({
      ...prev,
      [prefCode]: isChecked,
    }))

    if (!selectedPrefectures[prefCode]) {
      console.log('api called')
      // const response = await getRESAS('/api/v1/population/composition/perYear', prefCode)
    }
  }

  return (
    <>
      <Head>
        <title>総人口推移</title>
      </Head>
      <main>
        <div>
          {prefectures.map(({ prefCode, prefName }) => (
            <div key={prefCode}>
              <input
                type="checkbox"
                id={`pref-${prefCode}`}
                name="prefectures"
                value={prefCode}
                onChange={(e) => handleCheckboxChange(prefCode, e.target.checked)}
                checked={selectedPrefectures[prefCode] || false}
              />
              <label htmlFor={`pref-${prefCode}`}>{prefName}</label>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
