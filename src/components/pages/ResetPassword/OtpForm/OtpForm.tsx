import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { CircularProgress, Divider, TextField } from '@mui/material'
import './OtpForm.scss'
import UttarakhandGovtLogo from '../../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../../assets/icons/NHM.png'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import HitApi from '../../../../classes/http/HitApi'
import { RequestMethod } from '../../../../enums/RequestMethods'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { useDispatch } from 'react-redux'
import { resendOtpApi } from '../../../../services/api'
import { TemplateKeyEnum } from '../../../../enums/AuthTemplateKeyEnum'
import Footer from '../../../shared/Footer/Footer'

function OtpForm(props: OtpFormProps) {
    const [timer, setTimer] = useState(59)
    const dispatch = useDispatch()
    const [started, setStarted] = useState(true)
    const [resetButtonDisabled, setResetButtonDisabled] =
    useState<boolean>(true)
    const [otpFocused, setOtpFocused] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    let verifyOtpPayload = {}
    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        onSubmit: values => {
            verifyOtpPayload = {
                ...values,
                userName: props.userName,
                phoneNumber: props.phoneNumber,
                templateKey: props.templateKey,
            }
            if(isLoading) return
            // props.onSubmit && props.onSubmit(values)
            // hit api of verify otp here
            setIsLoading(true)
            HitApi.hitapi({
                url: 'user-service/api/v1/yatri/verify-otp',
                payload: verifyOtpPayload,
                requestMethod: RequestMethod.POST,
                ignoreBaseUrl: false,
                sucessFunction: (res: any) => {
                    if (res.status === 200) {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: res?.data?.message,
                                severity: 'success',
                            }),
                        )
                        props.onSubmit && props.onSubmit(verifyOtpPayload)
                    }
                },
                errorFunction: (error: any) => {
                    console.error(error?.data)
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: error?.data?.message,
                            severity: 'error',
                        }),
                    )
                },
                endFunction: () => setIsLoading(false)
            })
        },
    })

    const resendApi = (payload: PayloadProps) => {
        resendOtpApi(payload)
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
                    if(timer <= 0) {
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

    const startTimer = () => {
        if (!resetButtonDisabled){
            setResetButtonDisabled(true)    
            setTimer(59)
            setStarted(true)
            resendApi({phoneNumber: props?.phoneNumber || '', userName: props?.userName || '', templateKey: TemplateKeyEnum.RESET_PASSWORD})
        }
    }
    const formatTimer = () => {
        return timer < 10 ? `0${timer}` : timer
    }

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
    return (
        <div className="otp-container-reset">
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

                <p>
                    Enter the OTP sent to
                    {` XXXXXX${props.phoneNumber && props.phoneNumber.slice(-4)}`}
                    {} to reset your password
                </p>
            </div>
            <form className="otp-form" onSubmit={formik.handleSubmit} autoComplete='off'>
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
                        // error={gotError ? true : notEnteredOtp ? true : false}
                        helperText={otpFocused}
                        error={!!otpFocused}
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                    />
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
                    Continue &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>

                <div className="signup-route">
                    <NavLink to={`/${coreRoutesEnum.LOG_IN}`}>Back to Log in</NavLink>
                </div>
            </form>
            <Footer variant="typeTwo" />
        </div>
    )
}

interface OtpFormProps {
    phoneNumber?: string
    heading: string
    userName?: string
    templateKey: string
    onSubmit?: (value: any) => void
}

interface PayloadProps {
    phoneNumber: string
    userName: string
    templateKey: TemplateKeyEnum
}

export default OtpForm
