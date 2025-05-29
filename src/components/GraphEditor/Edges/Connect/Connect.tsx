import './Connect.css'
import { useState } from "react"
import { EdgeData, ShapeData } from "../../../../types"
import { ArrowRSvg } from './images/ArrowRSvg'
import { ArrowLSvg } from './images/ArrowLSvg'
import { ArrowDSvg } from './images/ArrowDSvg'

interface IProps {
    shapes: ShapeData[]
    edges: EdgeData[]
    edgeCount: number
    setEdges: React.Dispatch<React.SetStateAction<EdgeData[]>>
    setEdgeCount: React.Dispatch<React.SetStateAction<number>>
    setError: React.Dispatch<React.SetStateAction<string>>
    onConnectModalClose: () => void
}

const isFuzzyChecker = (arr: number[]) => {
    if (arr[0] === arr[1] && arr[1] === arr[2] && arr[2] === 0) {
        return false
    }
    return true
}

export const Connect = ({ shapes, edges, edgeCount, setEdges, setEdgeCount, onConnectModalClose, setError }: IProps) => {
    const [type, setType] = useState(0)
    const [isWeight, setIsWeight] = useState('fuzzy')
    const [weight, setWeight] = useState<number>(1)
    const [fuzzy, setFuzzy] = useState<number[]>([0, 0, 0])
    const [selectedNodeA, setSelectedNodeA] = useState<number>(shapes[0].id)
    const [selectedNodeB, setSelectedNodeB] = useState<number>(shapes[1].id)

    const handleConnectNodes = () => {
        if (selectedNodeA === selectedNodeB) {
            setError("Ви не можете з'єднати одну й ту саму вершину")
            return
        }
        const exist = edges.filter(e => (e.from === selectedNodeA && e.to === selectedNodeB) || (e.from === selectedNodeB && e.to === selectedNodeA))
        if (exist.length) {
            setError("Ці вершини вже з'єднані")
            return
        }

        if (isWeight && Math.abs(weight) > 999) {
            setError('Вага ребра повинна бути в діапазоні [-999; 999]')
            return
        }

        let newEdge: EdgeData
        if (type === 0) {
            newEdge = {
                id: edgeCount,
                from: selectedNodeA,
                to: selectedNodeB,
                orientation: false,
                fuzzy: isFuzzyChecker(fuzzy) ? fuzzy : [],
                weight: isWeight === 'yes' ? (weight || null) : null
            }
        } else if (type === 1) {
            newEdge = {
                id: edgeCount,
                from: selectedNodeA,
                to: selectedNodeB,
                orientation: true,
                fuzzy: isFuzzyChecker(fuzzy) ? fuzzy : [],
                weight: isWeight === 'yes' ? (weight || null) : null
            }
        } else {
            newEdge = {
                id: edgeCount,
                from: selectedNodeB,
                to: selectedNodeA,
                orientation: true,
                fuzzy: isFuzzyChecker(fuzzy) ? fuzzy : [],
                weight: isWeight === 'yes' ? (weight || null) : null
            }
        }

        setEdges(prev => [...prev, newEdge])
        setEdgeCount(prev => prev + 1)
        onConnectModalClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.abs(+e.target.value)
        if (val <= 999) {
            setWeight(parseInt(e.target.value, 10))
        }
    }

    const handleFuzzyChange = (e: React.ChangeEvent<HTMLInputElement>, pos: number) =>
        setFuzzy(prev => {
            const next = [...prev]
            next[pos] = Number(e.target.value)
            return next
        })

    return (
        <div className="connect-modal">
            <h3 className="connect-modal__title">Оберіть вершини, які хочете з'єднати</h3>

            <div className='connect-modal__container'>
                <label className="connect-modal__label">Вершина A: </label>
                <select
                    className='connect-modal__select'
                    value={selectedNodeA}
                    onChange={e => {
                        const val = parseInt(e.target.value, 10)
                        setSelectedNodeA(val)
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
                <label className="connect-modal__label">Вершина B: </label>
                <select
                    className='connect-modal__select'

                    value={selectedNodeB}
                    onChange={e => {
                        const val = parseInt(e.target.value, 10)
                        setSelectedNodeB(val)
                    }}
                >
                    {shapes.map(shape => (
                        <option key={shape.id} value={shape.id}>
                            {shape.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className='connect-modal__orientations'>
                <div onClick={() => setType(0)} className={`connect-modal__orientation ${type === 0 ? 'connect-modal__orientation--selected' : ''}`}>
                    <p className='connect-modal__orientation-text'>A</p>
                    <ArrowDSvg width='30px' height='30px' fill={type === 0 ? '#fff' : '#000'} />
                    <p className='connect-modal__orientation-text'>B</p>
                </div>
                <div onClick={() => setType(1)} className={`connect-modal__orientation ${type === 1 ? 'connect-modal__orientation--selected' : ''}`}>
                    <p className='connect-modal__orientation-text'>A</p>
                    <ArrowRSvg width='30px' height='30px' fill={type === 1 ? '#fff' : '#000'} />
                    <p className='connect-modal__orientation-text'>B</p>
                </div>
                <div onClick={() => setType(2)} className={`connect-modal__orientation connect-modal__orientation--last ${type === 2 ? 'connect-modal__orientation--selected' : ''}`}>
                    <p className='connect-modal__orientation-text'>A</p>
                    <ArrowLSvg width='30px' height='30px' fill={type === 2 ? '#fff' : '#000'} />
                    <p className='connect-modal__orientation-text'>B</p>
                </div>
            </div>

            {isWeight === 'yes' && <div className='connect-modal__weight-container'>
                <label className='connect-modal__weight-label'>Додати вагу</label>
                <input
                    className='connect-modal__weight-input'
                    type='number'
                    value={weight}
                    onChange={handleChange}
                />
                <div>
                    <input
                        className='connect-modal__weight-range'
                        type='range'
                        min={1}
                        max={30}
                        value={weight}
                        onChange={handleChange}
                    />
                </div>
            </div>}

            {isWeight === 'fuzzy' && <div className='connect-modal__weight-container'>
                <label className='connect-modal__weight-label'>Додати вагу</label>
                <input
                    className='connect-modal__weight-input'
                    type='number'
                    value={fuzzy[0]}
                    onChange={(e) => handleFuzzyChange(e, 0)}
                />
                <input
                    className='connect-modal__weight-input'
                    type='number'
                    value={fuzzy[1]}
                    onChange={(e) => handleFuzzyChange(e, 1)}
                />
                <input
                    className='connect-modal__weight-input'
                    type='number'
                    value={fuzzy[2]}
                    onChange={(e) => handleFuzzyChange(e, 2)}
                />
            </div>}

            <div className='connect-modal__weight'>
                <div onClick={() => setIsWeight('yes')} className={`connect-modal__weight-options ${isWeight === 'yes' ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Додати вагу</p>
                </div>
                <div onClick={() => setIsWeight('no')} className={`connect-modal__weight-options connect-modal__weight-options--last ${isWeight === 'no' ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Без ваги</p>
                </div>
                <div onClick={() => setIsWeight('fuzzy')} className={`connect-modal__weight-options connect-modal__weight-options--last ${isWeight === 'fuzzy' ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Нечітка вага</p>
                </div>
            </div>

            <div className="connect-modal__button" onClick={handleConnectNodes}>З'єднати</div>
        </div>
    )
}