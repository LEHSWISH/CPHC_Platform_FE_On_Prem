import { useFormik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DefaultAuthenticatedRedirectRoute } from '../../../../../enums/routingEnums'
import { UpdateYartriDetailsPayloadType } from '../../../../../interface/ApiRequestPayoadTypes'
import { GetUserInfoByIDTP_ApiResponseType } from '../../../../../interface/ApiResponseTypes'
import { updateYatriDetailsApi } from '../../../../../services/api'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { loadYatriAllData } from '../../../../../services/store/slices/yatriSlice'
import { dateDiffInHours } from '../../../../../utils/HelperFunctions'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import { useAppSelector } from '../../../../../utils/hooks/useAppSelector'
import './FillYatriDetailsV2.scss'
import {
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,
} from '@mui/material'

interface FillManuallyFormPropTypes {
    userInfoByIDTP?: GetUserInfoByIDTP_ApiResponseType
}

function FillYatriDetailsV2({ userInfoByIDTP }: FillManuallyFormPropTypes) {
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
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
            if (!formik.values.gender) {
                updateNotEntered('gender', true)
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
                .catch(err => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: err?.response?.data?.message,
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
    // const yatriDetails = useAppSelector(
    //     state => state.yatri.yatriAllDetails.data?.yatriDetails,
    // )

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className="yatri-details-container">
                    <div className="yatri-details-title">
                        Your Yatri details
                    </div>
                    <div className="form-fields">
                        <TextField
                            type="text"
                            label="First Name"
                            id="firstName"
                            name="firstName"
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
                            required
                            variant="standard"
                            margin="normal"
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
                            placeholder="Enter your Last Name"
                            onChange={formik.handleChange}
                            helperText={
                                notEntered.lastName
                                    ? 'Please enter your Last Name.'
                                    : ' '
                            }
                            onBlur={handleChange}
                            value={formik.values.lastName}
                            error={notEntered.lastName ? true : false}
                            variant="standard"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                        <TextField
                            type="emailId"
                            label="Email Address"
                            id="emailId"
                            name="emailId"
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
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <FormControl
                            className="radiobutton-width-update"
                            style={{
                                width: '75%',
                            }}
                            required
                        >
                            <FormLabel id="demo-row-radio-buttons-group-label">
                                Gender
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="gender"
                                value={formik.values.gender}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    handleChange(event)
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
                            {notEntered.gender && (
                                <FormHelperText error={true}>
                                    Please enter your Gender
                                </FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            type="date"
                            label="Date of Birth"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            placeholder="DD/MM/YYYY"
                            onFocus={(e: any) => (e.target.type = 'date')}
                            helperText={
                                notEntered.dateOfBirth
                                    ? 'Please enter your Date of Birth'
                                    : ' '
                            }
                            onChange={formik.handleChange}
                            value={formik.values.dateOfBirth}
                            error={notEntered.dateOfBirth ? true : false}
                            required
                            variant="standard"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                inputProps: {
                                    max: new Date().toISOString().split('T')[0],
                                    min: '1900-01-01',
                                },
                            }}
                        />
                        <div
                            style={{
                                width: '100%',
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
                                required
                                variant="standard"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: '2024-04-01',
                                        max: '2024-12-31',
                                    },
                                }}
                            />
                            <TextField
                                type="date"
                                label="Tour End Date"
                                id="tourEndDate"
                                name="tourEndDate"
                                placeholder="DD/MM/YYYY"
                                onChange={formik.handleChange}
                                value={formik.values.tourEndDate}
                                onBlur={handleChangeTourDurationUpdate}
                                required
                                variant="standard"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: formik.values.tourStartDate,
                                        max: '2024-12-31',
                                    },
                                }}
                            />
                            <TextField
                                type="text"
                                label="Tour Duration"
                                id="tourDuration"
                                name="tourDuration"
                                placeholder="0"
                                disabled={true}
                                onChange={formik.handleChange}
                                value={`${formik?.values?.tourDuration} days`}
                                onBlur={handleChangeTourDurationUpdate}
                                variant="standard"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </div>
                    </div>
                    <button className="submit-button" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}

export default FillYatriDetailsV2
