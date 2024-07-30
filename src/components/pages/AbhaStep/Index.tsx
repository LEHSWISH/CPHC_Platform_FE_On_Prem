import { useEffect, useRef, useState } from 'react'
import ABHARegistrationContainer from '../../shared/ABHARegistrationContainer/ABHARegistrationContainer'
import LinkAbha from './LinkAbha/LinkAbha'
import CreateAbha from './CreateAbha'
import GovtId from './GovtId/GovtId'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'
import { DefaultAuthenticatedRedirectRoute } from '../../../enums/routingEnums'

const steps = [
    'Provide us your basic information',
    'Provide your Government ID',
]

function AbhaStep() {
    const [selectedStep, setSelectedStep] = useState(3)
    const initRef = useRef<boolean>(true)
    const navigate = useNavigate()

    const { data, loading } = useAppSelector(s => s.yatri.yatriAllDetails)

    useEffect(() => {
        if (!loading && data && initRef.current) {
            if (data.abhaNumber?.length) {
                navigate(DefaultAuthenticatedRedirectRoute)
            }
            initRef.current = false
        }
    }, [loading, data, navigate])

    return (
        <ABHARegistrationContainer steps={steps} activeStep={1}>
            {selectedStep === 1 ? (
                <LinkAbha setSelectedStep={setSelectedStep} />
            ) : selectedStep === 2 ? (
                <CreateAbha setSelectedStep={setSelectedStep} />
            ) : (
                <GovtId />
            )}
        </ABHARegistrationContainer>
    )
}

export default AbhaStep
