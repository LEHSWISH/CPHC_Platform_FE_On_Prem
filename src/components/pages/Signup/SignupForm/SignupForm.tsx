import './SignupForm.scss'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import {
    TextField,
    Checkbox,
    InputAdornment,
    IconButton,
    FormHelperText,
    Divider,
    CircularProgress,
} from '@mui/material'
import UttarakhandGovtLogo from '../../../../assets/icons/Uttarakhand gov.svg'
import NhmLogo from '../../../../assets/icons/NHM.png'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { validateUsername } from '../../../../utils/constants/validations'
import { validatePassword } from '../../../../utils/constants/validations'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import { TemplateKeyEnum } from '../../../../enums/AuthTemplateKeyEnum'
import {
    requestOtpApi,
    verifyPhoneNumberOnSignUp,
    verifyUserName,
} from '../../../../services/api'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { isAxiosError } from 'axios'
import Footer from '../../../shared/Footer/Footer'
import useAddToHomeScreenPrompt from '../../../../utils/hooks/useAddToHomeScreenPrompt'

// eslint-disable-next-line @typescript-eslint/ban-types
function SignupForm(props: SignUpFormProps) {
    useAddToHomeScreenPrompt()
    const dispatch = useAppDispatch()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [usernameFocused, setUsernameFocused] = useState<boolean>(false)
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false)
    const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false)
    const [notChecked, setNotChecked] = useState<boolean>(false)
    const [userNameExist, setUserNameExist] = useState<boolean>(false)
    const [phoneNumberFocused, setphoneNumberFocused] = useState<string>('')
    const [userNameErrorMessage, setuserNameErrorMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [usernameValidation, setUsernameValidation] = useState({
        length: false,
        alphabet: false,
        number: false,
        noSpace: false,
        noSpecialChar: false,
    })

    useEffect(() => {
        setUsernameValidation(validateUsername(props.populate.userName))
    }, [props.populate.userName])

    useEffect(() => {
        setPasswordValidation(validatePassword(props.populate.password))
    }, [props.populate.password])

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false,
    })

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handlePasswordBlur = () => {
        setPasswordFocused(true)
    }

    const handlePhoneNumberBlur = (
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const phoneNumber = event.target.value
        if (phoneNumber === '') {
            setphoneNumberFocused('Please enter your phone number.')
        } else if (phoneNumber.length !== 10) {
            setphoneNumberFocused('Please enter a valid phone number.')
        } else {
            verifyPhoneNumberOnSignUp(phoneNumber)
                .then(response => {
                    if (response.data?.linkedWith > 5) {
                        setphoneNumberFocused(
                            'You cannot link same phone number with more than 6 users. Please try again with a different phone number',
                        )
                    } else {
                        setphoneNumberFocused('')
                    }
                })
                .catch(() => {
                    //
                })
        }
    }

    const handleUsernameBlur = (
        element: React.FocusEvent<HTMLInputElement>,
    ) => {
        setUsernameFocused(true)
        if (formik.values.userName === '') {
            setUserNameExist(true)
            setuserNameErrorMessage('Please create an username.')
            return
        }
        if (Object.values(usernameValidation).includes(false)) {
            return
        }
        verifyUserName({
            userName: element.target.value,
        })
            .then(() => {
                setUserNameExist(false)
                setuserNameErrorMessage('')
            })
            .catch(err => {
                if (isAxiosError(err)) {
                    setUserNameExist(true)
                    setuserNameErrorMessage(err?.response?.data?.message)
                }
            })
    }

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        // const userName = event.target.value
        const { name, value } = event.target
        if (name === 'userName') {
            // Removes only the provided special characters
            const noSpecialChar = value.replace(/[+\-=`~ ]/g, '')

            // Removes all special characters
            // const noSpecialChar = value.replace(/[^a-zA-Z0-9]/g, '')
            formik.setFieldValue(name, noSpecialChar)
            setUsernameValidation(validateUsername(noSpecialChar))
        } else {
            formik.handleChange(event)
            setUsernameValidation(validateUsername(name))
        }
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const password = event.target.value
        formik.handleChange(event)
        setPasswordValidation(validatePassword(password))
    }

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        if (name === 'phoneNumber') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '')

            // If first digit not from 6-9, ignore, else allow up to 10 digits
            const validNumber =
                onlyNumbers.length === 0 || /^[6-9]/.test(onlyNumbers)
                    ? onlyNumbers.slice(0, 10)
                    : ''
            formik.setFieldValue(name, validNumber)
        } else {
            formik.handleChange(event)
        }
    }

    const handleChecboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            setNotChecked(false)
        } else {
            setNotChecked(true)
        }
        formik.handleChange(event)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }
    const formik = useFormik({
        initialValues: {
            userName: props.populate.userName ? props.populate.userName : '',
            phoneNumber: props.populate.phoneNumber
                ? props.populate.phoneNumber
                : '',
            password: props.populate?.password ? props.populate.password : '',
            termsAccepted: props.populate.termsAccepted
                ? props.populate.termsAccepted
                : false,
        },
        onSubmit: async values => {
            if (!userNameExist) {
                if (
                    isLoading ||
                    Object.values(passwordValidation).includes(false)
                ) {
                    return
                }
                if (Object.values(usernameValidation).includes(false)) {
                    return
                }
                if (values.password === '') {
                    setPasswordEmpty(true)
                    return
                }
                if (!values.termsAccepted) {
                    setNotChecked(true)
                    return
                }
                if (phoneNumberFocused.length) {
                    return
                }
                if (
                    values.phoneNumber === '' ||
                    values.phoneNumber.length !== 10
                ) {
                    return
                }

                setIsLoading(true)
                const payload = {
                    ...values,
                }

                requestOtpApi({
                    userName: values.userName,
                    phoneNumber: values.phoneNumber,
                    templateKey: TemplateKeyEnum.SIGN_UP,
                })
                    .then(() => {
                        props.sendSignupData(payload, true)
                    })
                    .catch((err: any) => {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: err?.data?.message,
                                severity: 'error',
                            }),
                        )
                    })
                    .finally(() => setIsLoading(false))
            }
        },
    })
    return (
        <div className="signup-container">
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
            <form
                className="signup-form"
                onSubmit={formik.handleSubmit}
                autoComplete="off"
            >
                <div className="signup-description">
                    <h2>eSwasthya Dham</h2>
                    <p>Registration is free for pilgrims.</p>
                </div>
                <div className="form-fields">
                    <div className="username-container">
                        <TextField
                            type="text"
                            label="Create Username"
                            id="userName"
                            name="userName"
                            placeholder="E.g. johndoe0783"
                            onChange={handleUsernameChange}
                            onBlur={handleUsernameBlur}
                            value={formik.values.userName}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {userNameExist ? (
                            <FormHelperText
                                children={userNameErrorMessage}
                                error={true}
                            ></FormHelperText>
                        ) : (
                            <></>
                        )}
                        {usernameFocused || formik.values.userName ? (
                            <div className="checks-desc">
                                <div
                                    style={{
                                        color: usernameValidation.length
                                            ? 'rgba(51, 125, 56, 1)'
                                            : 'rgba(199, 65, 58, 1)',
                                    }}
                                >
                                    {usernameValidation.length ? '✔' : '✖'}{' '}
                                    <span>&nbsp;&nbsp;</span>Must be of 5-20
                                    characters
                                </div>
                                <div
                                    style={{
                                        color:
                                            usernameValidation.alphabet &&
                                            usernameValidation.number
                                                ? 'rgba(51, 125, 56, 1)'
                                                : 'rgba(199, 65, 58, 1)',
                                    }}
                                >
                                    {usernameValidation.alphabet &&
                                    usernameValidation.number
                                        ? '✔'
                                        : '✖'}{' '}
                                    <span>&nbsp;&nbsp;</span>Must contain an
                                    alphabet and a number
                                </div>
                                <div
                                    style={{
                                        color:
                                            usernameValidation.noSpace &&
                                            usernameValidation.noSpecialChar
                                                ? 'rgba(51, 125, 56, 1)'
                                                : 'rgba(199, 65, 58, 1)',
                                    }}
                                >
                                    {usernameValidation.noSpace &&
                                    usernameValidation.noSpecialChar
                                        ? '✔'
                                        : '✖'}{' '}
                                    <span>&nbsp;&nbsp;</span>Must not contain
                                    any special character and space
                                </div>
                            </div>
                        ) : (
                            <div className="checks-desc">
                                <div>
                                    <span>● &nbsp;</span> Must be of 5-20
                                    characters
                                </div>
                                <div>
                                    <span>● &nbsp;</span> Must contain an
                                    alphabet and a number
                                </div>
                                <div>
                                    <span>● &nbsp;</span> Must not contain any
                                    special character and space
                                </div>
                            </div>
                        )}
                    </div>
                    <TextField
                        type="tel"
                        label="Phone Number"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter your phone number"
                        onChange={handleNumberChange}
                        onBlur={handlePhoneNumberBlur}
                        value={formik.values.phoneNumber}
                        helperText={phoneNumberFocused}
                        error={!!phoneNumberFocused}
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
                    />
                    <div className="password-container">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="Create Password"
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            value={formik.values.password}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {passwordFocused || formik.values.password ? (
                            <div className="checks-desc">
                                <div
                                    style={{
                                        color:
                                            passwordValidation.length ||
                                            passwordEmpty
                                                ? 'rgba(51, 125, 56, 1)'
                                                : 'rgba(199, 65, 58, 1)',
                                    }}
                                >
                                    {passwordValidation.length ? '✔' : '✖'}{' '}
                                    <span>&nbsp;&nbsp;</span>Must be at least 8
                                    characters
                                </div>
                                <div
                                    style={{
                                        color:
                                            (passwordValidation.upperCase &&
                                                passwordValidation.lowerCase) ||
                                            passwordEmpty
                                                ? 'rgba(51, 125, 56, 1)'
                                                : 'rgba(199, 65, 58, 1)',
                                    }}
                                >
                                    {passwordValidation.upperCase &&
                                    passwordValidation.lowerCase
                                        ? '✔'
                                        : '✖'}{' '}
                                    <span>&nbsp;&nbsp;</span>Must contain an
                                    uppercase letter and a lowercase letter
                                    (A-z)
                                </div>
                                <div
                                    style={{
                                        color:
                                            (passwordValidation.number &&
                                                passwordValidation.specialChar) ||
                                            passwordEmpty
                                                ? 'rgba(51, 125, 56, 1)'
                                                : 'rgba(199, 65, 58, 1)',
                                    }}
                                >
                                    {passwordValidation.number &&
                                    passwordValidation.specialChar
                                        ? '✔'
                                        : '✖'}{' '}
                                    <span>&nbsp;&nbsp;</span>Must contain a
                                    number and a special character
                                </div>
                            </div>
                        ) : (
                            <div className="checks-desc">
                                <div>
                                    <span>● &nbsp;</span> Must be at least 8
                                    characters
                                </div>
                                <div>
                                    <span>● &nbsp;</span> Must contain an
                                    uppercase letter and a lowercase letter
                                    (A-z)
                                </div>
                                <div>
                                    <span>● &nbsp;</span> Must contain a number
                                    and a special character
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="terms-policy">
                        <Checkbox
                            name="termsAccepted"
                            className="terms-checkbox"
                            checked={formik.values.termsAccepted as boolean}
                            onChange={handleChecboxChange}
                            sx={{
                                '&.Mui-checked': {
                                    color: '#331895',
                                },
                            }}
                        />
                        <p>
                            I agree to the&nbsp;
                            <a
                                href={'../../../../../Terms-and-conditions.htm'}
                                target="_blank"
                            >
                                Terms & conditions
                            </a>
                            &nbsp;and&nbsp;
                            <a
                                href={'../../../../../Yatri-Pulse-Privacy-Policy.html'}
                                target="_blank"
                            >
                                Privacy policy
                            </a>
                        </p>
                    </div>
                    {notChecked ? (
                        <FormHelperText
                            children="Please agree to policies to proceed."
                            error={true}
                        ></FormHelperText>
                    ) : (
                        <></>
                    )}
                </div>
                <button className="signup-button" type="submit">
                    Continue &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
                <div className="login-route">
                    <p>Already have an account?</p>
                    <NavLink
                        className="navigate"
                        to={`/${coreRoutesEnum.LOG_IN}`}
                    >
                        Log in
                    </NavLink>
                </div>
            </form>
            <div className="advisory">
                Learn about your &nbsp;
                <a
                    href={'../../../../../Iconic-Advisory.pdf'}
                    target="_blank"
                    className="advisory-link"
                >
                    Yatra Do’s and Dont’s
                </a>
            </div>
            <Footer variant="typeTwo" />
        </div>
    )
}
interface SignUpFormProps {
    // eslint-disable-next-line @typescript-eslint/ban-types
    sendSignupData: Function
    populate: {
        userName: string
        phoneNumber: string
        password: string
        termsAccepted: boolean
    }
}
export default SignupForm
