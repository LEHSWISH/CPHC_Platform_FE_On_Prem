import { useNavigate } from 'react-router-dom'
import './CardModal.scss'
import Close from '../../../assets/icons/Close.svg'
import { Modal } from '@mui/material'

function CardModal({
    children,
    setClose,
    isOpenedByNavigation,
    showClose = true,
}: CardModalPropTypes) {
    const navigate = useNavigate()

    const handleClose = () => {
        if (isOpenedByNavigation) {
            navigate(-1)
        } else {
            setClose && setClose(true)
        }
    }

    return (
        <Modal open={true} className="card-modal-backdrop-container">
            <div className="card-modal-backdrop">
                <div className="card-modal">
                    {showClose ? (
                        <div className="close" onClick={handleClose}>
                            <img src={Close} />
                        </div>
                    ) : (
                        <></>
                    )}
                    <div
                        className="component-modal-container"
                        key={'card-modal-child'}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export interface CardModalPropTypes {
    children: React.ReactNode
    setClose?: (s: boolean) => void
    isOpenedByNavigation?: boolean
    showClose?: boolean
}

export default CardModal
