export interface SvgProps {
    height: string
    width: string
    fill: string
}

export type ShapeData = {
    id: number
    label: string
    x: number
    y: number
    radius: number
}

export type EdgeData = {
    id: number
    from: number
    to: number
    orientation: boolean
    weight: number | null
}

export interface NodeContextMenuType {
    visible: boolean
    x: number
    y: number
    shapeId: number | null
}

export interface EdgeContextMenuType {
    visible: boolean
    x: number
    y: number
    edgeId: number | null
}