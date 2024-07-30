import './LinkAbhaConfirmationModal.styles.scss'
import Caution from '../../../assets/icons/Caution.svg'

function LinkAbhaConfirmationModal(props: ConfirmationModal) {

	const handleConfirmation = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault()
		props.updateStep()
		props.closeModal()
	}
	
    return (
        <div className="link-abha-confirmation-container">
            <div className="caution-logo">
                <img src={Caution} />
            </div>
            <div className="confirmation-alert">
                Confirmation required!
            </div>
            <div className="confirmation-meessage">
                Confirming will permanently link the selected ABHA account to
                eSwasthya Dham and this action is irreversible.
                <p>Do you wish to continue?</p>
            </div>
            <button className="confirm-button" onClick={handleConfirmation}>
                Confirm
            </button>
        </div>
    )
}

interface ConfirmationModal {
	updateStep: () => void
	closeModal: () => void
}

export default LinkAbhaConfirmationModal
