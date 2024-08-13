import './AbhaExists.styles.scss'
import Caution from '../../../../../../../assets/icons/Caution.svg'
import { useAppSelector } from '../../../../../../../utils/hooks/useAppSelector'
function AbhaExists({openAbhaCard}:{openAbhaCard: (s: boolean) => void}) {
    const opencard=()=>{
        openAbhaCard(true)
    }
    const abhaNumber = useAppSelector(s => s.yatri.abhaCardDetails.abhaNumber)

    return (
        <div className="abha-exists-container">
            <div className="caution-logo">
                <img src={Caution} />
            </div>
            <div className="account-exists-alert">
                ABHA account already exists!
            </div>
            <div className="account-exists-meessage">
                We found an ABHA number <span>XX XXXX XXXX {abhaNumber?.slice(-4)}</span> against the Aadhaar
                number provided by you.
            </div>
            <button className="save-button" onClick={opencard}>View Profile</button>
        </div>
    )
}

export default AbhaExists
