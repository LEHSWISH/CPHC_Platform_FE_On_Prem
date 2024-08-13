import { useNavigate } from 'react-router-dom'
import './CardBackdrop.styles.scss'
import Close from '../../../assets/icons/Close.svg'
import { Modal } from '@mui/material'

function CardBackdrop({
    children,
    setClose,
    isOpenedByNavigation,
    showClose = true,
}: CardBackdropProps) {
    const navigate = useNavigate()

    const handleClose = () => {
        if (isOpenedByNavigation) {
            navigate(-1)
        } else {
            setClose && setClose(true)
        }
    }

    return (
        <Modal open={true} className="card-backdrop-container">
            <div className="card-backdrop">
                <div className="card">
                    {
                        showClose ?
                            <div className="close" onClick={handleClose}>
                                <img src={Close} />
                            </div> : <></>
                    }
                    <div className="component-container" key={'card-backdrop-child'}>
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
    isOpenedByNavigation?: boolean,
    showClose?: boolean
}

export default CardBackdrop
