import { EdgeContextMenuType, EdgeData, ShapeData } from "../../../types"
import { Modal } from "../../Modal/Modal"
import { Connect } from "./Connect/Connect"

interface IProps {
    contextMenu: EdgeContextMenuType
    setContextMenu: React.Dispatch<React.SetStateAction<EdgeContextMenuType>>
    setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>
    setEdges: React.Dispatch<React.SetStateAction<EdgeData[]>>
    setError: React.Dispatch<React.SetStateAction<string>>
    connectionModal: boolean
    onConnectModalClose: () => void
    edges: EdgeData[]
    shapes: ShapeData[]
    edgeCount: number
    setEdgeCount: React.Dispatch<React.SetStateAction<number>>
}

export const EdgeContextMenu = ({
    contextMenu,
    setContextMenu,
    setEdges, setError,
    connectionModal,
    onConnectModalClose,
    edges,
    shapes,
    edgeCount,
    setEdgeCount
}: IProps) => {

    const handleDeleteEdge = (edgeId: number | null) => {
        if (edgeId === null) return
        setContextMenu(prev => ({ ...prev, visible: false }))
        setEdges(prev => prev.filter(s => s.id !== edgeId))
    }
    return (
        <>
            {contextMenu.visible && <div className="node-context" style={{ top: contextMenu.y, left: contextMenu.x }}>
                <div className="node-context__button node-context__button--last" onClick={() => handleDeleteEdge(contextMenu.edgeId)}>
                    Видалити
                </div>
            </div>}
            <Modal isOpen={connectionModal} onClose={onConnectModalClose}>
                <Connect
                    edges={edges}
                    edgeCount={edgeCount}
                    setEdgeCount={setEdgeCount}
                    setEdges={setEdges}
                    setError={setError}
                    shapes={shapes}
                    onConnectModalClose={onConnectModalClose}
                />
            </Modal>
        </>
    )
}