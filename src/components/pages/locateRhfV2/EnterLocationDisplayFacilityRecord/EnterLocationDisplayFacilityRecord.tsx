import { useNavigate } from 'react-router-dom'
import './EnterLoactionDisplayFacilityRecord.scss'
import { coreRoutesEnum } from '../../../../enums/routingEnums'

interface EnterLocationDisplayFacilityRecordPropType {
    fromHomePage: boolean
}
function EnterLocationDisplayFacilityRecord(props: EnterLocationDisplayFacilityRecordPropType) {
    const navigate = useNavigate()
    return (
        <>
            <div className="Enter-location-display-container">
                <div className="enter-medical-facility-title">
                    <div className="facility-div">
                        Registered Medical Facilities
                    </div>
                </div>
                <div className="enter-location-box">
                    <div className="enter-location-box-title">
                        To display registered medical facilities, please enter
                        location and search facility.
                    </div>
                </div>
                <div className="back-to-medical-record-button">
                    <div className="medical-record-button">
                        { !props.fromHomePage && (
                            <button
                                className="m-btn"
                                onClick={() =>
                                    navigate(
                                        `/${coreRoutesEnum.MEDICAL_RECORDS}`,
                                    )
                                }
                            >
                                Back to Medical Records
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default EnterLocationDisplayFacilityRecord
