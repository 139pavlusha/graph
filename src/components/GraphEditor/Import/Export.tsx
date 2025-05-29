import { EdgeData, ShapeData } from "../../../types"
import { Modal } from "../../Modal/Modal"

interface IProps {
    openModal: boolean
    onModalClose: () => void
    setShapes: React.Dispatch<React.SetStateAction<ShapeData[]>>
    setEdges: React.Dispatch<React.SetStateAction<EdgeData[]>>
    setCount: React.Dispatch<React.SetStateAction<number>>
    setEdgeCount: React.Dispatch<React.SetStateAction<number>>
    setError: React.Dispatch<React.SetStateAction<string>>
}

export const Import = ({
    openModal,
    onModalClose,
    setShapes,
    setEdges,
    setCount,
    setEdgeCount,
    setError
}: IProps) => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const result = e.target?.result as string
                const data = JSON.parse(result)

                // Validate JSON structure
                if (!data.shapes || !data.edges || typeof data.count !== 'number' || typeof data.edgeCount !== 'number') {
                    throw new Error('Invalid JSON structure')
                }

                // Update states
                setShapes(data.shapes)
                setEdges(data.edges)
                setCount(data.count)
                setEdgeCount(data.edgeCount)

                setError('') // Clear any previous errors
                onModalClose() // Close the modal
            } catch (err) {
                setError('Неправильний формат або вміст файлу. Завантажте коректний файл JSON.')
            }
        }

        reader.onerror = () => {
            setError('Не вдалося прочитати файл. Спробуйте ще раз.')
        }

        reader.readAsText(file)
    }
    return (
        <Modal isOpen={openModal} onClose={onModalClose}>
            <div className="import-modal">
                <h2>Імпортуйте граф з файлу</h2>
                <input
                    type="file"
                    accept="application/json"
                    onChange={handleFileUpload}
                    className="import-modal__file-input"
                />
            </div>
        </Modal>
    )
}