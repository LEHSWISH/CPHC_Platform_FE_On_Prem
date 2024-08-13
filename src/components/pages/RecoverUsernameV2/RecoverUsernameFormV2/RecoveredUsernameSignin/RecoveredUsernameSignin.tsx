import './RecoveredUsernameSignin.styles.scss'

import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import {
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../enums/routingEnums'
import Footer from '../../../../shared/Footer/Footer'
import { useState } from 'react'
import * as Yup from 'yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'

function RecoveredUsernameSignin() {
    const [isLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const validationSchema = Yup.object({
        password: Yup.string().required('Please enter your password'),
    })

    const formik = useFormik({
        initialValues: {
            password: '',
        },
        onSubmit: () => {},
        validateOnBlur: true,
        validationSchema,
    })

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }

    return (
        <div className="recovered-signin-container">
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
            <form className="recover-form" onSubmit={formik.handleSubmit}>
                <div className="recover-description">
                    <p>Enter your password</p>
                    <div className='username-display'>
                        <div className="username-detail">
                            Username - <span>johndoe0783</span>
                        </div>
                        <a href="#" className="change-link">Change</a>
                    </div>
                </div>
                <div className="form-fields">
                    <div className="password-container">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            id="password"
                            name="password"
                            placeholder="Create Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.errors.password}
                            error={!!formik.errors.password}
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
                        <NavLink
                            className="nav-forgot-password"
                            to={`/${coreRoutesEnum.RESET_PASSWORD}`}
                        >
                            Forgot Password?
                        </NavLink>
                    </div>
                </div>
                <button
                    className="login-button"
                    type="submit"
                    disabled={isLoading}
                >
                    Login &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
            </form>
            <Footer />
        </div>
    )
}

export default RecoveredUsernameSignin
