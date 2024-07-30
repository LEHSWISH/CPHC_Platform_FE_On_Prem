import './index.scss'
import { useState } from 'react'
import SignupForm from '../Signup/SignupForm/SignupForm'
import OtpForm from '../Signup/components/OtpForm/OtpForm'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import Image4 from '../../../assets/Images/image 11 (1).png'
import Carousel from '../../shared/Carousel/Carousel'

function Signup() {

    const slides = [
        Image1,
        Image2,
        Image3,
        Image4
        // Add more slide URLs as needed
    ];
    const [showOtpForm, setShowOTPForm] = useState(false)
    const [signupData, setSignupData] = useState<SignupDataType>({
        userName: '',
        password: '',
        phoneNumber: '',
        termsAccepted: false,
    })
    const [populate, setPopulateData] = useState<SignupDataType>({
        userName: '',
        password: '',
        phoneNumber: '',
        termsAccepted: false,
    })
    const getSignupData = (data: SignupDataType, check: boolean) => {
        setSignupData(data)
        setShowOTPForm(check)
    }
    const backToSignUp = (data: SignupDataType, routeToSignUp: boolean) => {
        setShowOTPForm(routeToSignUp)
        setPopulateData(data)
    }

    return (

        <>
            <Carousel slides={slides} />
            <div className="signup-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        {!showOtpForm ? (
                            <SignupForm
                                sendSignupData={getSignupData}
                                populate={populate}
                            ></SignupForm>
                        ) : (
                            <OtpForm
                                comingFrom="signup"
                                heading="OTP Verification"
                                signupData={signupData}
                                backToSignup={backToSignUp}
                            ></OtpForm>
                        )}
                    </div>
                </div>
            </div>


        </>
    )
}
interface SignupDataType {
    userName: string
    phoneNumber: string
    password: string
    termsAccepted: boolean
}
export default Signup
