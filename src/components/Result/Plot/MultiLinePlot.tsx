// MultiLinePlot.tsx
import { FC } from 'react'
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

type Props = {
    x1: number[]
    y1: number[]
    x2: number[]
    y2: number[]
}

/* знайти точку перетину двох ламаних (лінійна інтерполяція) */


export const MultiLinePlot: FC<Props> = ({ x1, y1, x2, y2 }) => {
    const s1 = x1.map((x, i) => ({ x, y: y1[i] }))
    const s2 = x2.map((x, i) => ({ x, y: y2[i] }))
    const ticks = Array.from({ length: 11 }, (_, i) => i / 10)

    return (
        <ResponsiveContainer width='100%' aspect={1.2}>
            <LineChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#9ca3af' />

                <XAxis
                    type='number'
                    dataKey='x'
                    domain={[0, 1]}
                    ticks={ticks}
                    padding={{ left: 5, right: 5 }}
                    label={{ value: 'μᵢⱼ(t)', position: 'insideBottomRight', dy: 25 }}
                />

                <YAxis
                    domain={[0, 1]}
                    ticks={ticks}
                    label={{ value: 'y', angle: -90, position: 'insideLeft', dx: -25 }}
                />

                <Tooltip
                    formatter={(v: number) => v.toFixed(2)}
                    labelFormatter={(v: number) => v.toFixed(2)}
                />

                <Line
                    name='μ̂ₓ'
                    data={s1}
                    type='linear'
                    dataKey='y'
                    stroke='#000'
                    strokeWidth={2}
                    dot={{ fill: '#000', r: 4 }}
                />

                <Line
                    name='μ_c'
                    data={s2}
                    type='linear'
                    dataKey='y'
                    stroke='#000'
                    strokeWidth={2}
                    dot={{ fill: '#000', stroke: '#000', r: 4 }}
                    strokeDasharray='5 2'
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
