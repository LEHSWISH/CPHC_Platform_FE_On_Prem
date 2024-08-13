import { useMediaQuery } from '@mui/material'
import './ABHARegistrationContainer.styles.scss'
import Footer from '../Footer/Footer'
import SharedStepper from '../SharedStepper'
import UttarakhandGovtLogo from '../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../assets/icons/NHM.svg'
import { Divider } from '@mui/material'

function ABHARegistrationContainer(props: CardContainerProps) {
    const matches = useMediaQuery('(max-width:1024px)')

    return (
        <div
            className={
                matches
                    ? 'registration-outer-container-tab'
                    : 'registration-outer-container-web'
            }
        >
            {!matches && (
                <div
                    className={
                        matches
                            ? 'registration-container-logo-tab'
                            : 'registration-container-logo'
                    }
                >
                    <img
                        src={UttarakhandGovtLogo}
                        alt="Uttrakhand Simply Heaven!"
                    />
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <img src={NhmLogo} className='nhm-image' alt="Uttrakhand Simply Heaven!" />
                </div>
            )}
            <div
                className={
                    matches
                        ? 'registration-container-tab'
                        : 'registration-container'
                }
            >
                {matches ? (
                    <div className="registration-container-logo-tab">
                        <img
                            src={UttarakhandGovtLogo}
                            alt="Uttrakhand Simply Heaven!"
                        />
                        <Divider orientation='vertical' variant='middle' flexItem />
                        <img src={NhmLogo} className='nhm-image' alt="Uttrakhand Simply Heaven!" />
                    </div>
                ) : (
                    <div className="stepper-container">
                        <SharedStepper
                            steps={props.steps}
                            activeStep={props.activeStep}
                        />
                    </div>
                )}
                <div
                    className={
                        matches
                            ? 'component-container-tab'
                            : 'component-container'
                    }
                >
                    {props.children}
                </div>
                <Footer />
            </div>
        </div>
    )
}

interface CardContainerProps {
    children: React.ReactNode
    steps: Array<string>
    activeStep: number
}

export default ABHARegistrationContainer
