import './OtpForm.scss'
import { useFormik } from 'formik'
import {
    CircularProgress,
    Divider,
    FormHelperText,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { resendOtpApi, signUpApi } from '../../../../../services/api'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import UttarakhandGovtLogo from '../../../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../../../assets/icons/NHM.svg'
import { TemplateKeyEnum } from '../../../../../enums/AuthTemplateKeyEnum'
import { loginYatri } from '../../../../../services/store/slices/authSlice'
import { encryptPassword, generateUUID } from '../../../../../utils/HelperFunctions'
import bcrypt from 'bcryptjs'
import Footer from '../../../../shared/Footer/Footer'

function OtpForm(props: OtpFormProps) {
    const hiddenNumber = props.signupData.phoneNumber
    const dispatch = useAppDispatch()
    const [timer, setTimer] = useState(59)
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)
    const [started, setStarted] = useState(true)
    const [otpFocused, setOtpFocused] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const gotError = false
    const notEnteredOtp = false
    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        onSubmit: async () => {
            if (isLoading) {
                return
            }
            const hashedPassword = bcrypt.hashSync(props.signupData.password, import.meta.env.VITE_API_PASSWORD_SALT) // hash created previously created upon sign up
            const timeStamp = new Date().toISOString()
            const password=`${timeStamp}%${hashedPassword}`
            const encryptedPassword=encryptPassword(password)?.toString()  
            setIsLoading(true)
            signUpApi({
                phoneNumber: props?.signupData?.phoneNumber,
                userName: props?.signupData?.userName,
                password: encryptedPassword,
                otp: formik.values.otp,
                licenseAgreement: props.signupData.termsAccepted,
                templateKey: TemplateKeyEnum.SIGN_UP,
            })
                .then(async () => {
                    dispatch(
                        setSnackBar({ 
                            open: true,
                            message: 'Signed up successfully',
                            severity: 'success',
                        }),
                    )

                    // navigate(`/${coreRoutesEnum.LOG_IN}`)
                    const sessionId = generateUUID()
                    dispatch(
                        loginYatri({
                            userName: props?.signupData?.userName,
                            password: encryptedPassword,
                            redirectFromRegistration: true,
                            sessionId: sessionId,
                        }),
                    )
                })
                .catch((err: any) => {
                    console.log(err)
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: err?.response?.data?.message,
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => setIsLoading(false))
        },
    })
    const resendApi = (signupData: OtpFormProps['signupData']) => {
        resendOtpApi({
            userName: signupData.userName,
            phoneNumber: signupData.phoneNumber,
            templateKey: TemplateKeyEnum.SIGN_UP,
        })
            .then(() => {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: 'OTP send successfully',
                        severity: 'success',
                    }),
                )
            })
            .catch((err: any) => {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: err?.data?.message
                            ? err?.data?.message
                            : 'Otp send failed due to over attempt',
                        severity: 'error',
                    }),
                )
            })
    }
    useEffect(() => {
        let intervalId: any

        if (started) {
            setResetButtonDisabled(true)
            intervalId = setInterval(() => {
                setTimer(() => {
                    if (timer <= 0) {
                        setResetButtonDisabled(false)
                        clearInterval(intervalId)
                    }
                    return timer > 0 ? timer - 1 : 0
                })
            }, 1000)
        }
        // Cleanup function to clear the interval when the component unmounts or when timer is stopped
        return () => {
            clearInterval(intervalId)
            setResetButtonDisabled(false)
        }
    }, [started, timer])

    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name === 'otp') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '').slice(0, 6)
            formik.setFieldValue(name, onlyNumbers)
        } else {
            formik.handleChange(event)
        }
    }

    const handleOtpBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const otp = event.target.value
        if (otp === '') {
            setOtpFocused('Please enter OTP to continue')
        } else if (otp.length !== 6) {
            setOtpFocused('Please enter a valid OTP')
        } else {
            setOtpFocused('')
        }
    }

    const startTimer = () => {
        if (!resetButtonDisabled) {
            setResetButtonDisabled(true)
            setTimer(59)
            setStarted(true)
            resendApi(props.signupData)
        }
    }
    const formatTimer = () => {
        return timer < 10 ? `0${timer}` : timer
    }
    return (
        <div className="otp-container">
            <div className="otp-description">
                <div className="uk-logo">
                    <img
                        src={UttarakhandGovtLogo}
                        alt="Uttrakhand Simply Heaven!"
                    />
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <img
                        src={NhmLogo}
                        className="nhm-image"
                        alt="Uttrakhand Simply Heaven!"
                    />
                </div>
                <h2>{props.heading}</h2>
                {props.comingFrom === 'signup' ? (
                    <p>
                        Enter the OTP sent to
                        {` XXXXXX${hiddenNumber.slice(-4)}`}
                    </p>
                ) : (
                    <p>
                        Enter the OTP sent to{' '}
                        {` XXXXXX${hiddenNumber.slice(-4)}`} to reset your
                        password
                    </p>
                )}
            </div>
            <form className="otp-form" onSubmit={formik.handleSubmit}>
                <div className="form-field">
                    <TextField
                        type="text"
                        label="OTP"
                        id="otp"
                        name="otp"
                        placeholder="- - - - - -"
                        onChange={handleOtpChange}
                        onBlur={handleOtpBlur}
                        value={formik.values.otp}
                        helperText={otpFocused}
                        error={!!otpFocused}
                        variant="standard"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                        fullWidth
                    />
                    {gotError ? (
                        <FormHelperText
                            children="Invalid OTP. Try again by clicking on resend."
                            error={true}
                        ></FormHelperText>
                    ) : notEnteredOtp ? (
                        <FormHelperText
                            children="
              Please enter otp to continue"
                            error={true}
                        ></FormHelperText>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="resend-div">
                    <span className="resend-text">
                        Resend OTP in 00:{formatTimer()}
                    </span>
                    <a
                        className={`resend-button ${resetButtonDisabled ? 'disabled' : ''}`}
                        onClick={startTimer}
                    >
                        Resend
                    </a>
                </div>
                <button className="continue-button" type="submit">
                    Verify & Continue &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>

                <div className="signup-route">
                    {props.comingFrom === 'signup' ? (
                        <a
                            href="#"
                            onClick={() => {
                                props.backToSignup(props.signupData, false)
                            }}
                        >
                            Back to Sign up
                        </a>
                    ) : (
                        <a href="#">Back to Login</a>
                    )}
                </div>
            </form>
            <Footer variant="typeTwo" />
        </div>
    )
}
interface OtpFormProps {
    comingFrom: string
    heading: string
    signupData: {
        userName: string
        phoneNumber: string
        password: string
        termsAccepted: boolean
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    backToSignup: Function
}
export default OtpForm
