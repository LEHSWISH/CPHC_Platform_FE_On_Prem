import { CircularProgress, TextField } from '@mui/material'
import './NumberVerificationOTPForm.styles.scss'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { ViewTripDetailsV2DataType } from './ViewTripDetailsV2'
import { requestOtpApi, updateYatriDetailsApi } from '../../../services/api'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { isAxiosError } from 'axios'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import { TemplateKeyEnum } from '../../../enums/AuthTemplateKeyEnum'

function NumberVerificationOTPForm(props: NumberVerificationOTPFormPropType) {
    const [timer, setTimer] = useState(59)
    const [started, setStarted] = useState(true)
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const phoneNumber = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.phoneNumber || '',
    )
    const userName = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.userName || '',
    )
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)
    const validationSchema = Yup.object({
        otp: Yup.string()
            .required('Please enter the OTP to continue')
            .length(6, 'Please enter a valid OTP'),
    })

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        onSubmit: values => {
            if (isLoading) {
                return
            }
            setIsLoading(true)
            updateYatriDetailsApi({
                phoneNumber: phoneNumber,
                otp: values.otp,
                templateKey: TemplateKeyEnum.YATRI_PHONE_NUMBER,
                yatriDetails: {
                    phoneNumber: props.formUpdateData.phoneNumber,
                    dateOfBirth: props.formUpdateData.dateOfBirth
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    emailId: props.formUpdateData.email,
                    gender: props.formUpdateData.gender,
                    tourStartDate: props.formUpdateData.tourStartDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    tourEndDate: props.formUpdateData.tourEndDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    tourDuration:
                        parseInt(props.formUpdateData.tourDuration) || 0,
                },
            })
                .then(() => {
                    dispatch(loadYatriAllData())
                    // props.formToggle(true)
                    props.navigateBack(true)
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: 'Yatri details Updated Successfully',
                            severity: 'success',
                        }),
                    )
                })
                .catch(err => {
                    let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.message) {
                        message = err.response?.data?.message
                    }
                    dispatch(
                        setSnackBar({
                            open: true,
                            message,
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => setIsLoading(false))
        },
        validateOnBlur: true,
        validationSchema,
    })

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
            const onlyNumbers = value.replace(/[^0-9]/g, '').slice(0, 6)
            formik.setFieldValue(name, onlyNumbers)
        } else {
            formik.handleChange(event)
        }
    }

    const startTimer = () => {
        if (!resetButtonDisabled) {
            setResetButtonDisabled(true)
            setTimer(59)
            setStarted(true)
            requestOtpApi({
                userName: userName,
                phoneNumber: props.formUpdateData.phoneNumber,
                templateKey: TemplateKeyEnum.YATRI_PHONE_NUMBER,
            })
                .then(() => {})
                .catch(err => {
                    let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.message) {
                        message = err.response?.data?.message
                    }
                    dispatch(
                        setSnackBar({
                            open: true,
                            message,
                            severity: 'error',
                        }),
                    )
                })
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
        <div className="number-verification-otp-container">
            <div className="otp-verification-head">
                <span>OTP Verification</span>
            </div>
            <div className="otp-verification-body">
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="otp-field-container">
                        <div className="otp-field-heading">
                            Enter the OTP sent on XXXXXX
                            {props.formUpdateData?.phoneNumber.slice(-4)} to
                            update your contact details.
                        </div>
                        <div className="otp-field">
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
                        </div>
                        <div className="resend-div">
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
                    <button className="verify-otp-button" type="submit">
                        Verify & Update &nbsp;
                        {isLoading && (
                            <CircularProgress
                                color="inherit"
                                variant="indeterminate"
                                size={'1em'}
                            />
                        )}
                    </button>
                    <div
                        className="yatri-navigate-back"
                        onClick={() => props.navigateBack(true)}
                    >
                        Back to Yatri details
                    </div>
                </form>
            </div>
        </div>
    )
}

interface NumberVerificationOTPFormPropType {
    navigateBack: (value: boolean) => void
    formUpdateData: ViewTripDetailsV2DataType
}

export default NumberVerificationOTPForm
