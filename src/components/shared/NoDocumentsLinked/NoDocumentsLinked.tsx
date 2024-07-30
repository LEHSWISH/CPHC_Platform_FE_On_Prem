import './NoDocumentsLinked.scss'
import RefreshDoc from '../../../assets/Images/Vector (1).png'

function NoDocumentsLinked() {
    return (
        <div className="nodocs-linked-container">
            <div className="nodocs-inner-container">
                <div className="logo-container">
                    <img src={RefreshDoc} alt="refresh-logo" />
                </div>
                <div className="no-records-heading">No records found</div>
                <div className="no-records-message">
                    There are no documents linked to the selected registered
                    health provider.
                </div>
            </div>
        </div>
    )
}

export default NoDocumentsLinked