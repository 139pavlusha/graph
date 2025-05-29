import { useEffect, useState } from "react"
import { Modal } from "../../Modal/Modal"
import { EdgeData, ShapeData } from "../../../types"
import { dijkstra } from "../../../algorithm/dijkstra"
import { ArrowRSvg } from "../Edges/Connect/images/ArrowRSvg"
import './Solve.css'
import { bellmanFord } from "../../../algorithm/bellmanFord"
import { bellmanFordValidator, dijkstraValidator, floydWarshallValidator } from "../../../algorithm/graphValidation"
import { floydWarshall } from "../../../algorithm/floydWarshall"

interface IProps {
    algorithmType: number
    shapes: ShapeData[]
    edges: EdgeData[]
    onCloseSolve: () => void
    setError: React.Dispatch<React.SetStateAction<string>>
}

const detectEdgeType = (edges: EdgeData[]) => {
    let isWeight = false
    let isFuzzy = false
    for (const e of edges) {
        if (e.fuzzy.length) isFuzzy = true
        if (e.weight) isWeight = true
    }

    if (isFuzzy && isWeight) return 'mixed'
    if (isFuzzy) return 'fuzzy'
    if (isWeight) return 'weight'
    return 'none'
}

export const Solve = ({ algorithmType, shapes, edges, onCloseSolve, setError }: IProps) => {
    const [fromNode, setFromNode] = useState(shapes[0].id)
    const [toNode, setToNode] = useState(shapes[1].id)
    const [result, setResult] = useState<any>(null)
    const [gridSize, setGridSize] = useState<number>(10)

    useEffect(() => {
        setResult(null)
    }, [algorithmType, fromNode, toNode])

    const onSolve = () => {
        const algNodes = shapes.map(n => n.id)
        if (detectEdgeType(edges) === 'fuzzy') {
            const payload = { edges, shapes, fromNode, toNode, algorithmType, gridSize }
            localStorage.setItem('resultData', JSON.stringify(payload))
            window.open('/graph/result', '_blank', 'noopener')
            return
        }

        if (algorithmType === 0) {
            const { success, error } = dijkstraValidator(edges, fromNode, toNode)
            if (!success) {
                setError(error)
                return
            }
            const res = dijkstra(algNodes, edges, fromNode, toNode)
            setResult(res)
        }
        if (algorithmType === 1) {
            const { success, error } = floydWarshallValidator(edges, fromNode, toNode)
            if (!success) {
                setError(error)
                return
            }
            const res = floydWarshall(algNodes, edges, fromNode, toNode)
            if (res.hasNegativeCycle) {
                setError('Ви не можете використовувати алгоритм Беллмана-Форда в графі з негативним циклом')
                return
            }
            setResult(res)
        }
        if (algorithmType === 2) {
            const { success, error } = bellmanFordValidator(edges, fromNode, toNode)
            if (!success) {
                setError(error)
                return
            }
            const res = bellmanFord(algNodes, edges, fromNode, toNode)
            if (res.hasNegativeCycle) {
                setError('Ви не можете використовувати алгоритм Флойда-Уоршала в графі з негативним циклом')
                return
            }
            setResult(res)
        }
    }

    return (
        <Modal isOpen={algorithmType !== -1} onClose={onCloseSolve} >
            <div className="solve-modal">
                <div className='connect-modal__container'>
                    <label className="connect-modal__label">Початкова вершина: </label>
                    <select
                        className='connect-modal__select'
                        value={fromNode}
                        onChange={e => {
                            const val = parseInt(e.target.value, 10)
                            setFromNode(val)
                        }}
                    >
                        {shapes.map(shape => (
                            <option key={shape.id} value={shape.id}>
                                {shape.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='connect-modal__container'>
                    <label className="connect-modal__label">Кінцева вершина: </label>
                    <select
                        className='connect-modal__select'
                        value={toNode}
                        onChange={e => {
                            const val = parseInt(e.target.value, 10)
                            setToNode(val)
                        }}
                    >
                        {shapes.map(shape => (
                            <option key={shape.id} value={shape.id}>
                                {shape.label}
                            </option>
                        ))}
                    </select>
                </div>
                {detectEdgeType(edges) === 'fuzzy' && <div className='connect-modal__container'>
                    <label className="connect-modal__label">Оберіть розмір сітки: </label>
                    <select
                        className='connect-modal__select'
                        value={gridSize}
                        onChange={e => {
                            const val = parseInt(e.target.value, 10)
                            setGridSize(val)
                        }}
                    >
                        {[10, 20, 50, 100].map(el => (
                            <option key={el} value={el}>
                                {el}
                            </option>
                        ))}
                    </select>
                </div>}
                <div className="connect-modal__button" onClick={onSolve}>Розв'язати</div>
                {result && <div className="connect-modal__result">
                    <h3 className="connect-modal__subtitle">Найкоротший шлях:</h3>
                    <div className="connect-modal__path">
                        {result.path.map((e: number, idx: number) => {
                            return (
                                <div className="connect-modal__path-item" key={e}>
                                    <p className="connect-modal__node">{shapes.find(f => f.id === e)?.label}</p>
                                    {(idx !== result.path.length - 1) &&
                                        <div className="connect-modal__path-arrow">
                                            <p className="connect-modal__path-weight">
                                                {edges.find(f => f.from === e && f.to === result.path[idx + 1])?.weight}
                                            </p>
                                            <ArrowRSvg width="30px" height="30px" fill="#000" />
                                        </div>}
                                </div>
                            )
                        }
                        )}
                    </div>
                    <h3 className="connect-modal__subtitle">Вартість шляху = {result.distance}</h3>
                </div>}
            </div>
        </Modal >
    )
}