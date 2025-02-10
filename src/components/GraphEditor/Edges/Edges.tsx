import { Arrow, Group, Line, Rect, Text } from "react-konva"
import { EdgeContextMenuType, EdgeData, ShapeData } from "../../../types"

export interface IProps {
    edges: EdgeData[]
    shapes: ShapeData[]
    setContextMenu: React.Dispatch<React.SetStateAction<EdgeContextMenuType>>
}
export const Edges = ({ edges, shapes, setContextMenu }: IProps) => {
    const handleContextMenu = (shape: EdgeData, e: any) => {
        e.evt.preventDefault()
        setContextMenu({
            visible: true,
            x: e.evt.clientX,
            y: e.evt.clientY,
            edgeId: shape.id
        })
    }

    return (
        <>
            {edges.map(edge => {
                const fromShape = shapes.find(s => s.id === edge.from)!
                const toShape = shapes.find(s => s.id === edge.to)!
                const fx = fromShape.x
                const fy = fromShape.y
                const tx = toShape.x
                const ty = toShape.y
                const dx = tx - fx
                const dy = ty - fy
                const length = Math.sqrt(dx * dx + dy * dy)
                if (length === 0) return null
                const ndx = dx / length
                const ndy = dy / length
                const fromRadius = fromShape.radius
                const toRadius = toShape.radius
                const startX = fx + fromRadius * ndx
                const startY = fy + fromRadius * ndy
                const endX = tx - toRadius * ndx
                const endY = ty - toRadius * ndy
                const midX = (startX + endX) / 2
                const midY = (startY + endY) / 2
                const labelWidth = 30
                const labelHeight = 30


                return (
                    <Group key={edge.id} onContextMenu={(e) => handleContextMenu(edge, e)}>
                        {edge.orientation ? (
                            <Arrow
                                points={[startX, startY, endX, endY]}
                                stroke='black'
                                fill='black'
                                pointerLength={10}
                                pointerWidth={10}
                                strokeWidth={4}
                            />
                        ) : (
                            <Line
                                points={[startX, startY, endX, endY]}
                                stroke='black'
                                strokeWidth={4}
                            />
                        )}
                        {edge.weight && <Group x={midX} y={midY}>
                            <Rect
                                x={-labelWidth / 2}
                                y={-labelHeight / 2}
                                width={labelWidth}
                                height={labelHeight}
                                fill='white'
                                stroke="black"
                                cornerRadius={4}
                            />
                            <Text
                                x={-labelWidth / 2}
                                y={-labelHeight / 2}
                                width={labelWidth}
                                height={labelHeight}
                                text={String(edge.weight)}
                                fontSize={16}
                                fill='black'
                                align='center'
                                verticalAlign='middle'
                            />
                        </Group>}
                    </Group>
                )
            })}
        </>
    )
}