import { Circle, Group, Text } from "react-konva"
import { NodeContextMenuType, ShapeData } from "../../../types"

interface IProps {
    shapes: ShapeData[]
    setContextMenu: React.Dispatch<React.SetStateAction<NodeContextMenuType>>
    setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>
}

export const Nodes = ({ shapes, setShapes, setContextMenu }: IProps) => {

    const handleContextMenu = (shape: ShapeData, e: any) => {
        e.evt.preventDefault()
        setContextMenu({
            visible: true,
            x: e.evt.clientX,
            y: e.evt.clientY,
            shapeId: shape.id
        })
    }

    return (
        <>
            {shapes.map(shape => (
                <Group
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    draggable
                    onContextMenu={(e) => handleContextMenu(shape, e)}
                    onDragMove={e => {
                        const { x, y } = e.target.position()
                        setShapes(prev =>
                            prev.map(s => s.id === shape.id ? { ...s, x, y } : s)
                        )
                    }}
                    onDragEnd={e => {
                        const { x, y } = e.target.position()
                        setShapes(prev =>
                            prev.map(s => s.id === shape.id ? { ...s, x, y } : s)
                        )
                    }}
                >
                    <Circle
                        radius={shape.radius}
                        fill='white'
                        stroke='black'
                    />
                    <Text
                        text={shape.label}
                        fontSize={18}
                        width={shape.radius * 2}
                        height={shape.radius * 2}
                        offsetX={shape.radius}
                        offsetY={shape.radius}
                        align='center'
                        verticalAlign='middle'
                    />
                </Group>
            ))}
        </>
    )
}