import './ChangesUnsaved.styles.scss'
import Caution from '../../../../../../assets/icons/Caution.svg'

interface ChangesUnsavedPropTypes {
    onSave: () => void
    onExit: () => void
}

function ChangesUnsaved({ onExit, onSave }: ChangesUnsavedPropTypes) {
    return (
        <div className="saved-changes-container">
            <div className="caution-logo">
                <img src={Caution} />
            </div>
            <div className="unsaved-alert">Unsaved Changes!</div>
            <div className="unsaved-message">
                Your changes will be lost if you don’t save them.
            </div>
            <div className="button-container">
                <button className="save-button" onClick={onSave}>
                    Save
                </button>
                <button className="exit-button" onClick={onExit}>
                    Exit
                </button>
            </div>
        </div>
    )
}

export default ChangesUnsaved
