import { useState } from "react"
import { EdgeData, NodeContextMenuType, ShapeData } from "../../../types"
import { Modal } from "../../Modal/Modal"
import './Nodes.css'
import { MatrixNode } from "./MatrixNode/MatrixNode"

interface IProps {
    contextMenu: NodeContextMenuType
    setContextMenu: React.Dispatch<React.SetStateAction<NodeContextMenuType>>
    setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>
    setEdges: React.Dispatch<React.SetStateAction<EdgeData[]>>
    setError: React.Dispatch<React.SetStateAction<string>>
    matrixModal: boolean
    setMatrixModal: React.Dispatch<React.SetStateAction<boolean>>
    setEdgeCount: React.Dispatch<React.SetStateAction<number>>
    setNodeCount: React.Dispatch<React.SetStateAction<number>>
}

export const NodeContextMenu = ({
    contextMenu,
    setContextMenu,
    setShapes,
    setEdges,
    setError,
    matrixModal,
    setMatrixModal,
    setEdgeCount,
    setNodeCount
}: IProps) => {
    const [labelModal, setLabelModal] = useState(false)
    const [labelValue, setLabelValue] = useState('')

    const handleChangeLabel = (shapeId: number | null) => {
        if (shapeId === null) return
        setLabelModal(true)
    }

    const onMatrixModalDone = (matrix: number[][], orientation: boolean, isWeight: boolean) => {
        const n = matrix.length
        const shapes: ShapeData[] = []
        const edges: EdgeData[] = []
        let edgeCount = 0

        // circle layout parameters
        const centerX = 400
        const centerY = 300
        const radius = 200

        // create node positions in a circle
        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)

            shapes.push({
                id: i,
                label: `${i}`,
                x,
                y,
                radius: 30
            })
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] !== 0) {
                    if (!orientation) {
                        if (j > i) {
                            edges.push({
                                id: edgeCount++,
                                from: i,
                                to: j,
                                orientation: false,
                                fuzzy: [],
                                weight: isWeight ? matrix[i][j] : null
                            })
                        }
                    } else {
                        edges.push({
                            id: edgeCount++,
                            from: i,
                            to: j,
                            orientation: true,
                            fuzzy: [],
                            weight: isWeight ? matrix[i][j] : null
                        })
                    }
                }
            }
        }

        setShapes(shapes)
        setEdges(edges)
        setMatrixModal(false)
        setEdgeCount(edges.length)
        setNodeCount(shapes.length)
    }

    const onChangeLabel = (shapeId: number | null) => {
        if (shapeId === null) {
            setLabelModal(false)
            return
        }
        if (!labelValue) {
            setError('This field can not be empty')
            return
        }
        if (labelValue.length > 3) {
            setError('Name of node can not be bigger than 3 symbols')
            return
        }
        setShapes(prev =>
            prev.map(s => s.id === shapeId ? { ...s, label: labelValue } : s)
        )
        setContextMenu(prev => ({ ...prev, visible: false }))
        setLabelModal(false)
    }

    const handleDeleteNode = (shapeId: number | null) => {
        if (shapeId === null) return
        setShapes(prev => prev.filter(s => s.id !== shapeId))
        setContextMenu(prev => ({ ...prev, visible: false }))
        setEdges(prev => prev.filter(s => s.from !== shapeId && s.to !== shapeId))
    }

    return (
        <>
            {contextMenu.visible && <div className="node-context" style={{ top: contextMenu.y, left: contextMenu.x }}>
                <div className="node-context__button" onClick={() => handleChangeLabel(contextMenu.shapeId)}>
                    Змінити назву
                </div>
                <div className="node-context__button node-context__button--last" onClick={() => handleDeleteNode(contextMenu.shapeId)}>
                    Видалити
                </div>
            </div>}
            <Modal isOpen={labelModal} onClose={() => setLabelModal(false)}>
                <div className="node-label-modal">
                    <div className="node-label-modal__container">
                        <h3 className="node-label-modal__title">Set node name:</h3>
                        <input className="node-label-modal__input" type="text" value={labelValue} onChange={(e) => setLabelValue(e.target.value)} />
                    </div>
                    <div className="connect-modal__button" onClick={() => onChangeLabel(contextMenu.shapeId)}>Apply</div>
                </div>
            </Modal>
            <Modal isOpen={matrixModal} onClose={() => setMatrixModal(false)}>
                <MatrixNode onDone={onMatrixModalDone} />
            </Modal>
        </>
    )
}