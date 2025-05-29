import { useEffect, useState } from "react"
import './MatrixNode.css'
import { CrossSvg } from "./images/CrossSvg"

interface IProps {
    onDone: (m: number[][], o: boolean, i: boolean) => void
}

export const MatrixNode = ({ onDone }: IProps) => {
    const [n, setN] = useState(4)
    const [matrix, setMatrix] = useState<number[][]>([])
    const [orientation, setOrientation] = useState(true)
    const [isWeight, setIsWeight] = useState(true)

    useEffect(() => {
        setMatrix(Array.from({ length: n }, () => Array(n).fill(0)))
    }, [n, orientation, isWeight])

    const onSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = +e.target.value
        if (val >= 0 && val <= 12) {
            setN(val)
        }
    }

    const onMatrixChange = (e: React.ChangeEvent<HTMLInputElement>, i: number, j: number) => {
        const val = +e.target.value
        if (val >= 0 && val <= 999) {
            setMatrix(prev =>
                prev.map((r, idx_i) =>
                    r.map((e, idx_j) => {
                        if (idx_i === i && idx_j === j) {
                            return val
                        } else if (orientation && idx_i === j && idx_j === i) {
                            return 0
                        } else {
                            return e
                        }
                    })
                )
            )
        }
    }

    const onCheckCell = (i: number, j: number) => {
        setMatrix(prev =>
            prev.map((r, idx_i) =>
                r.map((e, idx_j) => {
                    if (idx_i === i && idx_j === j) {
                        return 1
                    } else if (orientation && idx_i === j && idx_j === i) {
                        return 0
                    } else {
                        return e
                    }
                })
            )
        )
    }

    return (
        <div className="node-matrix">
            <label className="node-matrix__label">Уведіть розмір матриці</label>
            <input className="node-matrix__input" min={2} max={12} type="number" value={n} onChange={onSizeChange} />

            <div className='connect-modal__weight'>
                <div onClick={() => setOrientation(true)} className={`connect-modal__weight-options ${orientation ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Орієнтований</p>
                </div>
                <div onClick={() => setOrientation(false)} className={`connect-modal__weight-options connect-modal__weight-options--last ${!orientation ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Неорієнтований</p>
                </div>
            </div>

            <div className='connect-modal__weight'>
                <div onClick={() => setIsWeight(true)} className={`connect-modal__weight-options ${isWeight ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Додати вагу</p>
                </div>
                <div onClick={() => setIsWeight(false)} className={`connect-modal__weight-options connect-modal__weight-options--last ${!isWeight ? 'connect-modal__weight-options--selected' : ''}`}>
                    <p className='connect-modal__weight-text'>Без ваги</p>
                </div>
            </div>

            <div className="node-matrix__container">
                <div className="node-matrix__row">
                    <div className="node-matrix__value node-matrix__value--header"></div>
                    {matrix.map((_, i) => {
                        return (
                            <div className="node-matrix__value node-matrix__value--header">{i}</div>
                        )
                    })}
                </div>
                {matrix.map((row, i) => {
                    return (
                        <div className="node-matrix__row">
                            <div className="node-matrix__value node-matrix__value--header">{i}</div>
                            {row.map((el, j) => {
                                if (i === j) {
                                    if (isWeight) {
                                        return <div className="node-matrix__value node-matrix__value--protected">1</div>
                                    } else {
                                        return <div className="node-matrix__value node-matrix__value--protected node-matrix__value--checked">
                                            <CrossSvg width="20px" height='20px' fill="#000" />
                                        </div>
                                    }
                                }
                                if (j < i && !orientation) {
                                    return <div className="node-matrix__value node-matrix__value--protected"></div>
                                }
                                if (isWeight) {
                                    return (
                                        <input className="node-matrix__value" value={matrix[i][j] ? matrix[i][j] : ''} onChange={(e) => onMatrixChange(e, i, j)} />
                                    )
                                } else {
                                    return <div className="node-matrix__value node-matrix__value--checked" onClick={() => onCheckCell(i, j)}>
                                        {el === 1 && <CrossSvg width="20px" height='20px' fill="#000" />}
                                    </div>
                                }
                            })}
                        </div>
                    )
                })}
            </div>
            <div className="connect-modal__button" onClick={() => onDone(matrix, orientation, isWeight)}>Створити</div>
        </div>
    )
}