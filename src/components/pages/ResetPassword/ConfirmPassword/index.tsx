import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FormikHelpers, useFormik } from 'formik'
import { CircularProgress, Divider, IconButton, InputAdornment, TextField } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import UttarakhandGovtLogo from '../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../assets/icons/NhmLogo1.svg'
import {
    validateConfirmPassword,
    validatePassword,
} from '../../../../utils/constants/validations'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import './confirmPassword.style.scss'
import HitApi from '../../../../classes/http/HitApi'
import { RequestMethod } from '../../../../enums/RequestMethods'
import { ApiEndpointsEnum } from '../../../../enums/ApiEndPointsEnum'
import { useDispatch } from 'react-redux'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { encryptPassword } from '../../../../utils/HelperFunctions'
import bcrypt from 'bcryptjs'
import Footer from '../../../shared/Footer/Footer'

export interface ConfirmPasswordValueType {
    password: string
    confirmPassword: string
}

interface ConfirmPasswordPropType {
    otpResponse: object
    onSubmit: (
        values: ConfirmPasswordValueType,
        actions: FormikHelpers<ConfirmPasswordValueType>,
    ) => void | Promise<unknown>
}

const initialValues: ConfirmPasswordValueType = {
    password: '',
    confirmPassword: '',
}

const ConfirmPassword = (props: ConfirmPasswordPropType) => {
    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        upperCase: false,
        lowerCase: false,
        number: false,
        specialChar: false,
    })

    const handlePasswordBlur = () => {
        setPasswordFocused(true)
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const password = event.target.value
        formik.handleChange(event)
        setPasswordValidation(validatePassword(password))
    }

    const validate = (values: ConfirmPasswordValueType) => {
        const errors: { [k: string]: string | null } = {}

        if (values.confirmPassword) {
            if (
                !validateConfirmPassword(
                    values.password,
                    values.confirmPassword,
                ).equal
            ) {
                errors.confirmPassword = 'Password must match'
            }
        } else if (formik.getFieldMeta('confirmPassword').touched) {
            errors.confirmPassword = 'This field is required'
        }

        if (values.password) {
            const passwordValidations = validatePassword(values.password)
            Object.values(passwordValidations).forEach((el: boolean) => {
                if (!el) {
                    errors.password = ''
                }
            })
        } else if (formik.getFieldMeta('confirmPassword').touched) {
            errors.password = ''
        }

        return errors
    }

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit: async (value) => {
            if(isLoading) return
            const hashedPassword = bcrypt.hashSync(value.password,import.meta.env.VITE_API_PASSWORD_SALT) // hash created previously created upon sign up
            const timeStamp = new Date().toISOString()
            const password=`${timeStamp}%${hashedPassword}`
            const encryptedPassword=encryptPassword(password)?.toString()
            setIsLoading(true)
            HitApi.hitapi({
                url: ApiEndpointsEnum.FORGET_PASSWORD_POST,
                payload: { ...props.otpResponse, password: encryptedPassword },
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
                    }
                },
                errorFunction: (error: any) => {
                    console.error(error)
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: error?.data?.message,
                            severity: 'error',
                        }),
                    )
                },
                endFunction: () => {
                    setIsLoading(false)
                    navigate(coreRoutesEnum.LOG_IN)
                }
            })
        },
    })

    return (
        <div className="confirm-password-wrapper">
            <div className="page-logo">
                <img
                    src={UttarakhandGovtLogo}
                    alt="Uttrakhand Simply Heaven!"
                />
                <Divider orientation="vertical" variant="middle" flexItem />
                <img src={NhmLogo} alt="Uttrakhand Simply Heaven!" />
            </div>
            <form className="reset-confirm-form" onSubmit={formik.handleSubmit} autoComplete='off'>
                <div className="reset-confirm-description">
                    <h2>Reset Password</h2>
                </div>
                <div className="form-fields">
                    <div className="password-container">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            id="password"
                            name="password"
                            placeholder="Create new Password"
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            value={formik.values.password}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
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
                                        color: passwordValidation.length
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
                                            passwordValidation.upperCase &&
                                            passwordValidation.lowerCase
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
                                            passwordValidation.number &&
                                            passwordValidation.specialChar
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
                    <TextField
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                        variant="standard"
                        required
                        fullWidth
                        error={!!formik.errors.confirmPassword}
                        helperText={formik.errors.confirmPassword}
                        InputLabelProps={{
                            shrink: true
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
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
                <div className="login-route">
                    <NavLink to={`/${coreRoutesEnum.LOG_IN}`}>Back to Log in</NavLink>
                </div>
            </form>
            <Footer variant="typeTwo"/>
        </div>
    )
}

export default ConfirmPassword
