import React, { useEffect, useState } from 'react'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import {
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
} from '@mui/material'
import './LinkViaAbhaNumber.scss'
import { useTranslation } from 'react-i18next'
import backNavigate from '../../../../../../assets/icons/backNavigate.svg'
import { linkViaAbhaAddressViaAadhar, linkViaAbhaAddressViaAbha, linkViaAbhaNumberViaAadhar, linkViaAbhaNumberViaAbha,
} from '../../../../../../services/api'
import { isAxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { VerifyOtpFor } from '../../../../../../enums/linkAbha/VerifyOtpFor'

function LinkViaAbhaNumber({
    abhaAddress,
    abhaNumber,
    goBack,
    moveAhead,
    step,
    setData,
    setRadioButtonValues,
}: LinkAbhaFormProps) {
    const [selectedValue, setSelectedValue] = useState<string>(NumberType.AADHAR)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const handleBackNavigation = () => {
        goBack(step - 1)
    }

    const errorCatch = (err: unknown) => {
        let message = 'Something went wrong, Please try again'
        if (isAxiosError(err) && err.response?.data?.errorDetails) {
            try {
                const errorDetails = JSON.parse(
                    err.response?.data?.errorDetails,
                )
                message = errorDetails.error
                    ? errorDetails.error.message
                    : errorDetails.message
            } catch (err) {}
        } else if (isAxiosError(err) && err.response?.data?.message) {
            message = err.response?.data?.message
        }
        dispatch(
            setSnackBar({
                open: true,
                message,
                severity: 'error',
            }),
        )
    }

    useEffect(() => {
        setRadioButtonValues && setRadioButtonValues(NumberType.AADHAR)
    }, [setRadioButtonValues])

    const goNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(isLoading){
            return
        }

        if (abhaNumber) {
            if (selectedValue === NumberType.ABHA) {
                setIsLoading(true)
                linkViaAbhaNumberViaAbha({
                    ABHANumber: abhaNumber,
                })
                    .then(res => {
                        setData({
                            txnId: res.data.txnId,
                            inputValue: res.data.message.split(' ')[
                                res.data.message.split(' ').length - 1
                            ],
                            otpFor: VerifyOtpFor.ABHA,
                        })
                        moveAhead(step + 1)
                    })
                    .catch(err => errorCatch(err))
                    .finally(() => setIsLoading(false))
            } else if (selectedValue === NumberType.AADHAR) {
                setIsLoading(true)
                linkViaAbhaNumberViaAadhar({
                    ABHANumber: abhaNumber,
                })
                    .then(res => {
                        setData({
                            txnId: res.data.txnId,
                            inputValue: res.data.message.split(' ')[
                                res.data.message.split(' ').length - 1
                            ],
                            otpFor: VerifyOtpFor.AADHAR,
                        })
                        moveAhead(step + 1)
                    })
                    .catch(err => errorCatch(err))
                    .finally(() => setIsLoading(false))
            }
        } else if (abhaAddress) {
            if (selectedValue === NumberType.ABHA) {
                setIsLoading(true)
                linkViaAbhaAddressViaAbha({
                    healthid: abhaAddress,
                })
                    .then(res => {
                        setData({
                            txnId: res.data.txnId,
                            inputValue: res.data.message?.split('')[
                                res.data.message.split('').length - 1
                            ],
                            otpFor: VerifyOtpFor.ABHA,
                        })
                        moveAhead(step + 1)
                    })
                    .catch(err => errorCatch(err))
                    .finally(() => setIsLoading(false))
            } else if (selectedValue === NumberType.AADHAR) {
                setIsLoading(true)
                linkViaAbhaAddressViaAadhar({
                    healthid: abhaAddress,
                })
                    .then(res => {
                        setData({
                            txnId: `${res.data.txnId}`,
                            inputValue: res.data.message?.split('')[
                                res.data.message.split('').length - 1
                            ],
                            otpFor: VerifyOtpFor.AADHAR,
                        })
                        moveAhead(step + 1)
                    })
                    .catch(err => errorCatch(err))
                    .finally(() => setIsLoading(false))
            }
        }
    }
    const { t } = useTranslation()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value)
        setRadioButtonValues && setRadioButtonValues(event.target.value)
    }
    return (
        <div className="link-abha-via-abha-number">
            <div className="abha-head">
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

                <span className="abha-head-span">Link your ABHA</span>
            </div>
            <div className="abha-number">
                {abhaNumber ? 'ABHA number' : 'ABHA address'}
                {' - '}

                {abhaNumber ? (
                    <span>
                        {t('mask.abha', {
                            number: `${abhaNumber}`.slice(-4),
                        })}
                    </span>
                ) : (
                    <span>
                        {t('mask.abha-address', {
                            numberend: `${abhaAddress}`.slice(-7),
                            numberstart: `${abhaAddress}`.slice(0, 2),
                        })}
                    </span>
                )}
            </div>
            <div className="abha-body">
                <form autoComplete='off'>
                    <div className="abha-communication-container">
                        <div className="abha-communication-heading">
                            Validate your ABHA using OTP on phone number linked
                            with
                        </div>
                        <RadioGroup
                            row
                            className="radio-group"
                            name="phoneNumber"
                            defaultValue="top"
                        >
                            <FormControlLabel
                                name="aadhaar"
                                value={NumberType.AADHAR}
                                label="Aadhaar"
                                checked={selectedValue === NumberType.AADHAR}
                                control={<Radio onChange={handleChange} />}
                            />
                            <FormControlLabel
                                name="abha"
                                value={NumberType.ABHA}
                                checked={selectedValue === NumberType.ABHA}
                                label="ABHA"
                                control={<Radio onChange={handleChange} />}
                            />
                        </RadioGroup>
                    </div>
                    <button className="verify-continue-button" onClick={goNext}>
                        Get OTP &nbsp;
                        {isLoading && (
                            <CircularProgress
                                color="inherit"
                                variant="indeterminate"
                                size={'1em'}
                            />
                        )}
                    </button>
                    <div className="existing-abha-number">
                        <span className="abha-text">
                            Don't have ABHA?
                        </span>
                        <a className="link-abha">Create ABHA</a>
                    </div>
                </form>
            </div>
        </div>
    )
}
enum NumberType {
    AADHAR = 'aadhar',
    ABHA = 'abha'
}
interface LinkAbhaFormProps {
    abhaAddress?: string
    abhaNumber?: string
    step: number
    goBack: (step: number) => void
    moveAhead: (step: number) => void
    setData: (data: { txnId: string; inputValue: string; otpFor: string }) => void
    setRadioButtonValues: (v: string) => void
}
export default LinkViaAbhaNumber