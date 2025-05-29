import { useLocation } from "react-router-dom"
import { MatrixTable } from "./MatrixTable/MatrixTable"
import './Result.css'
import { EdgeData, ShapeData } from "../../types"
import { dijkstra } from "../../algorithm/dijkstra"
import { ScatterPlot } from "./Plot/ScatterPlot"
import { MultiLinePlot } from "./Plot/MultiLinePlot"
import { InlineMath } from "react-katex"
import { ArrowRSvg } from "../GraphEditor/Edges/Connect/images/ArrowRSvg"
import { floydWarshall } from "../../algorithm/floydWarshall"
import { bellmanFord } from "../../algorithm/bellmanFord"
import { useEffect, useState } from "react"
import { Box, CircularProgress } from "@mui/material"

type DataState = {
    algorithmType: number
    shapes: ShapeData[]
    edges: EdgeData[]
    fromNode: number
    toNode: number
    gridSize: number
}

export const getGrid = (size: number): number[] =>
    Array(size + 1)
        .fill(0)
        .map((_, i) => i / size)

const findCross = (grid: number[], muC: number[]) => {
    for (let i = 0; i < grid.length - 1; i++) {
        const d1 = grid[i] - muC[i]
        const d2 = grid[i + 1] - muC[i + 1]
        if (d1 === 0) return { x: grid[i], y: grid[i] }
        if (d1 * d2 < 0) {
            const t = d1 / (d1 - d2)
            const x = grid[i] + t * (grid[i + 1] - grid[i])
            const y = grid[i] + t * (grid[i + 1] - grid[i])
            return { x, y }
        }
    }
    return null
}

const toLatex = (v: string) => {
    const isLatex = v.includes('\\') || (/^\$.+\$$/.test(v))
    if (isLatex) {
        const math = v.replace(/^\$/, '').replace(/\$$/, '')
        return <InlineMath math={math} />
    }
    return v
}

const buildRanges = (grid: number[], paths: number[][]) => {
    type Segment = { from: number; to: number; path: number[] }
    const out: Segment[] = []
    grid.forEach((x, i) => {
        const p = paths[i]
        const prev = out[out.length - 1]
        if (!prev || JSON.stringify(prev.path) !== JSON.stringify(p)) {
            out.push({ from: x, to: x, path: p })
        } else {
            prev.to = x
        }
    })
    return out
}

export const ResultPage = () => {
    const [data, setData] = useState<DataState | null>(null)

    useEffect(() => {
        const raw = localStorage.getItem('resultData')
        if (raw) setData(JSON.parse(raw))
    }, [])

    if (!data)
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh'
                }}
            >
                <CircularProgress size={60} thickness={4} />
            </Box>
        )

    const { edges, shapes, fromNode, toNode, algorithmType, gridSize } = data

    const grid = getGrid(gridSize)
    const roads = edges
        .map<[string, ...number[]]>(el => {
            const from = shapes.find(s => s.id === el.from)?.label ?? ''
            const to = shapes.find(s => s.id === el.to)?.label ?? ''
            const label = `(${from},${to})`
            return [label, ...el.fuzzy]
        })
        .sort(
            ([aLabel], [bLabel]) =>
                aLabel.localeCompare(bLabel, undefined, { numeric: true })
        )

    const stepResult = roads.map(el => {
        const row = grid.map(g => +(+el[1] + g * (+el[2] - +el[1])).toFixed(4))
        return [el[0], ...row]
    })

    const algNodes = shapes.map(n => n.id)
    const results: number[] = []
    const path: number[][] = []

    for (const g of grid) {
        const newEdges = edges.map(e => {
            return {
                ...e,
                weight: e.fuzzy[0] + g * (e.fuzzy[1] - e.fuzzy[0])
            }
        })
        let result = null
        if (algorithmType === 0) {
            result = dijkstra(algNodes, newEdges, fromNode, toNode)
        }
        if (algorithmType === 1) {
            result = floydWarshall(algNodes, newEdges, fromNode, toNode)
        }
        if (algorithmType === 2) {
            result = bellmanFord(algNodes, newEdges, fromNode, toNode)
        }
        if (result) {
            results.push(+result.distance.toFixed(4))
            path.push(result.path)
        }
    }

    const muC: number[] = results.map(t => {
        const T_min = Math.min(...results)
        const T_max = Math.max(...results)
        return +((T_max - t) / (T_max - T_min)).toFixed(4)
    })

    const muD = grid.map((_, idx) => Math.min(grid[idx], muC[idx]))

    const summary: (string | number)[][] = [
        ['\\mu_{\\hat X}', ...grid],
        ['t_{\\text{min}}', ...results],
        ['\\mu_{c}', ...muC],
        ['\\mu_{\\hat D}', ...muD]
    ]

    return (
        <div className="page">
            <h3 className="table_header">Вихідні дані та проміжні результати для завдання про найкоротший маршрут (Δ⋅k)</h3>
            <MatrixTable headers={grid} data={stepResult}></MatrixTable>
            <h3 className="table_header">Підсумокові результати</h3>
            <MatrixTable headers={grid} data={summary}></MatrixTable>
            <div className="result_path__container">
                {buildRanges(grid, path).map(({ from, to, path }) => (
                    <div className="result_range" key={from}>
                        <p className="result_range__p">
                            {toLatex('\\mu_{\\hat X}')}
                            {from === to ? `= ${from}` : ` ∈ [${from}, ${to}] : `}
                        </p>
                        <div className="connect-modal__path">
                            {path.map((e: number, idx: number) => {
                                return (
                                    <div className="connect-modal__path-item" key={e}>
                                        <p className="connect-modal__node">{shapes.find(f => f.id === e)?.label}</p>
                                        {(idx !== path.length - 1) &&
                                            <div className="connect-modal__path-arrow">
                                                <p className="connect-modal__path-weight">
                                                    {edges.find(f => f.from === e && f.to === path[idx + 1])?.weight}
                                                </p>
                                                <ArrowRSvg width="30px" height="30px" fill="#000" />
                                            </div>}
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <h3 className="table_header">Графіки функції належності нечіткого рішення</h3>
            <ScatterPlot x={grid} y={muD} />
            <p className="table_title">{toLatex('\\mu_{\\hat X}')} = {Math.max(...muD)}</p>
            <MultiLinePlot x1={grid} y1={grid} x2={grid} y2={muC} />
            <p className="table_title">{toLatex('\\mu_{\\hat X}')} = {+findCross(grid, muC)!.x.toFixed(4)}</p>
        </div>
    )
}