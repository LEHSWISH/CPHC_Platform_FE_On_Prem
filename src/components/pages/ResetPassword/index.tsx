import { useState } from 'react'
import { FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import './resetPassword.style.scss'
import ResetPasswordDetails, {
    ResetPasswordDetailsValueType,
} from './ResetPasswordDetails'
import OtpForm from './OtpForm/OtpForm'
import ConfirmPassword, { ConfirmPasswordValueType } from './ConfirmPassword'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import HitApi from '../../../classes/http/HitApi'
import { RequestMethod } from '../../../enums/RequestMethods'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { validateUsernamePhoneNumber } from '../../../services/api'
import Image1 from '../../../assets/Images/Char_Dham_Badrinath.png'
import Image2 from '../../../assets/Images/Gangotri banner 2.jpg'
import Image3 from '../../../assets/Images/Yamunotri_under banner image 1.jpg'
import Image4 from '../../../assets/Images/image 11 (1).png'
import Carousel from '../../shared/Carousel/Carousel'
const ResetPassword = () => {
    const slides = [
        Image1,
        Image2,
        Image3,
        Image4,
        // Add more slide URLs as needed
    ]
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [step, setStep] = useState(1)
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const [otpResponse, setOtpResponse] = useState({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    let getOtpPayload = {}
    const onSubmitDetails = (
        value: ResetPasswordDetailsValueType,
        actions: FormikHelpers<ResetPasswordDetailsValueType>,
    ) => {
        if(isLoading) return
        setPhoneNumber(value.phoneNumber)
        setUserName(value.userName)
        getOtpPayload = {
            ...value,
            templateKey: 'reset-password',
        }
        setIsLoading(true)
        validateUsernamePhoneNumber({
            userName: value.userName,
            phoneNumber: value.phoneNumber,
        })
            .then(() => {
                const getOtp = HitApi.hitapi({
                    url: 'user-service/api/v1/yatri/send-otp',
                    payload: getOtpPayload,
                    requestMethod: RequestMethod.POST,
                    ignoreBaseUrl: false,
                    sucessFunction: (res: any) => {
                        if (res.status === 200) setStep(2)
                    },
                    errorFunction: (error: any) => {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: error?.data?.message,
                                severity: 'error',
                            }),
                        )
                    },
                    // endFunction: () => setIsLoading(false)
                })
                return getOtp
            })
            .catch(err => {
                actions.setFieldError(
                    'phoneNumber',
                    err?.response?.data?.message,
                )
                dispatch(
                    setSnackBar({
                        open: true,
                        message: err?.response?.data?.message,
                        severity: 'error',
                    }),
                )
            })
            .finally(() => setIsLoading(false))    
    }

    const onSubmitOtp = (value: any) => {
        setOtpResponse(value)
        setStep(3)
    }

    const onConfirmPassword = (
        value: ConfirmPasswordValueType,
        actions: FormikHelpers<ConfirmPasswordValueType>,
    ) => {
        console.debug(value, actions)
        navigate(coreRoutesEnum.LOG_IN)
    }

    return (
        <>
            <Carousel slides={slides} />
            <div className="reset-password-background">
                <div className="container-wrapper">
                    <div className="form-container">
                        {step === 1 ? (
                            <ResetPasswordDetails onSubmit={onSubmitDetails} loader={isLoading} />
                        ) : step === 2 ? (
                            <OtpForm
                                userName={userName}
                                phoneNumber={phoneNumber}
                                heading="Reset Password"
                                onSubmit={onSubmitOtp}
                                templateKey="reset-password"
                            />
                        ) : (
                            <ConfirmPassword
                                otpResponse={otpResponse}
                                onSubmit={onConfirmPassword}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
