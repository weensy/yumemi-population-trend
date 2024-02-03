import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PopulationChart } from '@/components/PopulationChart'
import HighchartsReact from 'highcharts-react-official'

vi.mock('highcharts-react-official', () => ({
  __esModule: true,
  default: vi.fn(() => null),
}))

describe('PopulationChart', () => {
  it('renders without crashing when data is empty', () => {
    const { container } = render(<PopulationChart data={[]} />)
    expect(container).toBeDefined()
  })

  it('sets correct chart options based on data', () => {
    const mockData = [
      {
        name: 'Test Series',
        data: [
          { year: '2020', value: 1000 },
          { year: '2021', value: 2000 },
        ],
      },
    ]

    render(<PopulationChart data={mockData} />)

    expect(HighchartsReact).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          xAxis: expect.objectContaining({
            categories: ['2020', '2021'],
          }),
          series: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Series',
              data: [1000, 2000],
            }),
          ]),
        }),
      }),
      expect.anything()
    )
  })
})
