import './ConfirmationModal.styles.scss'

interface ConfirmationModalPropTypes {
    heading: string
    description: string
    confirm: string
    cancel: string
    onSave: () => void
    onExit: () => void
}
function ConfirmationModal({
    heading,
    description,
    confirm,
    cancel,
    onExit,
    onSave,
}: ConfirmationModalPropTypes) {
    return (
        <div className="confirmation-modal-container">
            <div className="confirmation-heading">{heading}</div>
            <div className="confirmation-message">{description}</div>
            <div className="button-container">
                <button className="cancel-button" onClick={onExit}>
                    {cancel}
                </button>
                <button className="confirm-button" onClick={onSave}>
                    {confirm}
                </button>
            </div>
        </div>
    )
}

export default ConfirmationModal
