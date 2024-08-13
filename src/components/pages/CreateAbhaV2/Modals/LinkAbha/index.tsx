import React, { useState } from 'react'
import CardBackdrop from '../../../../shared/CardBackdrop/CardBackdrop'
import {
    TextField,
    CircularProgress,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent,
    IconButton,
} from '@mui/material'
import './index.scss'
import LinkViaAbhaNumber from './LinkViaAbhaNumber/LinkViaAbhaNumber'
import LinkAbhaViaAbhaNumberOtp from './LinkViaAbhaNumberOtp/LinkAbhaViaAbhaNumberOtp'
import { linkViaAadhaarNumber, linkViaPhoneNumber } from '../../../../../services/api'
import RecoverAbhaForm from '../RecoverAbhaModal/RecoverAbhaForm'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { isAxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import { convertAadharCardNumber } from '../../../../../utils/HelperFunctions'
import { Visibility, VisibilityOff } from '@mui/icons-material'
function LinkAbha() {
    const [chooseLink, setChooseLink] = useState<string>(ChooseLink.ABHA_NUMBER)
    const [step, setStep] = useState<number>(0)
    const [phoneNumberError, setPhoneNumberError] = useState<string>('')
    const [abhaNumberError, setabhaNumberError] = useState<string>('')
    const [abhaAddressError, setabhaAddressError] = useState<string>('')
    const [aadhaarNumberError, setAadhaarNumberError] = useState<string>('')
    const [openForgetAbhaModal, setOpenForgetAbhaModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [linkWith, setLinkWith] = useState<LinkedWith>({
        name: '',
        value: ''
    })
    const [encryptedAadharNumberValue,setEncryptedAadharNumberValue]=useState<string>('')
    const [isAadharNumberHidden, setIsAadharNumberHidden] =
        useState<boolean>(true)
    const toggleAadharNumber = () => setIsAadharNumberHidden(!isAadharNumberHidden)
    const [otpFormData, setOtpFormData] = useState<OtpFormData>({
        txnId: '',
        inputValue: '',
        otpFor: '',
        isMobile: false
    })

    const [radioButtonValues, setRadioButtonValues] = useState<string>(NumberType.AADHAR)

    const identityType = [
        {
            key: 'Phone Number',
            value: ChooseLink.PHONE_NUMBER,
        },
        {
            key: 'Aadhaar Number',
            value: ChooseLink.AADHAAR_NUMBER,
        },
        {
            key: 'ABHA Number',
            value: ChooseLink.ABHA_NUMBER,
        },
        {
            key: 'ABHA Address',
            value: ChooseLink.ABHA_ADDRESS,
        },
    ]

    const dispatch = useDispatch()
    function handleChange(event: SelectChangeEvent<string>) {
        setChooseLink(event.target.value)
        setLinkWith({ name: event.target.value, value: '' })
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setLinkWith({ name, value })
        if (name === ChooseLink.PHONE_NUMBER) {
            if (value.length !== 10 || !/^[6-9]/.test(value)) {
                setPhoneNumberError('Please enter a valid Phone number')
            } else {
                setPhoneNumberError('')
            }
        } else if (name === ChooseLink.ABHA_NUMBER) {
            if (value.length !== 17) {
                setabhaNumberError('Please enter a valid ABHA number')
            } else if (!/^\d{2}-\d{4}-\d{4}-\d{4}$/.test(value)) {
                setabhaNumberError(
                    'Please follow this format: XX-XXXX-XXXX-XXXX',
                )
            } else {
                setabhaNumberError('')
            }
        } else if (name === ChooseLink.AADHAAR_NUMBER) {
            if (value.length !== 12) {
                setAadhaarNumberError('Please enter a valid Aadhaar number')
            } else {
                setAadhaarNumberError('')
            }
        } else {
            if (value.length < 13) {
                setabhaAddressError('Please enter a valid ABHA address')
                // } else if (
                //     !/^[0-9a-zA-Z@]+$/.test(value) ||
                //     !/^(?![._@])[0-9a-zA-Z@]{13,23}$/.test(value) ||
                //     !/^[0-9a-zA-Z@]*[._]?[0-9a-zA-Z@]*[._]?[0-9a-zA-Z@]*$/.test(value)
                // ) {
                //     setabhaAddressError('Please enter a valid ABHA address')
            } else {
                setabhaAddressError('')
            }
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        if (name === ChooseLink.PHONE_NUMBER) {
            const onlyNumbers = value.replace(/[^0-9]/g, '')
            const validNumber =
                onlyNumbers.length === 0 || /^[6-9]/.test(onlyNumbers)
                    ? onlyNumbers.slice(0, 10)
                    : ''
            setLinkWith({ name: name, value: validNumber })
        } else if (name === ChooseLink.ABHA_NUMBER) {
            const validNumber = value.length !== 0 ? value.slice(0, 17) : ''
            setLinkWith({ name: name, value: validNumber })
        } else if (name === ChooseLink.AADHAAR_NUMBER) {
            const onlyNumbers = value.replace(/[^0-9]/g, '')
            const validNumber =
                onlyNumbers.length === 0 || /^[2-9]/.test(onlyNumbers)
                    ? onlyNumbers.slice(0, 12)
                    : ''
            setLinkWith({ name: name, value: validNumber })
        } else {
            const validAddress = value.length !== 0 ? value.slice(0, 23) : ''
            setLinkWith({ name: name, value: validAddress })
        }
    }
    const comeBack = (step: number) => {
        setStep(step)
    }
    const moveAhead = (step: number) => {
        setStep(step)
    }
    const continueAbha = () => {
        if (!linkWith.value) {
            if (chooseLink === ChooseLink.ABHA_NUMBER) {
                setabhaNumberError('Please enter a valid ABHA number')
            } else if (chooseLink === ChooseLink.ABHA_ADDRESS) {
                setabhaAddressError('Please enter a valid ABHA address')
            } else if (chooseLink === ChooseLink.AADHAAR_NUMBER) {
                setAadhaarNumberError('Please enter a valid Aadhaar number')
            } else {
                setPhoneNumberError('Please enter a valid Phone number')
            }
            return
        }

        if (chooseLink === ChooseLink.ABHA_NUMBER && abhaNumberError) {
            return
        } else if (chooseLink === ChooseLink.ABHA_ADDRESS && abhaAddressError) {
            return
        } else if (chooseLink === ChooseLink.PHONE_NUMBER && phoneNumberError) {
            return
        } else if (chooseLink === ChooseLink.AADHAAR_NUMBER && aadhaarNumberError) {
            return
        }

        if (isLoading) {
            return
        }
        if (linkWith.name === ChooseLink.PHONE_NUMBER) {
            setIsLoading(true)
            linkViaPhoneNumber({
                mobile: linkWith.value,
            }).then((res) => {
                setOtpFormData({
                    txnId: res.data.txnId,
                    inputValue: linkWith.value,
                    otpFor: '',
                    isMobile: true,
                })
                setStep(1)
            })
                .catch(err => {
                    let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.errorDetails) {
                        try {
                            const errorDetails = JSON.parse(
                                err.response?.data?.errorDetails,
                            )
                            message = errorDetails.error.message
                        } catch (err) { console.log('') }
                    } else if (
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
                .finally(() => setIsLoading(false))
        } else if (linkWith.name === ChooseLink.AADHAAR_NUMBER) {
            setIsLoading(true)
            const encryptedAadharNumber = convertAadharCardNumber(
                linkWith.value,
            ).toString()
            setEncryptedAadharNumberValue(encryptedAadharNumber)
            linkViaAadhaarNumber({
                aadhaar: encryptedAadharNumber,
            }).then((res) => {
                setOtpFormData({
                    txnId: res.data.txnId,
                    inputValue: res.data.message.split(' ')[res.data.message.split(' ').length-1],
                    otpFor: '',
                    isMobile: false,
                })
                setStep(1)
            })
                .catch(err => {
                    let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.errorDetails) {
                        try {
                            const errorDetails = JSON.parse(
                                err.response?.data?.errorDetails,
                            )
                            message = errorDetails.error.message
                        } catch (err) { console.log('') }
                    } else if (
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
                .finally(() => setIsLoading(false))
        } else if (
            linkWith.name === ChooseLink.ABHA_ADDRESS ||
            linkWith.name === ChooseLink.ABHA_NUMBER
        ) {
            setStep(1)
        }
    }
    const setOtpFormComponentData = (data: OtpFormData) => {
        setOtpFormData(data)
    }
    return (
        <CardBackdrop
            isOpenedByNavigation
            showClose={step === 0 ? true : false}
        >
            {step === 0 ? (
                <div className="abha-id-form-container">
                    <div className="aadhaar-head">Link Your ABHA</div>
                    <div className="aadhaar-body">
                        <div className="aadhaar-description">
                            Link your ABHA using your linked Phone Number, ABHA
                            Number, ABHA Address or Aadhaar Number for easy
                            access.
                        </div>
                        <div className="form-container">
                            <FormControl className="identity-dropdown">
                                <InputLabel
                                    id="identityTypeLabel"
                                    htmlFor="identityType"
                                    shrink={true}
                                    variant="standard"
                                >
                                    Link ABHA{' '}
                                    <span style={{ color: '#d32f2f' }}>*</span>
                                </InputLabel>
                                <Select
                                    label="Select an Identity Type"
                                    id="identityType"
                                    name="identityType"
                                    onChange={handleChange}
                                    value={chooseLink}
                                    variant="standard"
                                    required
                                    fullWidth
                                    displayEmpty
                                >
                                    {identityType.map(option => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.key}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText sx={{ color: '#d32f2f;' }}>
                                </FormHelperText>
                            </FormControl>
                            {chooseLink === ChooseLink.PHONE_NUMBER ? (
                                <form autoComplete="off">
                                    <TextField
                                        type="text"
                                        className="phonenumber-field"
                                        label="Phone Number"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        error={!!phoneNumberError}
                                        helperText={phoneNumberError}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        value={linkWith.value}
                                        placeholder="Enter your Phone Number"
                                        variant="standard"
                                        required
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    +91
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ maxWidth: '50%' }}
                                    />
                                </form>
                            ) : chooseLink === ChooseLink.ABHA_NUMBER ? (
                                <form autoComplete="off">
                                    <TextField
                                        type="text"
                                        className="abha-number-field"
                                        label="ABHA Number"
                                        id="abhaNumber"
                                        name="abhaNumber"
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        value={linkWith.value}
                                        error={!!abhaNumberError}
                                        helperText={abhaNumberError}
                                        placeholder="XX-XXXX-XXXX-XXXX"
                                        variant="standard"
                                        required
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ maxWidth: '50%' }}
                                    />
                                    <div className="forgot-abha-number">
                                        <span
                                            className="abha-text"
                                            onClick={() =>
                                                setOpenForgetAbhaModal(true)
                                            }
                                        >
                                            Forgot ABHA?
                                        </span>
                                        {openForgetAbhaModal && (
                                            <CardBackdrop
                                                setClose={() =>
                                                    setOpenForgetAbhaModal(
                                                        false,
                                                    )
                                                }
                                            >
                                                <RecoverAbhaForm />
                                            </CardBackdrop>
                                        )}
                                    </div>
                                </form>
                            ) : chooseLink === ChooseLink.ABHA_ADDRESS ? (
                                <form autoComplete="off">
                                    <TextField
                                        type="text"
                                        className="abha-address-field"
                                        label="ABHA Address"
                                        id="abhaAddress"
                                        name="abhaAddress"
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        value={linkWith.value}
                                        error={!!abhaAddressError}
                                        helperText={abhaAddressError}
                                        placeholder="Enter your ABHA Address"
                                        variant="standard"
                                        required
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ maxWidth: '50%' }}
                                    />
                                </form>
                            ) : chooseLink === ChooseLink.AADHAAR_NUMBER ? (
                                <form autoComplete="off">
                                    <TextField
                                        type={!isAadharNumberHidden ? 'text' : 'password'}
                                        className="aadhaar-number-field"
                                        label="Aadhaar Number"
                                        id="aadhaarNumber"
                                        name="aadhaarNumber"
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        value={linkWith.value}
                                        error={!!aadhaarNumberError}
                                        helperText={aadhaarNumberError}
                                        placeholder="Enter your Aadhaar Number"
                                        variant="standard"
                                        required
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{ maxWidth: '50%' }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={toggleAadharNumber}
                                                    >
                                                        {isAadharNumberHidden ? (
                                                            <VisibilityOff fontSize="small"  />
                                                        ) : (
                                                            <Visibility fontSize="small"  />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </form>
                            ) : (
                                <></>
                            )}
                        </div>
                        <button
                            className="get-otp-button"
                            onClick={continueAbha}
                        >
                            Continue &nbsp;
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
                            <NavLink
                                to={`/${coreRoutesEnum.CREATE_ABHA}`}
                                className="link-abha"
                            >
                                Create ABHA
                            </NavLink>
                        </div>
                    </div>
                </div>
            ) : step === 1 ? (
                linkWith.name === ChooseLink.ABHA_NUMBER ? (
                    <LinkViaAbhaNumber
                        abhaNumber={linkWith.value}
                        goBack={comeBack}
                        moveAhead={moveAhead}
                        step={step}
                        setData={setOtpFormComponentData}
                        setRadioButtonValues={setRadioButtonValues}
                    />
                ) : linkWith.name === ChooseLink.PHONE_NUMBER ? (
                    <LinkAbhaViaAbhaNumberOtp
                        coming={linkWith.name}
                        abhaNumber={linkWith.value}
                        abhaAddress={linkWith.value}
                        goBack={comeBack}
                        step={step}
                        data={otpFormData}
                        setData={setOtpFormComponentData}
                        radioButtonValues={radioButtonValues}
                    />
                ) : linkWith.name === ChooseLink.AADHAAR_NUMBER ? (
                    <LinkAbhaViaAbhaNumberOtp
                        coming={linkWith.name}
                        abhaNumber={linkWith.value}
                        abhaAddress={linkWith.value}
                        goBack={comeBack}
                        step={step}
                        data={otpFormData}
                        encryptedAadharNumberValue={encryptedAadharNumberValue}
                        setData={setOtpFormComponentData}
                        radioButtonValues={radioButtonValues}
                    />
                ) : linkWith.name === ChooseLink.ABHA_ADDRESS ? (
                    <LinkViaAbhaNumber
                        abhaAddress={linkWith.value}
                        goBack={comeBack}
                        moveAhead={moveAhead}
                        step={step}
                        setData={setOtpFormComponentData}
                        setRadioButtonValues={setRadioButtonValues}
                    />
                ) : (
                    <></>
                )
            ) : (
                <LinkAbhaViaAbhaNumberOtp
                    goBack={comeBack}
                    coming={linkWith.name}
                    abhaNumber={linkWith.value}
                    abhaAddress={linkWith.value}
                    step={step}
                    data={otpFormData}
                    setData={setOtpFormComponentData}
                    radioButtonValues={radioButtonValues}
                />
            )}
        </CardBackdrop>
    )
}

enum NumberType {
    AADHAR = 'aadhar',
    ABHA = 'abha',
}

export enum ChooseLink {
    PHONE_NUMBER = 'phoneNumber',
    ABHA_NUMBER = 'abhaNumber',
    ABHA_ADDRESS = 'abhaAddress',
    AADHAAR_NUMBER = 'aadhaarNumber'
}
interface LinkedWith {
    name: string
    value: string
}
export interface OtpFormData {
    txnId: string
    inputValue: string
    otpFor: string
    isMobile?: boolean
}
export default LinkAbha