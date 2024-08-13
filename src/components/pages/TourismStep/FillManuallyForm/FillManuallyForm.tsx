import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    DefaultAuthenticatedRedirectRoute,
    coreRoutesEnum,
} from '../../../../enums/routingEnums'
import './FillManuallyForm.scss'
import { UpdateYartriDetailsPayloadType } from '../../../../interface/ApiRequestPayoadTypes'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import { updateYatriDetailsApi } from '../../../../services/api'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { loadYatriAllData } from '../../../../services/store/slices/yatriSlice'
import { dateDiffInHours } from '../../../../utils/HelperFunctions'
import { GetUserInfoByIDTP_ApiResponseType } from '../../../../interface/ApiResponseTypes'

interface FillManuallyFormPropTypes {
    userInfoByIDTP?: GetUserInfoByIDTP_ApiResponseType
}

function FillManuallyForm({ userInfoByIDTP }: FillManuallyFormPropTypes) {
    const { t } = useTranslation()
    const phoneNumber =
        useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || ''
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [notEntered, setNotEntered] = useState({
        firstName: false,
        lastName: false,
        gender: false,
        dateOfBirth: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [emailNotValid, setemailNotValid] = useState(false)
    const updateNotEntered = (field: string, value: boolean) => {
        setNotEntered(prevState => ({
            ...prevState,
            [field]: value,
        }))
    }
    const handleChange = (event: {
        target: { value: string; name: string }
    }) => {
        // Assuming you want to set firstName to true when it's not entered
        const value = event.target.value.trim() === ''
        updateNotEntered(event.target.name, value)
    }
    const handleEmailBlur = (event: {
        target: { value: string; name: string }
    }) => {
        const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!regex.test(event.target.value.toLowerCase())) {
            setemailNotValid(true)
        } else {
            setemailNotValid(false)
        }
    }
    const formik = useFormik({
        initialValues: {
            firstName: userInfoByIDTP?.firstName || '',
            lastName: userInfoByIDTP?.lastName || '',
            emailId: userInfoByIDTP?.emailId || '',
            gender: userInfoByIDTP?.gender || '',
            dateOfBirth:
                userInfoByIDTP?.dateOfBirth?.split('/')?.reverse()?.join('-') ||
                '',
            tourStartDate:
                userInfoByIDTP?.tourStartDate
                    ?.split('/')
                    ?.reverse()
                    ?.join('-') || '',
            tourEndDate:
                userInfoByIDTP?.tourEndDate?.split('/')?.reverse()?.join('-') ||
                '',
            tourDuration: userInfoByIDTP?.tourDuration || '',
        },
        onSubmit: values => {
            if (isLoading) {
                return
            }
            const a = new Date(values.tourStartDate)
            const b = new Date(values.tourEndDate)
            const tourDuration = dateDiffInHours(a, b)
            const payload: UpdateYartriDetailsPayloadType = {
                phoneNumber,
                yatriDetails: {
                    ...values,
                    tourDuration,
                    tourStartDate: values.tourStartDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    tourEndDate: values.tourEndDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    dateOfBirth: values.dateOfBirth
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                },
            }
            updateYatriDetailsApi({
                ...payload,
            })
                .then(() => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: 'Yatri details added successfully',
                            severity: 'success',
                        }),
                    )
                    dispatch(loadYatriAllData())
                    navigate(`/${DefaultAuthenticatedRedirectRoute}`)
                })
                .catch(() => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => setIsLoading(false))
        },
    })

    const handleChangeTourDurationUpdate = () => {
        if (formik.values.tourStartDate && formik.values.tourEndDate) {
            const a = new Date(formik.values.tourStartDate)
            const b = new Date(formik.values.tourEndDate)
            const tourDuration = dateDiffInHours(a, b)
            formik.setFieldValue('tourDuration', tourDuration)
        } else {
            formik.setFieldValue('tourDuration', 0)
        }
    }

    return (
        <>
            <form className="fill-manually-form" onSubmit={formik.handleSubmit}>
                <div className="form-fields">
                    <div className="change-style-manually column-data">
                        <TextField
                            type="text"
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            className="textfield-width-update"
                            style={{
                                width: '45%',
                            }}
                            placeholder="Enter your First Name"
                            onBlur={handleChange}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            helperText={
                                notEntered.firstName
                                    ? 'Please enter your First Name'
                                    : ' '
                            }
                            error={notEntered.firstName ? true : false}
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <TextField
                            type="text"
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            className="textfield-width-update"
                            placeholder="Enter your Last Name"
                            onChange={formik.handleChange}
                            helperText={
                                notEntered.lastName
                                    ? 'Please enter your Last Name.'
                                    : ' '
                            }
                            onBlur={handleChange}
                            value={formik.values.lastName}
                            style={{
                                width: '45%',
                            }}
                            error={notEntered.lastName ? true : false}
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </div>
                    <div className="change-style-manually column-data">
                        <TextField
                            type="emailId"
                            label="Email Address"
                            id="emailId"
                            name="emailId"
                            className="textfield-width-update"
                            placeholder="Enter your Email Address"
                            helperText={
                                emailNotValid
                                    ? 'Please enter a valid email.'
                                    : ''
                            }
                            error={emailNotValid}
                            onBlur={handleEmailBlur}
                            onChange={formik.handleChange}
                            value={formik.values.emailId}
                            variant="standard"
                            style={{
                                width: '45%',
                            }}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <FormControl
                            className="radiobutton-width-update"
                            style={{
                                width: '45%',
                            }}
                        >
                            <FormLabel id="demo-row-radio-buttons-group-label">
                                Gender
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={formik.values.gender}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    formik.values.gender = (
                                        event.target as HTMLInputElement
                                    ).value.toString()
                                }}
                            >
                                <FormControlLabel
                                    value="Female"
                                    control={<Radio onChange={handleChange} />}
                                    label="Female"
                                />
                                <FormControlLabel
                                    value="Male"
                                    control={<Radio onChange={handleChange} />}
                                    label="Male"
                                />
                                <FormControlLabel
                                    value="Other"
                                    control={<Radio onChange={handleChange} />}
                                    label="Other"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="change-style-manually column-data">
                        <TextField
                            type="text"
                            label="Date of Birth"
                            id="dateOfBirth"
                            onFocus={(e: any) => (e.target.type = 'date')}
                            name="dateOfBirth"
                            className="textfield-width-update"
                            placeholder="DD/MM/YYYY"
                            helperText={
                                notEntered.dateOfBirth
                                    ? 'Please enter your Date of Birth'
                                    : ' '
                            }
                            onChange={formik.handleChange}
                            value={formik.values.dateOfBirth}
                            error={notEntered.dateOfBirth ? true : false}
                            style={{
                                width: '45%',
                            }}
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <div
                            className="tour-dates-container"
                            style={{
                                width: '45%',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <TextField
                                type="date"
                                label="Tour Start Date"
                                id="tourStartDate"
                                name="tourStartDate"
                                placeholder="DD/MM/YYYY"
                                onChange={formik.handleChange}
                                value={formik.values.tourStartDate}
                                style={{
                                    width: '32%',
                                }}
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <TextField
                                type="date"
                                label="Tour End Date"
                                id="tourEndDate"
                                name="tourEndDate"
                                placeholder="DD/MM/YYYY"
                                style={{
                                    width: '32%',
                                }}
                                onChange={formik.handleChange}
                                value={formik.values.tourEndDate}
                                variant="standard"
                                onBlur={handleChangeTourDurationUpdate}
                                margin="normal"
                                required
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <TextField
                                type="text"
                                label="Total Duration"
                                id="tourDuration"
                                name="tourDuration"
                                placeholder="0"
                                disabled={true}
                                onChange={formik.handleChange}
                                value={`${formik?.values?.tourDuration} days`}
                                style={{
                                    width: '25%',
                                }}
                                variant="standard"
                                onBlur={handleChangeTourDurationUpdate}
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button className="manually-fill-button" type="submit">
                    Continue{' '}
                </button>
                <div className="skip-route">
                    <NavLink className="link-color" to={coreRoutesEnum.LOG_IN}>
                        Skip for Later
                    </NavLink>
                </div>
                <div className="back-route">
                    <NavLink className="link-color" to={coreRoutesEnum.LOG_IN}>
                        Back
                    </NavLink>
                </div>
            </form>
        </>
    )
}

export default FillManuallyForm
