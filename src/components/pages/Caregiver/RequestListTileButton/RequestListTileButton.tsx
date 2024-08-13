import ManageAccount from '../../../../assets/icons/manage-account.svg'
import './requestListTileButton.scss'
import { ChevronRight } from '@mui/icons-material'

function RequestListTileButton() {
    return (
        <div className="care-giver-request-list-button-tile">
            <div className="child-1">
                <div className="child-1-1">
                    <img src={ManageAccount} alt="" />
                </div>
                <div className="child-1-2">
                    <h1>Caregiver Request</h1>
                    <span></span>
                </div>
            </div>
            <div className="child-2">
                <ChevronRight />
            </div>
        </div>
    )
}

export default RequestListTileButton
