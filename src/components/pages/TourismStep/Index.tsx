import ABHARegistrationContainer from '../../shared/ABHARegistrationContainer/ABHARegistrationContainer'
import TourismPortalId from './TourismPortalId/TourismPortalId'

function TourismStep() {
    return (
        <ABHARegistrationContainer
            steps={[
                'Provide us your basic information',
                'Link your ABHA',
                'Provide your Government ID',
                'Provide us your Yatri details',
            ]}
            activeStep={1}
        >
            <TourismPortalId />
        </ABHARegistrationContainer>
    )
}

export default TourismStep
