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

export const Solve = ({ algorithmType, shapes, edges, onCloseSolve, setError }: IProps) => {
    const [fromNode, setFromNode] = useState(shapes[0].id)
    const [toNode, setToNode] = useState(shapes[1].id)
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        setResult(null)
    }, [algorithmType, fromNode, toNode])

    const onSolve = () => {
        const algNodes = shapes.map(n => n.id)

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
                setError('You can not use Bellman-Ford algorithm in graph with negative cycle')
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
                setError('You can not use Floyd-Warshall algorithm in graph with negative cycle')
                return
            }
            setResult(res)
        }
    }

    return (
        <Modal isOpen={algorithmType !== -1} onClose={onCloseSolve} >
            <div className="solve-modal">
                <div className='connect-modal__container'>
                    <label className="connect-modal__label">Node From: </label>
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
                    <label className="connect-modal__label">Node To: </label>
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
                <div className="connect-modal__button" onClick={onSolve}>Solve</div>
                {result && <div className="connect-modal__result">
                    <h3 className="connect-modal__subtitle">The shortest path:</h3>
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
                    <h3 className="connect-modal__subtitle">The path weight = {result.distance}</h3>
                </div>}
            </div>
        </Modal >
    )
}