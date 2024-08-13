import { useNavigate } from 'react-router-dom'
import AbhaImage from '../../../../../assets/Images/abhaImageHome.svg'
import './AbhaPending.styles.scss'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
function AbhaPending(props:PropTypes) {
  const navigate=useNavigate()
  const closeModal=()=>{
    props.callClose()
  }
  return (
    <>
    <div className="abha-pending-parent">
        <div className="abha-image">
            <img src={AbhaImage} alt="" />
        </div>
        <h2 className='abha-pending-text'>ABHA Pending</h2>
        <p className='abha-pending-description'>Please complete your ABHA process to proceed</p>
        <div className="buttons">
            <button className='proceed-button' onClick={()=>navigate(`/${coreRoutesEnum.CREATE_ABHA}`)}>Proceed</button>
            <button className='cancel-button' onClick={closeModal}>Cancel</button>
        </div>
    </div>
    
    </>
  )
}
interface PropTypes{
  callClose:()=>void
}

export default AbhaPending