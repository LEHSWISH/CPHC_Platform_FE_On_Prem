import { useState } from 'react'
import AccountSelectionForm from './AccountSelectionForm/AccountSelectionForm'
import SigninPasswordForm from './SigninPasswordForm/SigninPasswordForm'
import UnifiedSigninForm from './UnifiedSigninForm/UnifiedSigninForm'
import { GetAllUserLinkedWithPhoneNumberResponseType } from '../../../../interface/ApiResponseTypes'

const SigninFormV2 = () => {
    const [step, setStep] = useState<number>(1)
    const [response, setResponse] =
        useState<GetAllUserLinkedWithPhoneNumberResponseType>()
    const [selection, setSelection] = useState<string>('')
    const [isOnlyOneUserExist, setIsOnlyOneUserExist] = useState<boolean>(false)

    return (
        <>
            {step === 1 ? (
                <UnifiedSigninForm
                    updateStep={setStep}
                    setResponse={setResponse}
                    setSelection={setSelection}
                    setIsOnlyUserExist={setIsOnlyOneUserExist}
                />
            ) : step === 2 ? (
                <AccountSelectionForm
                    updateStep={setStep}
                    response={response}
                    setSelection={setSelection}
                />
            ) : (
                <SigninPasswordForm
                    selection={selection}
                    onlyOneUserExist={isOnlyOneUserExist}
                    setStep={setStep}
                />
            )}
        </>
    )
}

export default SigninFormV2
