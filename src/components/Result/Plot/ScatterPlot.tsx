import { FC } from 'react'
import {
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

type Props = {
    x: number[]
    y: number[]
}

export const ScatterPlot: FC<Props> = ({ x, y }) => {
    const data = x.map((v, i) => ({ x: v, y: y[i] }))

    return (
        <ResponsiveContainer width='100%' aspect={1.3}>
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
            >
                <CartesianGrid strokeDasharray='4 4' stroke='#9ca3af' />
                <XAxis
                    type='number'
                    dataKey='x'
                    domain={[0, 1]}
                    ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
                    label={{ value: 'μ̂ₓ', position: 'insideBottomRight', dy: 20, fontSize: 14 }}
                    padding={{ left: 10, right: 10 }}
                />
                <YAxis
                    type='number'
                    dataKey='y'
                    domain={[0, 0.4]}
                    ticks={[0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40]}
                    label={{ value: 'μ_D', angle: -90, position: 'insideLeft', dx: -20, fontSize: 14 }}
                    padding={{ top: 10, bottom: 10 }}
                />
                <Tooltip formatter={(v: number) => v.toFixed(2)} />
                <Scatter
                    name='points'
                    data={data}
                    fill='#000'
                    shape='circle'
                    line={false}
                />
            </ScatterChart>
        </ResponsiveContainer>
    )
}
