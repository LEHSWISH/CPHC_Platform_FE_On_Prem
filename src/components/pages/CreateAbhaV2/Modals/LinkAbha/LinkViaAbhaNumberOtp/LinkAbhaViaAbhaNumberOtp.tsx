import { CircularProgress, TextField } from '@mui/material'
import { useFormik } from 'formik'
import './LinkViaAbhaNumber.scss'
import React, { useCallback, useEffect, useState } from 'react'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import {
    fetchAbhaCard,
    fetchAbhaCardPdf,
    linkViaABHAAdressVerifyViaAadhar,
    linkViaABHAVerify,
    linkViaABHAVerifyViaAadhar,
    linkViaAadhaarNumber,
    linkViaAadhaarNumberVerify,
    linkViaAadharVerify,
    linkViaAbhaAddressViaAadhar,
    linkViaAbhaAddressViaAbha,
    linkViaAbhaNumberViaAadhar,
    linkViaAbhaNumberViaAbha,
    linkViaPhoneNumber,
    linkViaPhoneNumberUserVerify,
    linkViaPhoneNumberVerify,
} from '../../../../../../services/api'
import backNavigate from '../../../../../../assets/icons/backNavigate.svg'
import {
    loadYatriAllData,
    setAbhaCardDetails,
} from '../../../../../../services/store/slices/yatriSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { VerifyOtpFor } from '../../../../../../enums/linkAbha/VerifyOtpFor'
import { ChooseLink } from '..'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import SelectAbhaAddress from '../LinkViaPhoneModals/SelectAbhaAddress'

function LinkAbhaViaAbhaNumberOtp({
    goBack,
    step,
    data,
    coming,
    setData,
    radioButtonValues,
    abhaNumber,
    abhaAddress,
    encryptedAadharNumberValue
}: LinkAbhaOtpFormProps) {
    const [timer, setTimer] = useState(59)
    const [started, setStarted] = useState(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [otpFocused, setOtpFocused] = useState<string>('')
    const [verifyPhoneOtpResponse, setVerifyPhoneOtpResponse] = useState()
    const [abhaAddressSelectionModal, setAbhaAddressSelectionModal] =
        useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [resetButtonDisabled, setResetButtonDisabled] =
        useState<boolean>(true)
    const handleBackNavigation = () => {
        goBack(step - 1)
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

    const errorCatch = (err: unknown) => {
        let message = 'Something went wrong, Please try again'
        if (isAxiosError(err) && err.response?.data?.message) {
            message = err.response.data.errorDetails
                ? err.response.data.errorDetails.message
                : err.response?.data?.message
        }
        dispatch(
            setSnackBar({
                open: true,
                message,
                severity: 'error',
            }),
        )
    }

    const fetchAbhaCardFlow = useCallback(
        ({
            token,
            authType,
            aadharNumber,
        }: {
            token: string
            authType: string
            aadharNumber: string
        }) => {
            fetchAbhaCard({
                abhaToken: token,
                authType: authType,
                aadharNumber: aadharNumber,
            })
                .then(() => {})
                .catch(() => {})

            fetchAbhaCardPdf({
                abhaToken: token,
                authType: authType,
                aadharNumber: aadharNumber,
            })
                .then(() => {})
                .catch(() => {})
        },
        [],
    )

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        onSubmit: values => {
            if (isLoading) {
                return
            }
            if (coming === 'abhaNumber') {
                setIsLoading(true)
                if (data.otpFor === VerifyOtpFor.ABHA) {
                    linkViaABHAVerify({
                        txnId: data.txnId,
                        otp: values.otp,
                    })
                        .then(res => {
                            fetchAbhaCardFlow({
                                token: res.data.tokens?.token || '',
                                authType: res.data.authType,
                                aadharNumber: '',
                            })
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
                                message = err.response.data.errorDetails
                                    ? err.response.data.errorDetails.message
                                    : err.response?.data?.message
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
                } else {
                    linkViaABHAVerifyViaAadhar({
                        txnId: data.txnId,
                        otp: values.otp,
                    })
                        .then(res => {
                            fetchAbhaCardFlow({
                                token: res.data.tokens?.token || '',
                                authType: res.data.authType,
                                aadharNumber: '',
                            })
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
                                message = err.response.data.errorDetails
                                    ? err.response.data.errorDetails.message
                                    : err.response?.data?.message
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
                }
            } else if (coming === 'abhaAddress') {
                setIsLoading(true)
                if (data.otpFor === VerifyOtpFor.ABHA) {
                    linkViaAadharVerify({
                        txnId: data.txnId,
                        otp: values.otp,
                    })
                        .then(res => {
                            fetchAbhaCardFlow({
                                token: res.data.tokens?.token || '',
                                authType: res.data.authType,
                                aadharNumber: '',
                            })
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
                                message = err.response.data.errorDetails
                                    ? err.response.data.errorDetails.message
                                    : err.response?.data?.message
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
                } else {
                    linkViaABHAAdressVerifyViaAadhar({
                        txnId: data.txnId,
                        otp: values.otp,
                    })
                        .then(res => {
                            fetchAbhaCardFlow({
                                token: res.data.tokens?.token || '',
                                authType: res.data.authType,
                                aadharNumber: '',
                            })
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
                                message = err.response.data.errorDetails
                                    ? err.response.data.errorDetails.message
                                    : err.response?.data?.message
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
                }
            } else if (coming === 'aadhaarNumber') {
                linkViaAadhaarNumberVerify({
                    txnId: data.txnId,
                    otp: values.otp,
                })
                .then(res => {
                    dispatch(setSnackBar({
                        open: true,
                        message: 'ABHA linked successfully!',
                        severity: 'success',
                    }),)
                    fetchAbhaCardFlow({
                        token: res.data.tokens?.token || '',
                        authType: res.data.authType,
                        aadharNumber: '',
                    })
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
                        message = err.response.data.errorDetails
                            ? err.response.data.errorDetails.message
                            : err.response?.data?.message
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
                    
            } else {
                linkViaPhoneNumberVerify({
                    txnId: data.txnId,
                    otp: values.otp,
                })
                    .then(res => {
                        if(res?.data.authResult === 'failed') {
                            dispatch(
                                setSnackBar({
                                    open: true,
                                    message: res?.data?.message,
                                    severity: 'error',
                                }),
                            )
                            return
                        } // Checking if OTP entered is correct or not, 
                          //API doesn't fail it gives response with authResult as failed
                        if(res?.data.accounts.length > 1) {
                            setVerifyPhoneOtpResponse(res?.data)
                            setAbhaAddressSelectionModal(true)
                        } else {
                            linkViaPhoneNumberUserVerify({
                                txnId: res.data?.txnId,
                                abhaToken: res.data?.token,
                                ABHANumber: res.data?.accounts[0].ABHANumber
                            }).then(res => {
                                fetchAbhaCardFlow({
                                    token: res.data.tokens?.token || '',
                                    authType: res.data.authType,
                                    aadharNumber: '',
                                })
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
                                let message = 'Something went wrong, Please try again'
                                if (isAxiosError(err) && err.response?.data?.message) {
                                    message = err.response.data.errorDetails
                                        ? err.response.data.errorDetails.message
                                        : err.response?.data?.message
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
                        }
                    })
                    .catch(err => {
                        let message = 'Something went wrong, Please try again'
                        if (isAxiosError(err) && err.response?.data?.message) {
                            message = err.response.data.errorDetails
                                ? err.response.data.errorDetails.message
                                : err.response?.data?.message
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
            }
        },
    })

    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name === 'otp') {
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
        }
        if (step === 1) {
            if (coming === ChooseLink.PHONE_NUMBER) {
                linkViaPhoneNumber({
                    mobile: data.inputValue,
                })
                    .then(res => {
                        setData({
                            txnId: res.data.txnId,
                            inputValue: data.inputValue,
                            otpFor: '',
                        })
                    })
                    .catch(errorCatch)
            } else if (coming === ChooseLink.AADHAAR_NUMBER) {
                linkViaAadhaarNumber({
                    aadhaar: encryptedAadharNumberValue || '',
                })
                    .then(res => {
                        setData({
                            txnId: res.data.txnId,
                            inputValue: data.inputValue,
                            otpFor: '',
                        })
                    })
                    .catch(errorCatch)
            }
        }
        if (step == 2) {
            if (coming === ChooseLink.ABHA_NUMBER && abhaNumber) {
                if (radioButtonValues === OptionsGetOtpRadioButton.AADHAR) {
                    linkViaAbhaNumberViaAadhar({
                        ABHANumber: abhaNumber,
                    })
                        .then(res => {
                            setData({
                                txnId: res.data.txnId,
                                inputValue: res.data?.message?.split('')?.[
                                    res.data?.message?.split('')?.length - 1
                                ],
                                otpFor: VerifyOtpFor.AADHAR,
                            })
                        })
                        .catch(err => errorCatch(err))
                        .finally(() => setIsLoading(false))
                } else if (
                    radioButtonValues === OptionsGetOtpRadioButton.ABHA
                ) {
                    linkViaAbhaNumberViaAbha({
                        ABHANumber: abhaNumber,
                    })
                        .then(res => {
                            setData({
                                txnId: res.data.txnId,
                                inputValue: res.data?.message?.split(' ')?.[
                                    res.data?.message?.split(' ')?.length - 1
                                ],
                                otpFor: VerifyOtpFor.ABHA,
                            })
                        })
                        .catch(err => errorCatch(err))
                        .finally(() => setIsLoading(false))
                }
            } else if (coming === ChooseLink.ABHA_ADDRESS && abhaAddress) {
                if (radioButtonValues === OptionsGetOtpRadioButton.AADHAR) {
                    linkViaAbhaAddressViaAadhar({
                        healthid: abhaAddress,
                    })
                        .then(res => {
                            setData({
                                txnId: `${res.data.txnId}`,
                                inputValue:
                                    res.data?.message?.split('')?.[
                                        res.data?.message?.split('')?.length - 1
                                    ] || '',
                                otpFor: VerifyOtpFor.AADHAR,
                            })
                        })
                        .catch(err => errorCatch(err))
                        .finally(() => setIsLoading(false))
                } else if (
                    radioButtonValues === OptionsGetOtpRadioButton.ABHA
                ) {
                    linkViaAbhaAddressViaAbha({
                        healthid: abhaAddress,
                    })
                        .then(res => {
                            setData({
                                txnId: res.data.txnId,
                                inputValue: res.data?.message?.split('')?.[
                                    res.data?.message?.split('')?.length - 1
                                ],
                                otpFor: VerifyOtpFor.ABHA,
                            })
                        })
                        .catch(err => errorCatch(err))
                        .finally(() => setIsLoading(false))
                }
            }
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
            <div className="link-otp-verification-container">
                <div className="otp-verification-head">
                    <img
                        src={arrowLeftSvgIcon}
                        alt="back"
                        onClick={handleBackNavigation}
                    />
                    <div className="back-btn" onClick={handleBackNavigation}>
                        <img src={backNavigate} alt="back" />
                        <div>
                            <span>Back</span>
                        </div>
                    </div>
                    <span>OTP Verification</span>
                </div>
                <div className="otp-verification-body">
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <div className="otp-field-container">
                            <div className="otp-field-heading">
                                {data?.isMobile
                                    ? `Enter the OTP sent on XXXXXX${data?.inputValue?.slice(-4)} linked with ABHA`
                                    : data?.inputValue
                                      ? `Enter the OTP sent on XXXXXX${data?.inputValue?.slice(-4)} linked with ${radioButtonValues === OptionsGetOtpRadioButton.ABHA ? 'ABHA' : 'Aadhaar'}`
                                      : radioButtonValues ===
                                          OptionsGetOtpRadioButton.ABHA
                                        ? 'Enter the OTP sent on registered number linked with ABHA'
                                        : 'Enter the OTP sent on registered number linked with Aadhaar'}
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
                        <button className="get-otp-button" type="submit">
                            Verify & Link &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                        {/* <div className="existing-abha-number">
                            <span className="abha-text">
                                Don't have ABHA number?
                            </span>
                            <a className="link-abha">Create ABHA</a>
                        </div> */}
                    </form>
                </div>
            </div>
            {abhaAddressSelectionModal && (
                <CardBackdrop
                    setClose={() => setAbhaAddressSelectionModal(false)}
                >
                    <SelectAbhaAddress responseData={verifyPhoneOtpResponse} navigate={handleBackNavigation} />
                </CardBackdrop>
            )}
        </>
    )
}
interface LinkAbhaOtpFormProps {
    abhaAddress?: string
    abhaNumber?: string
    step: number
    goBack: (step: number) => void
    data: {
        txnId: string
        inputValue: string
        otpFor: string
        isMobile?: boolean
    }
    coming: string
    setData: (data: { txnId: string; inputValue: string; otpFor: string }) => void
    radioButtonValues?: string
    encryptedAadharNumberValue?:string
}

enum OptionsGetOtpRadioButton {
    ABHA = 'abha',
    AADHAR = 'aadhar',
}

export default LinkAbhaViaAbhaNumberOtp
