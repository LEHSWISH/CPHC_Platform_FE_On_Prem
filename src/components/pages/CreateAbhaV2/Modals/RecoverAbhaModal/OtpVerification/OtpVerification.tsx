import { useEffect, useState } from 'react'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import './OtpVerification.styles.scss'
import { useFormik } from 'formik'
import { CircularProgress, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import {
    RecoverAbhaGenerateMobileOtpApi,
    RecoverAbhaVerifyMobileOtpApi,
    RecoverAbhaVerifyUserApi,
    fetchAbhaCard,
    fetchAbhaCardPdf,
} from '../../../../../../services/api'
import {
    loadYatriAllData,
    setAbhaCardDetails,
} from '../../../../../../services/store/slices/yatriSlice'
import { useNavigate } from 'react-router-dom'
import backNavigate from '../../../../../../assets/icons/backNavigate.svg'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { isAxiosError } from 'axios'
import { ResendOtpDataDataType } from '../RecoverAbhaForm'
import { RecoverAbhaVerifyMobileOtpApiResponseType } from '../../../../../../interface/ApiResponseTypes'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import RecoverAbhaSelection from '../RecoverAbhaSelection/RecoverAbhaSelection'

function OtpVerification(props: RecoverOtpVerificationPropType) {
    const [timer, setTimer] = useState<number>(59)
    const [started, setStarted] = useState<boolean>(true)
    const [otpFocused, setOtpFocused] = useState<string>('')
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)
    const [recoverButtonDisabled, setRecoverButtonDisabled] =
        useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const maskedNumber = props.resendData.message.slice(-4)
    const [txnId, setTxnId] = useState<string>(props.resendData.txnId)
    const [abhaVerifyOtpResponse, setAbhaVerifyOtpResponse] = useState<RecoverAbhaVerifyMobileOtpApiResponseType>()
    const [recoverAbhaSelectionModal, setRecoverAbhaSelectionModal] = useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        onSubmit: values => {
            if (isLoading || values.otp === '' || values.otp.length !== 6) {
                return
            }

            setIsLoading(true)
            RecoverAbhaVerifyMobileOtpApi({
                otp: values.otp,
                txnId: txnId,
            })
                .then(res => { 
                    setRecoverButtonDisabled(true)
                    setResetButtonDisabled(true)
                    setStarted(false)
                    if(!res?.data.accounts.length && res.data.message){
                        const message=res.data.message
                        dispatch(
                            setSnackBar({
                                open: true,
                                message,
                                severity: 'error',
                            }),
                        )
                    }
                    else if (res?.data.accounts.length > 1) {
                        setAbhaVerifyOtpResponse(res?.data)
                        setRecoverAbhaSelectionModal(true)
                    } else {
                        RecoverAbhaVerifyUserApi({
                            txnId: res.data?.txnId,
                            abhaToken: res.data?.token,
                            ABHANumber: res.data?.accounts[0].ABHANumber,
                        }).then(res => {
                            dispatch(
                                setSnackBar({
                                    open: true,
                                    message: res.data.message,
                                    severity: 'success',
                                }),
                            )
                            fetchAbhaCard({
                                abhaToken: res.data.tokens?.token || '',
                                authType: res.data.authType,
                                aadharNumber: '',
                            })
                                .then(() => {})
                                .catch(() => {})

                            fetchAbhaCardPdf({
                                abhaToken: res.data.tokens?.token || '',
                                authType: res.data.authType,
                                aadharNumber: '',
                            })
                                .then(() => {})
                                .catch(() => {})
                            dispatch(
                                setAbhaCardDetails({
                                    abhaCardImage: res.data.preSignedUrl,
                                    abhaCardPdfUrl: res.data.preSignedUrl,
                                    abhaNumber: res.data.ABHANumber,
                                }),
                            )
                            dispatch(loadYatriAllData())
                            navigate(`/${coreRoutesEnum.CREATE_ABHA}`)
                        }).catch((err)=>{
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
                            .then((res:any) => {
                                dispatch(
                                    setSnackBar({
                                        open: true,
                                        message: res.data.message,
                                        severity: 'success',
                                    }),
                                )
                                fetchAbhaCard({
                                    abhaToken: res.data.tokens?.token || '',
                                    authType: res.data.authType,
                                    aadharNumber: '',
                                })
                                    .then(() => {})
                                    .catch(() => {})

                                fetchAbhaCardPdf({
                                    abhaToken: res.data.tokens?.token || '',
                                    authType: res.data.authType,
                                    aadharNumber: '',
                                })
                                    .then(() => {})
                                    .catch(() => {})
                                dispatch(
                                    setAbhaCardDetails({
                                        abhaCardImage: res.data.preSignedUrl,
                                        abhaCardPdfUrl: res.data.preSignedUrl,
                                        abhaNumber: res.data.ABHANumber,
                                    }),
                                )
                                dispatch(loadYatriAllData())
                                navigate(`/${coreRoutesEnum.CREATE_ABHA}`)
                            })
                            .catch(err => {
                                let message =
                                    'Something went wrong, Please try again'
                                if (
                                    isAxiosError(err) &&
                                    err.response?.data?.message
                                ) {
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
            RecoverAbhaGenerateMobileOtpApi({
                mobile: props.resendData.mobile,
                consent: true,
            })
                .then(res => setTxnId(res?.data.txnId))
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
        <>
            <div className="otp-verify-container">
                <div className="otp-verify-head">
                    <img
                        src={arrowLeftSvgIcon}
                        alt="back"
                        onClick={() => props.backNavigate()}
                    />
                    <div
                        className="back-btn"
                        onClick={() => props.backNavigate()}
                    >
                        <img src={backNavigate} alt="back" />
                        <div>
                            <span>Back</span>
                        </div>
                    </div>
                    <span>OTP Verification</span>
                </div>
                <div className="otp-verify-body">
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <div className="otp-field-container">
                            <div className="otp-field-heading">
                                Enter the OTP sent on XXXXXX{maskedNumber}
                            </div>
                            <div className="otp-field">
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
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
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
                        <button
                            className={`get-otp-button ${!recoverButtonDisabled ? 'disabled' : ''}`}
                            type="submit"
                        >
                            Recover &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                    </form>
                </div>
            </div>
            {recoverAbhaSelectionModal && (
                <CardBackdrop
                    setClose={() => setRecoverAbhaSelectionModal(false)}
                >
                    <RecoverAbhaSelection responseData={abhaVerifyOtpResponse} backNavigate={props.backNavigate} />
                </CardBackdrop>
            )}
        </>
    )
}

interface RecoverOtpVerificationPropType {
    backNavigate: () => void
    resendData: ResendOtpDataDataType
}

export default OtpVerification
