interface IProps {
    id: number
    setZoom: React.Dispatch<React.SetStateAction<number>>
    setHoverId: React.Dispatch<React.SetStateAction<number>>
    onMenuItemSelect: (id: number) => void
    onMatrixAdddNode: () => void
    onAlgorithmSelect: (id: number) => void
}

export const HoverMenu = ({
    id,
    setZoom,
    setHoverId,
    onMenuItemSelect,
    onMatrixAdddNode,
    onAlgorithmSelect
}: IProps) => {
    const handleZoom = (z: number) => {
        setZoom(z)
        setHoverId(-1)
        onMenuItemSelect(2)
    }

    const handleAlgorithm = (id: number) => {
        onAlgorithmSelect(id)
        setHoverId(-1)
        onMenuItemSelect(2)
    }

    const handleAddNode = (matrix: boolean) => {
        if (matrix) {
            onMatrixAdddNode()
        }
        setHoverId(-1)
        onMenuItemSelect(0)
    }

    if (id === 0) {
        return (
            <div className='graph-menu__hover-container'>
                <p onClick={() => handleAddNode(false)} className='graph-menu__hover-item'>Вручну</p>
                <p onClick={() => handleAddNode(true)} className='graph-menu__hover-item graph-menu__hover-item--last'>Матриця</p>
            </div>
        )
    }

    if (id === 1) {
        return (
            <div className='graph-menu__hover-container'>
                <p onClick={() => handleZoom(2)} className='graph-menu__hover-item'>200%</p>
                <p onClick={() => handleZoom(1)} className='graph-menu__hover-item'>100%</p>
                <p onClick={() => handleZoom(0.5)} className='graph-menu__hover-item'>50%</p>
                <p onClick={() => handleZoom(0.25)} className='graph-menu__hover-item graph-menu__hover-item--last'>25%</p>
            </div>
        )
    }

    if (id === 7) {
        return (
            <div className='graph-menu__hover-container'>
                <p onClick={() => handleAlgorithm(0)} className='graph-menu__hover-item'>Дейкстра</p>
                <p onClick={() => handleAlgorithm(1)} className='graph-menu__hover-item'>Флойд-Уоршал</p>
                <p onClick={() => handleAlgorithm(2)} className='graph-menu__hover-item graph-menu__hover-item--last'>Белман-Форд</p>
            </div>
        )
    }

    return <></>
}