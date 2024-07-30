import './PilgrimUserGuide.scss'
import SharedStepper from '../../../shared/SharedStepper'
import SharedVerticalStepper from '../../../shared/SharedVerticalStepper'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import { useMediaQuery } from '@mui/material'

function PilgrimUserGuide() {
    const steps = [
        'Registration Process',
        'Health Certification',
        'Base Location Formalities',
        'Screening Point',
        'Enjoy Your Yatra',
        'Post Yatra Assessment',
    ]

    const matches = useMediaQuery('(max-width:480px)')

    const yatriData = useAppSelector(state => {
        return state.yatri.yatriAllDetails.data
    })

    return (
        <>
            <div className="user-guide-pilgrims">
                <h2 className="user-guide-text">
                    Recommended User Guide for Pilgrims
                </h2>
                {matches ? (
                    <div className="pilgrim-steps">
                        <SharedVerticalStepper
                            steps={steps}
                            activeStep={yatriData?.documentsPath?.length ? 2 : 1}
                        />
                    </div>
                ) : (
                    <div className="pilgrim-steps">
                        <SharedStepper
                            steps={steps}
                            activeStep={yatriData?.documentsPath?.length ? 2 : 1}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default PilgrimUserGuide
