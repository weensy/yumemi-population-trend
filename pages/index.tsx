import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getRESAS } from '@/pages/api/resas'
import { PopulationChart } from '@/components/PopulationChart'
import styles from '@/styles/Home.module.css'

export default function Home() {
  interface Prefecture {
    prefCode: number
    prefName: string
  }
  interface PopulationData {
    name: string
    data: { year: number; value: number }[]
  }

  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [populationData, setPopulationData] = useState<PopulationData[]>([])
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState('総人口')

  // 都道府県一覧取得
  useEffect(() => {
    const fetchData = async () => {
      const response = await getRESAS('/api/v1/prefectures')
      setPrefectures(response.result || [])
    }

    fetchData()
  }, [])

  // 人口構成取得
  useEffect(() => {
    const fetchPopulationData = async () => {
      const newData = await Promise.all(
        selectedPrefCodes.map(async (code) => {
          const response = await getRESAS('/api/v1/population/composition/perYear', {
            prefCode: code,
          })
          const prefName = prefectures.find((p) => p.prefCode === code)?.prefName || ''
          return {
            name: prefName,
            data: response.result.data.find((d: any) => d.label === selectedCategory).data,
          }
        })
      )
      setPopulationData(newData)
    }

    if (selectedPrefCodes.length > 0) {
      fetchPopulationData()
    } else {
      setPopulationData([])
    }
  }, [selectedPrefCodes, selectedCategory, prefectures])

  // Checkbox handler
  const handleCheckboxChange = async (prefCode: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPrefCodes((prev) => [...prev, prefCode])
    } else {
      setSelectedPrefCodes((prev) => prev.filter((code) => code !== prefCode))
    }
  }

  return (
    <>
      <Head>
        <title>都道府県別総人口推移</title>
        <meta name="description" content="都道府県別総人口推移グラフ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>都道府県別総人口推移</h1>
        <div className={styles.container}>
          <div className={styles.contentLeft}>
            {prefectures.map(({ prefCode, prefName }) => (
              <div key={prefCode} className={styles.prefectures}>
                <input
                  type="checkbox"
                  id={`pref-${prefCode}`}
                  name="prefectures"
                  value={prefCode}
                  onChange={(e) => handleCheckboxChange(prefCode, e.target.checked)}
                />
                <label htmlFor={`pref-${prefCode}`}>{prefName}</label>
              </div>
            ))}
          </div>
          <div className={styles.contentRight}>
            <div>
              <label>
                <input
                  type="radio"
                  value="総人口"
                  checked={selectedCategory === '総人口'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                総人口
              </label>
              <label>
                <input
                  type="radio"
                  value="年少人口"
                  checked={selectedCategory === '年少人口'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                年少人口
              </label>
              <label>
                <input
                  type="radio"
                  value="生産年齢人口"
                  checked={selectedCategory === '生産年齢人口'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                生産年齢人口
              </label>
              <label>
                <input
                  type="radio"
                  value="老年人口"
                  checked={selectedCategory === '老年人口'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                老年人口
              </label>
            </div>
            <div className={styles.populationChart}>
              <PopulationChart data={populationData} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
