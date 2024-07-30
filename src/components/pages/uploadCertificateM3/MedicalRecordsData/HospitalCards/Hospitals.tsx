import './Hospitals.scss'
import { useNavigate } from 'react-router-dom'
import Hospital from '../../../../../assets/icons/Hospital.png'
import {
    coreRoutesEnum,
    nestedRoutePathsEnum,
} from '../../../../../enums/routingEnums'

function Hospitals(props: NewComponent) {
    const navigate = useNavigate()
    const newComp = () => {
        navigate(
            `/${coreRoutesEnum.MEDICAL_RECORDS}/${nestedRoutePathsEnum.HOSPITAL_CARD_DETAILS}`,
            { state: props.data}
        )
    }

    return (
        <>
            <div className="hospital-cards-parent" onClick={newComp}>
                <div className="child-1">
                    <img src={Hospital} alt="hospital-img" />
                    <div className="hospital-name">
                        <span>{props?.data?.hipName}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export interface NewComponent {
    data: any
}

export default Hospitals
