import { CircularProgress, TextField } from '@mui/material'
import { useFormik } from 'formik'
import './PersonalDetails.styles.scss'
import { UpdateYartriDetailsPayloadType } from '../../../../../interface/ApiRequestPayoadTypes'
import { updateYatriDetailsApi } from '../../../../../services/api'
import { loadYatriAllData } from '../../../../../services/store/slices/yatriSlice'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { DefaultAuthenticatedRedirectRoute } from '../../../../../enums/routingEnums'
import { t } from 'i18next'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../../utils/hooks/useAppSelector'
import { useState } from 'react'
import * as Yup from 'yup';

function PersonalDetails() {
    const phoneNumber =
        useAppSelector(s => s.yatri.yatriAllDetails.data?.phoneNumber) || ''
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Please enter your Full Name'),
        dateOfBirth: Yup.date()
            .required('Please enter Date of Birth')
            .max(today, 'Date of Birth cannot be today or in the future.'),
        tourStartDate: Yup.date()
            .required('Please enter Tour Start Date')
            .min(new Date('2024-03-31'), 'Tour start Date should be from 1st April 2024.'),
    });

    const formik = useFormik({
        initialValues: {
            fullName: '',
            dateOfBirth: '',
            tourStartDate: '',
        },
        onSubmit: values => {
            if(isLoading) {
                return
            }

            const payload: UpdateYartriDetailsPayloadType = {
                yatriDetails: {
                    ...values,
                    tourStartDate: values.tourStartDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    dateOfBirth: values.dateOfBirth
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                },
                phoneNumber: phoneNumber,
            }

            setIsLoading(true)
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
                    navigate(`/${DefaultAuthenticatedRedirectRoute}`)
                })
                .finally(() => setIsLoading(false))
        },
        validateOnBlur: true,
        validationSchema,
    })

    return (
        <>
            <div className="personal-details-container">
                <h2 className="personal-details-title">Yatri details</h2>
                <p className="personal-details-description">
                    Please fill out the details to complete your registration
                    process
                </p>
                <form
                    action=""
                    onSubmit={formik.handleSubmit}
                    className="personal-details-form"
                    autoComplete='off'
                >
                    <div className="form-fields">
                        <TextField
                            type="text"
                            label="Full Name"
                            id="fullName"
                            name="fullName"
                            placeholder="E.g. John Doe"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.fullName && formik.errors.fullName}
                            error={!!(formik.touched.fullName && formik.errors.fullName)}
                            style={{
                                margin: '.8rem 0',
                            }}
                            value={formik.values.fullName}
                            variant="standard"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <TextField
                            type="date"
                            label="Date of Birth"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            placeholder="DD/MM/YYYY"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dateOfBirth}
                            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                            error={!!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                max: today.toISOString().slice(0, 10),
                            }}
                        />
                        <TextField
                            type="date"
                            label="Tour Start Date"
                            id="tourStartDate"
                            name="tourStartDate"
                            placeholder="DD/MM/YYYY"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.touched.tourStartDate && formik.errors.tourStartDate}
                            error={!!(formik.touched.tourStartDate && formik.errors.tourStartDate)}
                            value={formik.values.tourStartDate}
                            variant="standard"
                            margin="normal"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                min: ('2024-04-01')
                            }}
                        />
                    </div>
                    <button className="submit-button" type="submit">
                        Save &nbsp;
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
        </>
    )
}

export default PersonalDetails
