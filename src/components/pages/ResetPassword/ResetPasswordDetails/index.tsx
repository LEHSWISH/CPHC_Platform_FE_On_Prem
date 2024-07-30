import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FormikHelpers, useFormik } from 'formik'
import { TextField, InputAdornment, Divider, CircularProgress } from '@mui/material'
import UttarakhandGovtLogo from '../../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../../assets/icons/NHM.png'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import './resetPasswordDetails.style.scss'
import Footer from '../../../shared/Footer/Footer'

export interface ResetPasswordDetailsValueType {
    userName: string
    phoneNumber: string
}

interface ResetPasswordDetailsPropType {
    onSubmit: (
        values: ResetPasswordDetailsValueType,
        actions: FormikHelpers<ResetPasswordDetailsValueType>,
    ) => void
    loader: boolean
}

const initialValues: ResetPasswordDetailsValueType = {
    userName: '',
    phoneNumber: '',
}

const ResetPasswordDetails = ({ onSubmit, loader }: ResetPasswordDetailsPropType) => {
    const [phoneNumberFocused, setPhoneNumberFocused] = useState<string>('')
    const [usernameFocused, setUsernameFocused] = useState<string>('')

    const formik = useFormik({
        initialValues,
        onSubmit,
    })

    const handlePhoneNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target
        if (name === 'phoneNumber') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '')
            // If first digit not from 6-9, give empty string, else allow up to 12 digits
            const validNumber =
                onlyNumbers.length === 0 || /^[6-9]/.test(onlyNumbers)
                    ? onlyNumbers.slice(0, 10)
                    : ''
            formik.setFieldValue(name, validNumber)
        } else {
            formik.handleChange(event)
        }
    }

    const handlePhoneNumberBlur = (
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const phoneNumber = event.target.value
        if (phoneNumber === '') {
            setPhoneNumberFocused('Please enter your phone number')
        } else if (phoneNumber.length !== 10) {
            setPhoneNumberFocused('Please enter a valid phone number')
        } else {
            setPhoneNumberFocused('')
        }
    }

    const handleUsernameNumberBlur = (
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const username = event.target.value
        if (username === '') {
            setUsernameFocused('Please enter your username')
        } else {
            setUsernameFocused('')
        }
    }

    return (
        <div className="reset-password-details-container">
            <div className="reset-password-details-description">
                <div className="page-logo">
                    <img
                        src={UttarakhandGovtLogo}
                        alt="Uttrakhand Simply Heaven!"
                    />
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <img src={NhmLogo} alt="Uttrakhand Simply Heaven!" />
                </div>
                <h2>Reset Password</h2>
                <p>
                    Please enter your username and phone number. We will then
                    send an OTP to reset your password.
                </p>
            </div>
            <form
                className="reset-password-details-form"
                onSubmit={formik.handleSubmit}
                autoComplete='off'
            >
                <div className="form-fields">
                    <TextField
                        type="text"
                        label="Username"
                        id="usernNme"
                        name="userName"
                        placeholder="Enter your username"
                        onChange={formik.handleChange}
                        onBlur={handleUsernameNumberBlur}
                        value={formik.values.userName}
                        helperText={usernameFocused}
                        error={!!usernameFocused}
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        type="tel"
                        label="Phone Number"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        onChange={handlePhoneNumberChange}
                        onBlur={handlePhoneNumberBlur}
                        value={formik.values.phoneNumber}
                        helperText={phoneNumberFocused}
                        error={!!phoneNumberFocused}
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    +91
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <button className="otp-send-button" type="submit">
                    Send OTP &nbsp;
                    {loader && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
                <div className="login-route">
                    <NavLink to={`/${coreRoutesEnum.LOG_IN}`}>Back to Log in</NavLink>
                </div>
            </form>
            <Footer variant="typeTwo" />
        </div>
    )
}

export default ResetPasswordDetails
