import './PhoneNumberMatched.styles.scss'
import GreenCheck from '../../../../../../../assets/icons/GreenCheck.svg'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../../enums/routingEnums'

function PhoneNumberMatched() {

  const navigate = useNavigate()
  return (
    <div className="number-matched-container">
            <div className="green-check">
                <img src={GreenCheck} />
            </div>
            <div className="matched-message">
              Phone number provided by you is same as phone number linked with Aadhaar number.
            </div>
            <button className="continue-button" onClick={() => navigate(`/${coreRoutesEnum.CREATE_ABHA}`)}>Continue</button>
        </div>
  )
}

export default PhoneNumberMatched