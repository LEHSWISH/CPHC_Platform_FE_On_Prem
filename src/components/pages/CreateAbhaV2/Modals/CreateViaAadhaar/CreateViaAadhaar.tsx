import { Divider } from '@mui/material'
import SharedStepper from '../../../../shared/SharedStepper'
import './CreateViaAadhaar.styles.scss'
import { useEffect, useState } from 'react'
import AadhaarIdForm from './AadhaarIdForm/AadhaarIdForm'
import AadhaarAuthentication from './AadhaarAuthentication/AadhaarAuthentication'
import CreateAbha from './CreateAbha/CreateAbha'
interface AadhaarIdFormDataType {
    aadhaarNumber: string
    termsAccepted: boolean
}
interface AbhaAddressFormDataType {
    abhaAddress: string
}

export interface UpdateOtpResendDataDataType {
    aadhaar: string
    message: string
}

function CreateViaAadhaar({
    openAbhaCard,
    onClose,
    currentStep,
}: {
    onClose: () => void
    openAbhaCard: () => void
    currentStep: (step: number) => void
}) {
    const steps = [
        'Enter Aadhaar Number',
        'Aadhaar Authentication and Communication details',
        'Create ABHA Address',
    ]

    const [selectedStep, setSelectedStep] = useState<number>(0)
    const [responseData,setResponseData]=useState()
    const [aadhaarIdFormData, setAadhaarIdFormData] =
        useState<AadhaarIdFormDataType>({
            aadhaarNumber: '',
            termsAccepted: false,
        })
    const [txnId, setTxnId] = useState<string>('')
    const [transfertxnId, setTransfertxnId] = useState<string>('')

    const [abhaAddressFormData] = useState<AbhaAddressFormDataType>({
        abhaAddress: '',
    })
    const [aadharEncryptedValue,setAadharEncryptedValue]=useState<string>('')

    const [otpResendData, setOtpResendData] =
        useState<UpdateOtpResendDataDataType>({
            aadhaar: '',
            message: '',
        })
    const setUrlData=(data:any)=>
    {
        setResponseData(data)
    }
    useEffect(() => {
        if(selectedStep === 0) {
            currentStep(0)
        } else {
            currentStep(1)
            // Taking 1 for any other step as we only need to show close button on first screen
            // so rest can be any valies, so 0 and 1 is acting as a switch here.
        }
    }, [selectedStep])

    const handleAadhaarIdFormData = (data: AadhaarIdFormDataType) => {
        setAadhaarIdFormData(data)
        setSelectedStep(1)
    }

    const handleOtpResendData = (data: UpdateOtpResendDataDataType) => {
        setOtpResendData(data)
    }
    const getEncryptedAadhar=(value:string)=>{
        setAadharEncryptedValue(value)
    }
    return (
        <div className="create-aadhaar-container">
             <div className="stepper-div">
                <SharedStepper steps={steps} activeStep={selectedStep} />
            </div>
            <div className="stepper-line">
                <Divider
                    sx={{ marginTop: '2em', marginBottom: '2.66em' }}
                    orientation="horizontal"
                    variant="fullWidth"
                    className="stepper"
                />
            </div>
            <div className="step-component-container">
                {selectedStep === 0 ? (
                    <AadhaarIdForm
                        formData={aadhaarIdFormData}
                        updateTxnId={setTxnId}
                        updateOtpResendData={handleOtpResendData}
                        setUpdatedFormData={handleAadhaarIdFormData}
                        getEncryptedAadhar={getEncryptedAadhar}
                    />
                ) : selectedStep === 1 ? (
                    <AadhaarAuthentication
                        setTransfertxnId={setTransfertxnId}
                        txnId={txnId}
                        backNavigation={setSelectedStep}
                        setSelectedStep={() => {
                            setSelectedStep(2)
                        }}
                        openAbhaCard={openAbhaCard}
                        otpResendData={otpResendData}
                        responseData={setUrlData}
                        aadharEncryptedValue={aadharEncryptedValue}
                    />
                ) : (
                    <CreateAbha
                        txnId={transfertxnId}
                        formData={abhaAddressFormData}
                        responseData={responseData}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    )
}

export default CreateViaAadhaar