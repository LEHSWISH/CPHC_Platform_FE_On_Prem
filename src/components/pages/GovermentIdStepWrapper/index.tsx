import ABHARegistrationContainer from '../../shared/ABHARegistrationContainer/ABHARegistrationContainer'
import GovtId from '../AbhaStep/GovtId/GovtId'

const stepTitles = [
    'Provide us your basic information',
    'Provide your Government ID',
]

const GovernmentIdStepWrapper = () => {
    return (
        <ABHARegistrationContainer steps={stepTitles} activeStep={1}>
            <GovtId />
        </ABHARegistrationContainer>
    )
}

export default GovernmentIdStepWrapper
