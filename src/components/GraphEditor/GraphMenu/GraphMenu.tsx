import './GraphMenu.css'

import { AddCircleSvg } from './images/AddCircleSvg'
import { AlgorithmSvg } from './images/AlgorithmSvg'
import { ConnectSvg } from './images/ConnectSvg'
import { DragSvg } from './images/DragSvg'
import { ExportSvg } from './images/ExportSvg'
import { ImportSvg } from './images/ImportSvg'
import { ZoomSvg } from './images/ZoomSvg'
import { useState } from 'react'
import { HoverMenu } from './HoverMenu/HoverMenu'

interface MenuItem {
    id: number
    icon: any
    label: string
}

const menuItems: MenuItem[] = [
    { id: 0, icon: AddCircleSvg, label: 'Додати' },
    { id: 1, icon: ZoomSvg, label: 'Масштаб' },
    { id: 2, icon: DragSvg, label: 'Перетягнути' },
    { id: 3, icon: ConnectSvg, label: "З'єднати" },
    { id: 4, icon: ImportSvg, label: 'Імпорт' },
    { id: 5, icon: ExportSvg, label: 'Експорт' },
    { id: 7, icon: AlgorithmSvg, label: 'Алгоритми' },
]

interface IProps {
    selected: number
    setSelected: React.Dispatch<React.SetStateAction<number>>
    setError: React.Dispatch<React.SetStateAction<string>>
    setZoom: React.Dispatch<React.SetStateAction<number>>
    onMenuChange: (id: number) => { data: any, error: string }
    setAddMatrixModal: React.Dispatch<React.SetStateAction<boolean>>
    setAlgorithmType: React.Dispatch<React.SetStateAction<number>>
}

export const GraphMenu = ({ selected, setSelected, onMenuChange, setError, setZoom, setAddMatrixModal, setAlgorithmType }: IProps) => {
    const [hoverId, setHoverId] = useState(-1)

    const onMenuItemSelect = (id: number) => {
        if (hoverId === 1 && id === 1) {
            return
        }
        const { error } = onMenuChange(id)
        if (error) {
            setError(error)
            return
        }
        if (id !== selected && id !== 5) {
            setSelected(id)
        }
    }

    return (
        <ul className="graph-menu">
            {menuItems.map((el, idx) => {
                let className = 'graph-menu__item'
                if (idx === (menuItems.length - 1)) {
                    className += ' graph-menu__item--last'
                }
                if (el.id === selected) {
                    className += ' graph-menu__item--selected'
                }

                let closeTimer: ReturnType<typeof setTimeout> | null = null
                const handleMouseEnter = () => {
                    if (closeTimer) clearTimeout(closeTimer)
                    setHoverId(el.id)
                }
                const handleMouseLeave = () => {
                    closeTimer = setTimeout(() => {
                        setHoverId(-1)
                    }, 200)
                }

                return (
                    <li key={el.id}
                        className={className}
                        onClick={() => onMenuItemSelect(el.id)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {<el.icon width='20px' height='20px' fill={el.id === selected ? '#fff' : '#000'} />}
                        <p className="graph-menu__label">{el.label}</p>
                        {hoverId === el.id && <HoverMenu
                            id={el.id}
                            setZoom={setZoom}
                            setHoverId={setHoverId}
                            onMenuItemSelect={onMenuItemSelect}
                            onMatrixAdddNode={() => setAddMatrixModal(true)}
                            onAlgorithmSelect={setAlgorithmType}
                        />}
                    </li>
                )
            })}
        </ul>
    )
}