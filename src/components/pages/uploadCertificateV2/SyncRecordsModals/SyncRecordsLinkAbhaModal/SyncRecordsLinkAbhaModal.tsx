import './SyncRecordsLinkAbhaModal.styles.scss'
import Caution from '../../../../../assets/icons/Caution.svg'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'

function SyncRecordsLinkAbhaModal() {
    const navigate = useNavigate()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event?.preventDefault()
        navigate(`/${coreRoutesEnum.LINK_ABHA}`)
    }

    return (
        <div className="sync-with-abha-container">
            <div className="caution-logo">
                <img src={Caution} alt="caution-logo" />
            </div>
            <div className="sync-alert">
                Unable to sync records with ABHA!
            </div>
            <div className="sync-message">
                Please make sure your ABHA account is linked with eSwasthya Dham. If not, please proceed to link ABHA.
            </div>
            <button className="link-button" onClick={handleClick}>
                Link ABHA
            </button>
        </div>
    )
}

export default SyncRecordsLinkAbhaModal
