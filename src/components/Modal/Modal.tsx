import React from 'react'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
                zIndex: 9999
            }}
            onClick={handleBackdropClick}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    minWidth: '300px',
                    maxWidth: '90%'
                }}
            >
                <div
                    onClick={onClose}
                    style={{ float: 'right', cursor: 'pointer' }}
                >
                    ×
                </div>
                <div style={{ marginTop: '10px' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
