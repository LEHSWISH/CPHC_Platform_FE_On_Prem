import { useState } from "react"
import RegisteredNumberForm from "./RegisteredNumberForm/RegisteredNumberForm"
import RecoveredAccountSelection from "./RecoveredAccountSelection/RecoveredAccountSelection"
import RecoveredUsernameSignin from "./RecoveredUsernameSignin/RecoveredUsernameSignin"

function RecoverUsernameFormV2() {
    const [step, setStep] = useState<number>(2)

    return (
        <>
            {step === 1 ? (
                <RegisteredNumberForm updateStep={setStep} />
            ) : step === 2 ? (
                <RecoveredAccountSelection updateStep={setStep} />
            ) : (
                <RecoveredUsernameSignin />
            )}
        </>
    )
}

export default RecoverUsernameFormV2
