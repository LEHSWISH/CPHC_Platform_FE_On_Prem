import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    styled,
    AccordionProps,
    CircularProgress,
    InputAdornment,
    FormHelperText,
} from '@mui/material'
import './ViewTripDetailsV2.styles.scss'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import NumberVerificationOTPForm from './NumberVerificationOTPForm'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import { useNavigate } from 'react-router-dom'
import BackButtonWithTitle from '../../shared/BackButtonWithTitle'
import { dateDiffInDays } from '../../../utils/HelperFunctions'
import { requestOtpApi, updateYatriDetailsApi } from '../../../services/api'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { isAxiosError } from 'axios'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import { TemplateKeyEnum } from '../../../enums/AuthTemplateKeyEnum'

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
    border: `1px solid rgba(51, 24, 159, 0.1)`,
    borderRadius: '1rem',
    '&:not(:last-child)': {
        marginTop: 15,
    },
    '&::before': {
        display: 'none',
    },
}))

const initialValues: ViewTripDetailsV2DataType = {
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    tourStartDate: '',
    tourEndDate: '',
    tourDuration: '',
}

function ViewTripDetailsV2() {
    const dispatch = useAppDispatch()
    const [toggleForm, setToggleForm] = useState<boolean>(true)
    const [edited, setEdited] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [numberUpdateData, setNumberUpdateData] =
        useState<ViewTripDetailsV2DataType>(initialValues)
    const isDataLoadedFromResponseRef = useRef(false)
    const navigate = useNavigate()
    const yatriDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.yatriDetails,
    )
    const userName = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.userName || '',
    )
    const registeredNumber = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.phoneNumber || '',
    )
    const abhaUserDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.abhaUserDetails,
    )
    const dataLoaded = useAppSelector(
        s => s.yatri.yatriAllDetails.data !== null,
    )
    const tourismUserDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.tourismUserInfo,
    )

    const phoneNumber =
        abhaUserDetails?.phoneNumber ||
        tourismUserDetails?.phoneNumber ||
        yatriDetails?.phoneNumber ||
        registeredNumber ||
        ''

    const emailId = abhaUserDetails?.emailId || yatriDetails?.emailId || ''

    const validationSchema = Yup.object({
        dateOfBirth: Yup.date().required('Please enter your date of birth')
        .min(
            new Date('1899-12-31'),
            'Date of Birth cannot be before 1st January 1900',
        )
        .max(
            new Date(),
            'Date of Birth cannot be in the future'
        ),
        phoneNumber: Yup.string().length(
            10,
            'Please enter a valid phone number',
        ),
        email: Yup.string().email('Please enter a valid email'),
        gender: Yup.string().required('Please select your gender'),
        tourStartDate: Yup.date()
        .required('Please enter your tour start date')
        .min(
            new Date('2024-03-31'),
            'Tour start date should be from 1st April 2024.',
        ),
        tourEndDate: Yup.date()
            .required('Please enter your tour end date')
            .min(
                new Date('2024-03-31'),
                'Tour end date cannot be before 1st April 2024.',
            )
            .max(
                new Date('2024-12-31'),
                'Tour end date cannot be after 31st December 2024'
            )
            .test(
                'isLarger',
                'Tour end date cannot be before tour start date',
                (tourEndDate, testContext) => {
                    if (testContext.parent.tourStartDate > tourEndDate) {
                        return false
                    }
                    return true
                },
            ),
    })

    const formik = useFormik({
        initialValues,
        onSubmit: values => {
            if (values.phoneNumber !== phoneNumber) {
                setNumberUpdateData(values)
                if (isLoading) return
                setIsLoading(true)
                requestOtpApi({
                    userName: userName,
                    phoneNumber: values.phoneNumber,
                    templateKey: TemplateKeyEnum.YATRI_PHONE_NUMBER,
                })
                    .then(() => setToggleForm(false))
                    .catch(err => {
                        let message = 'Something went wrong, Please try again'
                        if (isAxiosError(err) && err.response?.data?.message) {
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
            } else {
                if (isLoading) return
                setIsLoading(true)
                updateYatriDetailsApi({
                    phoneNumber: registeredNumber,
                    yatriDetails: {
                        dateOfBirth: values.dateOfBirth
                            ?.split('-')
                            ?.reverse()
                            ?.join('/'),
                        gender: values.gender,
                        emailId: values.email,
                        tourStartDate: values.tourStartDate
                            ?.split('-')
                            ?.reverse()
                            ?.join('/'),
                        tourEndDate: values.tourEndDate
                            ?.split('-')
                            ?.reverse()
                            ?.join('/'),
                        tourDuration: parseInt(values.tourDuration) || 0,
                    },
                })
                    .then(() => {
                        dispatch(loadYatriAllData())
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: 'Yatri details Updated Successfully',
                                severity: 'success',
                            }),
                        )
                    })
                    .catch(err => {
                        let message = 'Something went wrong, Please try again'
                        if (isAxiosError(err) && err.response?.data?.message) {
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
            }
        },
        validateOnBlur: true,
        validationSchema,
    })

    useEffect(() => {
        if (!isDataLoadedFromResponseRef.current && dataLoaded) {
            isDataLoadedFromResponseRef.current = true
            formik.setValues({
                ...formik.values,
                dateOfBirth:
                    yatriDetails?.dateOfBirth
                        ?.split('/')
                        ?.reverse()
                        ?.join('-') || '',
                gender: yatriDetails?.gender || '',
                phoneNumber: phoneNumber,
                email: emailId,
                tourStartDate:
                    yatriDetails?.tourStartDate
                        ?.split('/')
                        ?.reverse()
                        ?.join('-') || '',
                tourEndDate:
                    yatriDetails?.tourEndDate
                        ?.split('/')
                        ?.reverse()
                        ?.join('-') || '',
                tourDuration: yatriDetails?.tourDuration
                    ? `${yatriDetails?.tourDuration}`
                    : '0',
            })
        }
    }, [
        formik,
        dataLoaded,
        emailId,
        phoneNumber,
        abhaUserDetails?.phoneNumber,
        tourismUserDetails?.phoneNumber,
        yatriDetails?.dateOfBirth,
        yatriDetails?.gender,
        yatriDetails?.emailId,
        yatriDetails?.tourEndDate,
        yatriDetails?.tourStartDate,
        yatriDetails?.tourDuration,
    ])

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
        setEdited(true)
    }

    const handleChangeTourDate = (ev: ChangeEvent<HTMLInputElement>) => {
        setEdited(true)
        formik.handleChange(ev)
        const tourStartDate =
            ev.target.name === 'tourStartDate'
                ? ev.target.value
                : formik.values.tourStartDate
        const tourEndDate =
            ev.target.name === 'tourEndDate'
                ? ev.target.value
                : formik.values.tourEndDate

        if (tourStartDate && tourEndDate) {
            const a = new Date(tourStartDate)
            const b = new Date(tourEndDate)
            const tourDuration = dateDiffInDays(a, b)
            formik.setFieldValue('tourDuration', tourDuration)
        } else {
            formik.setFieldValue('tourDuration', 0)
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEdited(true)
        formik.handleChange(event)
    }

    return (
        <>
            {toggleForm ? (
                <CardBackdrop isOpenedByNavigation>
                    <div className="view-trip-details-container">
                        <div className="heading">
                            <span className="home-button-mobile">
                                <BackButtonWithTitle
                                    onBack={() => {
                                        navigate(
                                            `${coreRoutesEnum.CREATE_ABHA}`,
                                        )
                                    }}
                                    backButtonChildElement={
                                        <span className="backbutton">Back</span>
                                    }
                                />
                            </span>
                            Yatri details
                        </div>
                        <div className="body">
                            <form
                                onSubmit={formik.handleSubmit}
                                autoComplete="off"
                            >
                                <Accordion
                                    className="accordion"
                                    defaultExpanded
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        Personal details
                                    </AccordionSummary>
                                    <AccordionDetails className="accordion-details">
                                        <TextField
                                            disabled
                                            className="field"
                                            type="text"
                                            label="Full Name"
                                            id="fullName"
                                            name="fullName"
                                            value={yatriDetails?.fullName || ''}
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            disabled={!!abhaUserDetails}
                                            className="field"
                                            type="date"
                                            label="Date of Birth"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={formik.values.dateOfBirth}
                                            onChange={handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                !!(
                                                    formik.touched
                                                        .dateOfBirth &&
                                                    formik.errors.dateOfBirth
                                                )
                                            }
                                            helperText={
                                                formik.touched.dateOfBirth &&
                                                formik.errors.dateOfBirth
                                            }
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                max: new Date()
                                                    .toISOString()
                                                    .split('T')[0],
                                                min: '1900-01-01',
                                            }}
                                        />
                                        <RadioGroup
                                            name="gender"
                                            className="field radio-group"
                                            value={formik.values.gender}
                                            onChange={handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <FormLabel>Gender</FormLabel>
                                            <FormControlLabel
                                                value="Female"
                                                control={
                                                    <Radio
                                                        disabled={
                                                            !!(
                                                                abhaUserDetails ||
                                                                tourismUserDetails?.gender
                                                            )
                                                        }
                                                    />
                                                }
                                                label="Female"
                                            />
                                            <FormControlLabel
                                                value="Male"
                                                control={
                                                    <Radio
                                                        disabled={
                                                            !!(
                                                                abhaUserDetails ||
                                                                tourismUserDetails?.gender
                                                            )
                                                        }
                                                    />
                                                }
                                                label="Male"
                                            />
                                            <FormControlLabel
                                                value="Other"
                                                control={
                                                    <Radio
                                                        disabled={
                                                            !!(
                                                                abhaUserDetails ||
                                                                tourismUserDetails?.gender
                                                            )
                                                        }
                                                    />
                                                }
                                                label="Other"
                                            />
                                            {formik.touched.gender &&
                                                formik.errors.gender && (
                                                    <FormHelperText
                                                        sx={{
                                                            color: 'rgba(199, 65, 58, 1)',
                                                        }}
                                                    >
                                                        {formik.errors.gender}
                                                    </FormHelperText>
                                                )}
                                        </RadioGroup>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion
                                    className="accordion"
                                    defaultExpanded
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        ABHA details
                                    </AccordionSummary>
                                    <AccordionDetails className="accordion-details">
                                        <TextField
                                            disabled
                                            className="field"
                                            type="text"
                                            label="ABHA Number"
                                            id="abhaNumber"
                                            name="abhaNumber"
                                            // value={
                                            //     abhaUserDetails?.abhaVerified
                                            //         ? abhaUserDetails?.ABHANumber
                                            //         : ''
                                            // }
                                            value={abhaUserDetails?.ABHANumber}
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            className="field"
                                            type="text"
                                            label="ABHA Address"
                                            id="abhaAddress"
                                            name="abhaAddress"
                                            // value={
                                            //     abhaUserDetails?.abhaVerified
                                            //         ? abhaUserDetails
                                            //               ?.phrAddress[0]
                                            //         : ''
                                            // }
                                            value={abhaUserDetails?.phrAddress[0]}
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion
                                    className="accordion"
                                    defaultExpanded
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        Contact details
                                    </AccordionSummary>
                                    <AccordionDetails className="accordion-details">
                                        <TextField
                                            disabled={
                                                !!(
                                                    abhaUserDetails?.phoneNumber ||
                                                    tourismUserDetails?.phoneNumber
                                                )
                                            }
                                            className="field"
                                            type="tel"
                                            label="Phone Number"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            placeholder="Enter your phone number"
                                            onChange={handlePhoneNumberChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phoneNumber}
                                            helperText={
                                                formik.touched.phoneNumber &&
                                                formik.errors.phoneNumber
                                            }
                                            error={
                                                !!(
                                                    formik.touched
                                                        .phoneNumber &&
                                                    formik.errors.phoneNumber
                                                )
                                            }
                                            variant="standard"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        +91
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            disabled={
                                                !!abhaUserDetails?.emailId
                                            }
                                            className="field"
                                            type="email"
                                            label="Email Address"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            onChange={handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            helperText={
                                                formik.touched.email &&
                                                formik.errors.email
                                            }
                                            error={
                                                !!(
                                                    formik.touched.email &&
                                                    formik.errors.email
                                                )
                                            }
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion
                                    className="accordion"
                                    defaultExpanded
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        Address
                                    </AccordionSummary>
                                    <AccordionDetails className="accordion-details">
                                        <TextField
                                            disabled
                                            className="field address"
                                            type="text"
                                            label="Address"
                                            id="address"
                                            name="address"
                                            value={yatriDetails?.address || ''}
                                            variant="standard"
                                            required
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            className="field pincode"
                                            type="text"
                                            label="Pincode"
                                            id="pincode"
                                            name="pincode"
                                            value={yatriDetails?.pinCode || ''}
                                            variant="standard"
                                            required
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputMode="numeric"
                                        />
                                        <TextField
                                            disabled
                                            className="field"
                                            type="text"
                                            label="District"
                                            id="district"
                                            name="district"
                                            value={yatriDetails?.district || ''}
                                            variant="standard"
                                            required
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            className="field"
                                            type="text"
                                            label="State"
                                            id="state"
                                            name="state"
                                            value={yatriDetails?.state || ''}
                                            variant="standard"
                                            required
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion
                                    defaultExpanded
                                    className="accordion-4 accordion"
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        Tour details
                                    </AccordionSummary>

                                    <AccordionDetails className="accordion-details">
                                        <TextField
                                            disabled={isLoading}
                                            className="field three"
                                            type="date"
                                            label="Tour Start Date"
                                            id="tourStartDate"
                                            name="tourStartDate"
                                            value={formik.values.tourStartDate}
                                            onChange={handleChangeTourDate}
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.touched.tourStartDate &&
                                                formik.errors.tourStartDate
                                            }
                                            error={
                                                !!(
                                                    formik.touched
                                                        .tourStartDate &&
                                                    formik.errors.tourStartDate
                                                )
                                            }
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                min: '2024-04-01', // April 1st, 2024
                                                max: '2024-12-31',
                                            }}
                                        />
                                        <TextField
                                            className="field three"
                                            type="date"
                                            label="Tour End Date"
                                            id="tourEndDate"
                                            name="tourEndDate"
                                            value={formik.values.tourEndDate}
                                            onChange={handleChangeTourDate}
                                            onBlur={formik.handleBlur}
                                            helperText={
                                                formik.touched.tourEndDate &&
                                                formik.errors.tourEndDate
                                            }
                                            error={
                                                !!(
                                                    formik.touched
                                                        .tourEndDate &&
                                                    formik.errors.tourEndDate
                                                )
                                            }
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                min: formik.values
                                                    .tourStartDate,
                                                max: '2024-12-31',
                                            }}
                                        />
                                        <TextField
                                            disabled
                                            className="field three"
                                            type="text"
                                            label="Tour Duration"
                                            id="tourDuration"
                                            name="tourDuration"
                                            value={formik.values.tourDuration}
                                            variant="standard"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <button
                                    className="update-button"
                                    type="submit"
                                    disabled={!edited}
                                >
                                    Update &nbsp;
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
                    </div>
                </CardBackdrop>
            ) : (
                <CardBackdrop isOpenedByNavigation showClose={false}>
                    <NumberVerificationOTPForm
                        formUpdateData={numberUpdateData}
                        navigateBack={setToggleForm}
                    />
                </CardBackdrop>
            )}
        </>
    )
}

export interface ViewTripDetailsV2DataType {
    dateOfBirth: string
    gender: string
    phoneNumber: string
    email: string
    tourStartDate: string
    tourEndDate: string
    tourDuration: string
}

export default ViewTripDetailsV2
