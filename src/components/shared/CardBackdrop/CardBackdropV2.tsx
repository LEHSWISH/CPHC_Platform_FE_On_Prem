import './CardBackdropV2.styles.scss'
import Close from '../../../assets/icons/Close.svg'
import { Modal } from '@mui/material'


// This variant is created for Yatri Support Modal to open
// It can also be used in other cases except for case involving Navigation
function CardBackdropV2({
    children,
    setClose,
    showClose = true,
}: CardBackdropProps) {
    const handleClose = () => {
        setClose && setClose(true)
    }

    return (
        <Modal open={true} className="card-backdropv2-container">
            <div className="card-backdropv2">
                <div className="card">
                    {showClose ? (
                        <div className="close" onClick={handleClose}>
                            <img src={Close} />
                        </div>
                    ) : (
                        <></>
                    )}
                    <div
                        className="component-container"
                        key={'card-backdrop-child'}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

interface CardBackdropProps {
    children: React.ReactNode
    setClose?: (s: boolean) => void
    showClose?: boolean
}

export default CardBackdropV2
