import './OTPVerificationForm.styles.scss'
import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import {
    CircularProgress,
    Divider,
    TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import Footer from '../../../../shared/Footer/Footer'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

function OTPVerificationForm(props: OTPVerificationFormPropsType) {
    const [isLoading] = useState<boolean>(false)
    const [started, setStarted] = useState<boolean>(true)
    const [timer, setTimer] = useState<number>(59)
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)

    const validationSchema = Yup.object({
        otp: Yup.string()
            .required('Please enter OTP to continue')
            .length(6, 'OTP length should be 6 digits'),
    })

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

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        onSubmit: () => {
            // On success
            props.updateStep(2)
        },
        validateOnBlur: true,
        validationSchema,
    })

    const startTimer = () => {
        if (!resetButtonDisabled) {
            setResetButtonDisabled(true)
            setTimer(59)
            setStarted(true)
            // RecoverAbhaGenerateMobileOtpApi({
            //     mobile: props.resendData.mobile,
            //     consent: true,
            // })
            // .then(res => setTxnId(res?.data.txnId)
            //     )
            // .catch(err => {
            //     let message = 'Something went wrong, Please try again'
            //     if (isAxiosError(err) && err.response?.data?.message) {
            //         message = err.response?.data?.message
            //     }
            //     dispatch(
            //         setSnackBar({
            //             open: true,
            //             message,
            //             severity: 'error',
            //         }),
            //     )
            // })
        }
    }

    const formatTimer = () => {
        const minutes = Math.floor(timer / 60)
        const remainingSeconds = timer % 60
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
        const formattedSeconds =
            remainingSeconds < 10
                ? `0${remainingSeconds}`
                : `${remainingSeconds}`
        return `${formattedMinutes}:${formattedSeconds}`
    }

    return (
        <div className="recovered-otp-container">
            <div className="page-logo">
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
            <form className="otp-form" onSubmit={formik.handleSubmit}>
                <div className="otp-description">
                    <h2>OTP Verification</h2>
                    <p>
                        Enter the OTP sent to XXXXXX
                        {props.phoneNumber.slice(-4)}
                    </p>
                </div>
                <div className="form-fields">
                    <div className="otpfield-container">
                        <TextField
                            type="text"
                            label="OTP"
                            id="otp"
                            name="otp"
                            placeholder="- - - - - -"
                            onChange={handleOtpChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.otp}
                            helperText={formik.errors.otp}
                            error={!!formik.errors.otp}
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div
                            className="resend-div"
                            style={{ maxWidth: '100%' }}
                        >
                            <span className="resend-text">
                                Resend OTP in {formatTimer()}
                            </span>
                            <a
                                className={`resend-button ${resetButtonDisabled ? 'disabled' : ''}`}
                                onClick={startTimer}
                            >
                                Resend
                            </a>
                        </div>
                    </div>
                </div>
                <button
                    className="verify-button"
                    type="submit"
                    disabled={isLoading}
                >
                    Verify & Continue &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
                <div className="signin-route">
                    <NavLink
                        className="navigate"
                        to={`/${coreRoutesEnum.LOG_IN}`}
                    >
                        Back to Login
                    </NavLink>
                </div>
            </form>
            <Footer />
        </div>
    )
}

interface OTPVerificationFormPropsType {
    phoneNumber: string
    updateStep: (step: number) => void
}

export default OTPVerificationForm
