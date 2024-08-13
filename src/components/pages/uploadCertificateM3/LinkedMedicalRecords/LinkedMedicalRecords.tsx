import './LinkedMedicalRecords.styles.scss'
import Refresh from '../../../../assets/icons/refresh.svg'
import File from '../../../../assets/icons/medicalfile.svg'
import SharedVerticalStepper from '../../../shared/SharedVerticalStepper'
import SharedStepper from '../../../shared/SharedStepper'
import { Divider, useMediaQuery } from '@mui/material'
import ArrowLeft from '../../../../assets/icons/left-vector.svg'
import { useNavigate } from 'react-router-dom'
import { nestedRoutePathsEnum } from '../../../../enums/routingEnums'

function LinkedMedicalRecords() {
    const navigate = useNavigate()
    const steps = [
        'Approval request sent to your Personal Health Record App',
        'Visit your Personal Health Record App and grant approval.',
        'Refresh to view your Abha Medical Records.',
    ]

    const matches = useMediaQuery('(max-width:480px)')
    return (
        <div className="linked-records-container">
            <div
                className="my-request-mobile"
                onClick={() => navigate(`${nestedRoutePathsEnum.MY_REQUESTS}`)}
            >
                <div className="my-request-text">
                    My Requests
                    <div className="dot"></div>
                </div>
                <img src={ArrowLeft} alt="" />
            </div>
            <div className="request-div">
                <p
                    className="my-request"
                    onClick={() =>
                        navigate(`${nestedRoutePathsEnum.MY_REQUESTS}`)
                    }
                >
                    My Requests
                </p>
                <Divider orientation="vertical" variant="fullWidth" flexItem />
                <button className="refresh-button">
                    <span>
                        <img src={Refresh} alt="" />
                    </span>
                    Refresh
                </button>
            </div>
            <div className="approval-pending-div">
                <div className="content-div">
                    <img src={File} alt="" />
                    <h2>Approval Pending</h2>
                    {matches ? (
                        <div className="link-medical-records-steps">
                            <SharedVerticalStepper
                                steps={steps}
                                activeStep={0}
                            />
                        </div>
                    ) : (
                        <div className="link-medical-records-steps">
                            <SharedStepper steps={steps} activeStep={1} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LinkedMedicalRecords
