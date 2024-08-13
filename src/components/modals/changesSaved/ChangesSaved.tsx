import './ChangesSaved.scss'
import GreenCheck from '../../../assets/icons/GreenCheck.svg'

function ChangesSaved() {
    return (
        <div className="saved-certificate-container">
            <div className="green-check">
                <img src={GreenCheck} />
            </div>
            <div className="success-message">Saved Successfully!</div>
            <div className="saved-message">
                The changes have been saved successfully.
            </div>
        </div>
    )
}

export default ChangesSaved
