import React, { useState, useRef, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import { GraphMenu } from './GraphMenu/GraphMenu'
import { EdgeContextMenuType, EdgeData, NodeContextMenuType, ShapeData } from '../../types'
import { Nodes } from './Nodes/Nodes'
import { NodeContextMenu } from './Nodes/NodeContextMenu'
import { Edges } from './Edges/Edges'
import { EdgeContextMenu } from './Edges/EdgeContextMenu'
import { Import } from './Import/Export'
import { Solve } from './Solve/Solve'
import { Point } from 'framer-motion'

interface IProps {
    stageRef: React.RefObject<any>
    shapes: ShapeData[]
    setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>
    count: number
    setCount: React.Dispatch<React.SetStateAction<number>>
    edges: EdgeData[]
    setEdges: React.Dispatch<React.SetStateAction<EdgeData[]>>
    edgeCount: number
    setEdgeCount: React.Dispatch<React.SetStateAction<number>>
    stagePos: Point
    setStagePos: React.Dispatch<React.SetStateAction<Point>>
    zoom: number
    setZoom: React.Dispatch<React.SetStateAction<number>>
    setError: React.Dispatch<React.SetStateAction<string>>
}

export const GraphEditor = ({
    stageRef,
    shapes, setShapes, count, setCount,
    edges, setEdges, edgeCount, setEdgeCount,
    zoom, setZoom,
    stagePos, setStagePos,
    setError
}: IProps) => {
    const [menuSelected, setMenuSelected] = useState(0)
    const [addMatrixModal, setAddMatrixModal] = useState(false)
    const [importModal, setImportModal] = useState(false)

    // CONNECT LOGIC
    const [connectionModal, setConnrctionModal] = useState(false)
    const onConnectModalClose = () => {
        setConnrctionModal(false)
        setMenuSelected(2)
    }

    // ZOOM LOGIC
    useEffect(() => {
        if (shapes[0]) {
            stageRef.current.position({ x: shapes[0].x, y: shapes[0].y })
        }
    }, [zoom])

    const [nodeContextMenu, setNodeContextMenu] = useState<NodeContextMenuType>({ visible: false, x: 0, y: 0, shapeId: null })
    const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuType>({ visible: false, x: 0, y: 0, edgeId: null })

    const handleStageClick = (e: any) => {
        setNodeContextMenu(prev => ({ ...prev, visible: false }))

        if (menuSelected !== 0) {
            return
        }

        if (e.evt.button === 0 && e.target === e.target.getStage()) {
            const stage = stageRef.current
            const pointer = stage.getPointerPosition()

            const transform = stage.getAbsoluteTransform().copy()
            transform.invert()

            const localPos = transform.point(pointer)
            const { x, y } = localPos

            const newShape: ShapeData = {
                id: count,
                label: `${count}`,
                x,
                y,
                radius: 30
            }

            setShapes(prev => [...prev, newShape])
            setCount(prev => prev + 1)
        }
    }

    const [algorithmType, setAlgorithmType] = useState(-1)
    const onMenuChange = (id: number) => {
        if (id === 3) {
            if (shapes.length < 2) {
                return { data: null, error: 'You should add at least 2 nodes to make connection' }
            } else {
                setConnrctionModal(true)
            }
        }

        if (id === 4) {
            setImportModal(true)
        }

        if (id === 5) {
            if (!shapes.length && !edges.length) {
                return { data: null, error: 'Nothing to export' }
            } else {
                const data = {
                    shapes,
                    edges,
                    count,
                    edgeCount
                }
                const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const downloadLink = document.createElement('a')
                downloadLink.href = URL.createObjectURL(jsonBlob)
                downloadLink.download = 'graph-data.json'
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
            }
        }

        if (id === 7) {
            if (shapes.length < 2 || edges.length < 1) {
                setAlgorithmType(-1)
                return { data: null, error: 'You should add at least 2 nodes and 1 edge to find shortest path' }
            }
        }

        return { data: null, error: '' }
    }

    return (
        <div style={{ padding: '20px', width: '1000px', height: '700px', paddingTop: '48px', position: 'relative' }}>
            <GraphMenu
                selected={menuSelected}
                setSelected={setMenuSelected}
                onMenuChange={onMenuChange}
                setError={setError}
                setZoom={setZoom}
                setAddMatrixModal={setAddMatrixModal}
                setAlgorithmType={setAlgorithmType}
            />
            <Stage
                ref={stageRef}
                width={1000}
                height={700}
                scaleX={zoom}
                scaleY={zoom}
                onClick={handleStageClick}
                style={{ border: '1px solid black', background: '#fff', borderRadius: 20 }}
                draggable={menuSelected === 2}
                onDragEnd={(e: any) =>
                    setStagePos({ x: e.target.x(), y: e.target.y() })}
            >
                <Layer>
                    <Edges shapes={shapes} edges={edges} setContextMenu={setEdgeContextMenu} />
                    <Nodes shapes={shapes} setShapes={setShapes} setContextMenu={setNodeContextMenu} />
                </Layer>
            </Stage>
            <NodeContextMenu
                contextMenu={nodeContextMenu}
                setContextMenu={setNodeContextMenu}
                setEdges={setEdges}
                setShapes={setShapes}
                setError={setError}
                matrixModal={addMatrixModal}
                setMatrixModal={setAddMatrixModal}
                setEdgeCount={setEdgeCount}
                setNodeCount={setCount}
            />
            <EdgeContextMenu
                contextMenu={edgeContextMenu}
                setContextMenu={setEdgeContextMenu}
                setEdges={setEdges}
                setShapes={setShapes}
                setError={setError}
                edgeCount={edgeCount}
                setEdgeCount={setEdgeCount}
                edges={edges}
                shapes={shapes}
                connectionModal={connectionModal}
                onConnectModalClose={onConnectModalClose}
            />
            <Import
                openModal={importModal}
                setCount={setCount}
                setEdgeCount={setEdgeCount}
                setEdges={setEdges}
                setError={setError}
                setShapes={setShapes}
                onModalClose={() => {
                    setMenuSelected(2)
                    setImportModal(false)
                }}
            />
            {shapes.length > 1 && <Solve
                shapes={shapes}
                edges={edges}
                algorithmType={algorithmType}
                setError={setError}
                onCloseSolve={() => {
                    setAlgorithmType(-1)
                    setMenuSelected(2)
                }}
            />}
        </div>
    )
}
