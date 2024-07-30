import { IconButton } from '@mui/material'
import Close from '../../../../../assets/icons/Close.svg'
import infoAlertBlueSVG from '../../../../../assets/icons/infoAlertBlue.svg'
import './infoBox.style.scss'

const InfoBox = ({
    titleText,
    descriptionText,
    onClose,
}: {
    titleText?: string
    descriptionText?: string
    onClose: () => void
}) => {
    return (
        <div className="info-box">
            <img src={infoAlertBlueSVG} alt="info" />
            <div className="text-container">
                {titleText && <div className="title-text">{titleText}</div>}
                {descriptionText && (
                    <div className="description-text">{descriptionText}</div>
                )}
            </div>
            <IconButton className="close" onClick={onClose}>
                <img src={Close} />
            </IconButton>
        </div>
    )
}

export default InfoBox
