import Home from '@/pages/index'
import { expect, vi, test } from 'vitest'
import { render, waitFor, screen } from '@testing-library/react'

vi.mock('@/pages/api/resas', () => ({
  getRESAS: vi.fn((path) => {
    if (path === '/api/v1/prefectures') {
      return Promise.resolve({
        result: [
          { prefCode: 1, prefName: '北海道' },
          { prefCode: 2, prefName: '青森県' },
        ],
      })
    } else if (path.includes('/api/v1/population/composition/perYear')) {
      return Promise.resolve({
        result: {
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                { year: 1980, value: 12817 },
                { year: 1985, value: 12707 },
              ],
            },
          ],
        },
      })
    }
    return Promise.reject(new Error('Unexpected endpoint'))
  }),
}))

test('Home', async () => {
  render(<Home />)
  await waitFor(() => {
    const hokkaidoElement = screen.queryByText('北海道')
    const aomoriElement = screen.queryByText('青森県')
    expect(hokkaidoElement).toBeTruthy()
    expect(aomoriElement).toBeTruthy()

    // 今後の課題：チェックボックスクリックによる人口構成API呼び出しの結果を確認するテストケースを追加する
  })
})
