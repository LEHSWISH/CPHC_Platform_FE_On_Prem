import './SyncRecordsSuccessModal.styles.scss'
import GreenCheck from '../../../../../assets/icons/GreenCheck.svg'

function SyncRecordsSuccessModal() {
    return (
        <div className="sync-success-container">
            <div className="green-check">
                <img src={GreenCheck} alt="green-check" />
            </div>
            <div className="success-message">
                Your medical records synced with ABHA successfully!
            </div>
        </div>
    )
}

export default SyncRecordsSuccessModal
