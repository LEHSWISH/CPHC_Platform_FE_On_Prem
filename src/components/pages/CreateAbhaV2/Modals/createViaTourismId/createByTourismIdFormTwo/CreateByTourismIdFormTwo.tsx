import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    styled,
    AccordionProps,
    Checkbox,
    FormHelperText,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './createByTourismIdFormTwo.styles.scss'
import * as yup from 'yup'

import {
    convertAadharCardNumber,
    dateDiffInDays,
} from '../../../../../../utils/HelperFunctions'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import {
    generateAbhaByDemograpicAPI,
    getPostalPinCodeInfoAPI,
    updateYatriDetailsApi,
} from '../../../../../../services/api'
import {
    GenerateAbhaByDemograpicSuccessResponseType,
    GetUserInfoByIDTP_ApiResponseType,
} from '../../../../../../interface/ApiResponseTypes'
import { useAppSelector } from '../../../../../../utils/hooks/useAppSelector'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../../utils/hooks/useAppDispatch'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'
import TermsAndConditions from '../../CreateViaAadhaar/AadhaarIdForm/TermsAndConditions'

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
const validationSchema = (shouldUseAbhaFlow: boolean) =>
    yup.object({
        ...(shouldUseAbhaFlow
            ? {
                  aadhaarNumber: yup
                      .string()
                      .required('Please enter your Aadhaar number'),
              }
            : {}),
        dateOfBirth: yup
            .date()
            .required('Please enter your date of birth')
            .min(
                new Date('1899-12-31'),
                'Date of Birth cannot be before 1st January 1900',
            )
            .max(new Date(), 'Date of Birth cannot be in the future'),
        pincode: yup
            .string()
            .required('Please enter your pincode')
            .length(6, 'Pincode length should be 6 digits'),
        phoneNumber: yup
            .string()
            .required('Please enter your phone number')
            .length(10, 'Phone number length should be 10 digits'),
        email: yup.string().email('Please enter a valid email'),
        address: yup.string().required('Please enter your address'),
        tourStartDate: yup
            .date()
            .required('Please enter your tour start date')
            .min(
                new Date('2024-03-31'),
                'Tour start Date should be from 1st April 2024.',
            ),
        tourEndDate: yup
            .date()
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

export interface CreateByTourismIdFormTwoDataType {
    aadhaarNumber: string
    fullName: string
    dateOfBirth: string
    gender: string
    phoneNumber: string
    email: string
    address: string
    pincode: string
    state: string
    district: string
    tourStartDate: string
    tourEndDate: string
    tourDuration: string
    termsAccepted: boolean
}

const initialValues: CreateByTourismIdFormTwoDataType = {
    aadhaarNumber: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    pincode: '',
    state: '',
    district: '',
    tourStartDate: '',
    tourEndDate: '',
    tourDuration: '',
    termsAccepted: false,
}

function CreateByTourismIdFormTwo({
    afterSubmitSuccess,
    responseDataFormOne,
    shouldUseAbhaFlow,
    onGoBack,
}: CreateByTourismIdFormTwoPropType) {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isPincodeValid, setIsPinCodeValid] = useState(false)
    const [termsModalOpen, setTermsModalOpen] = useState<boolean>(false)
    const isDataLoadedFromResponseRef = useRef(false)
    const yatriDetails = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.yatriDetails,
    )
    const phoneNumber = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.phoneNumber || '',
    )

    const formik = useFormik({
        initialValues,
        onSubmit: values => {
            if (isLoading) return
            setIsLoading(true)
            updateYatriDetailsApi({
                phoneNumber,
                yatriDetails: {
                    fullName: values.fullName,
                    dateOfBirth: values.dateOfBirth
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    emailId: values.email,
                    gender: values.gender,
                    tourStartDate: values.tourStartDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    tourEndDate: values.tourEndDate
                        ?.split('-')
                        ?.reverse()
                        ?.join('/'),
                    tourDuration: parseInt(values.tourDuration) || 0,
                    address: values.address,
                    pinCode: values.pincode,
                    state: values.state,
                    district: values.district,
                },
            })
                .then(async () => {
                    if (shouldUseAbhaFlow) {
                        const encryptedAadharCardNumber =
                            convertAadharCardNumber(
                                values.aadhaarNumber,
                            ).toString()
                        return generateAbhaByDemograpicAPI({
                            aadharNumber: encryptedAadharCardNumber,
                            dateOfBirth: values.dateOfBirth
                                ?.split('-')
                                ?.reverse()
                                ?.join('-'),
                            gender: values.gender.slice(0, 1),
                            stateCode: values.state,
                            districtCode: values.district,
                            name: values.fullName,
                            mobileNumber: values.phoneNumber,
                            consent: values.termsAccepted,
                        }).then(res => {
                            afterSubmitSuccess(values, res.data)
                        })
                    } else {
                        afterSubmitSuccess()
                    }
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
        },
        validateOnBlur: true,
        validationSchema,
    })

    const validatePinCode = useCallback(
        (newValue: string) => {
            setIsLoading(true)
            getPostalPinCodeInfoAPI(newValue)
                .then(res => {
                    if (res.data?.state) {
                        formik.setFieldValue('state', res.data?.state || '')
                        formik.setFieldValue(
                            'district',
                            res.data?.district || '',
                        )
                        formik.setFieldError('pincode', '')
                        setIsPinCodeValid(true)
                    } else {
                        setIsPinCodeValid(false)
                        formik.setFieldValue('state', '')
                        formik.setFieldValue('district', '')
                    }
                })
                .catch(() => {
                    setIsPinCodeValid(false)
                    formik.setFieldValue('state', '')
                    formik.setFieldValue('district', '')
                })
                .finally(() => {
                    setIsLoading(false)
                })
        },
        [formik],
    )

    useEffect(() => {
        if (!isDataLoadedFromResponseRef.current) {
            isDataLoadedFromResponseRef.current = true
            formik.setValues({
                ...formik.values,
                fullName: responseDataFormOne?.fullName || '',
                aadhaarNumber: responseDataFormOne?.aadhaarNo || '',
                dateOfBirth:
                    yatriDetails?.dateOfBirth
                        ?.split('/')
                        ?.reverse()
                        ?.join('-') ||
                    responseDataFormOne?.dateOfBirth ||
                    '',
                gender: responseDataFormOne?.gender || '',
                email: responseDataFormOne?.emailId || '',
                address: responseDataFormOne?.address || '',
                tourStartDate:
                    yatriDetails?.tourStartDate
                        ?.split('/')
                        ?.reverse()
                        ?.join('-') ||
                    responseDataFormOne?.tourStartDate ||
                    '',
                tourEndDate:
                    yatriDetails?.tourEndDate
                        ?.split('/')
                        ?.reverse()
                        ?.join('-') ||
                    responseDataFormOne?.tourEndDate ||
                    '',
                tourDuration:
                    (responseDataFormOne?.tourDuration &&
                        `${responseDataFormOne?.tourDuration}`) ||
                    '',
                phoneNumber: responseDataFormOne?.phoneNumber?.slice(-10) || '',
                pincode: yatriDetails?.pinCode || '',
            })
            if (yatriDetails?.pinCode && yatriDetails?.pinCode?.length === 6) {
                validatePinCode(yatriDetails?.pinCode)
            }
        }
    }, [
        formik,
        responseDataFormOne,
        validatePinCode,
        yatriDetails?.dateOfBirth,
        yatriDetails?.pinCode,
        yatriDetails?.tourEndDate,
        yatriDetails?.tourStartDate,
    ])

    const handleOnChangeNumericField = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target
            const lengthAllowed =
                name === 'aadhaarNumber' ? 12 : name === 'phoneNumber' ? 10 : 6
            const newValue = value.replace(/[^\d]/g, '').slice(0, lengthAllowed)
            formik.setFieldValue(name, newValue, true)

            if (name === 'pincode' && newValue.length === 6) {
                validatePinCode(newValue)
            }
        },
        [formik, validatePinCode],
    )

    const handleChangeTourDate = (ev: ChangeEvent<HTMLInputElement>) => {
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

    const handleTermsModal = () => {
        setTermsModalOpen(true)
    }

    const handleAcceptTerms = () => {
        formik.setFieldValue('termsAccepted', true)
        setTermsModalOpen(false)
    }

    return (
        <>
            <div className="create-by-tourism-id-form-two-container">
                <div className="heading">
                    <span className="home-button-mobile">
                        <BackButtonWithTitle
                            onBack={onGoBack}
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                        />
                    </span>
                    <img src={arrowLeftSvgIcon} alt="back" onClick={onGoBack} />
                    {shouldUseAbhaFlow
                        ? 'Almost there!'
                        : 'Confirm your profile details '}
                </div>
                <div className="body">
                    {shouldUseAbhaFlow && (
                        <div className="description-text">
                            To complete your ABHA process, please fill out the
                            details.
                        </div>
                    )}
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <Accordion className="accordian" defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                    placeholder="Enter your full name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.fullName}
                                    helperText={formik.errors.fullName}
                                    error={!!formik.errors.fullName}
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    disabled
                                    className="field"
                                    type="date"
                                    label="Date of Birth"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    placeholder="Enter your date of birth"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dateOfBirth}
                                    helperText={formik.errors.dateOfBirth}
                                    error={!!formik.errors.dateOfBirth}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        max: new Date().toISOString().split('T')[0],
                                        min: '1900-01-01',
                                    }}
                                />
                                <RadioGroup
                                    id={formik.values.gender}
                                    value={formik.values.gender}
                                    name="gender"
                                    className="field radio-group"
                                >
                                    <FormLabel>Gender</FormLabel>
                                    <FormControlLabel
                                        value="Female"
                                        control={<Radio disabled />}
                                        label="Female"
                                    />
                                    <FormControlLabel
                                        value="Male"
                                        control={<Radio disabled />}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        value="Other"
                                        control={<Radio disabled />}
                                        label="Other"
                                    />
                                </RadioGroup>
                                {shouldUseAbhaFlow && (
                                    <TextField
                                        disabled={isLoading}
                                        className="field"
                                        type="text"
                                        label="Aadhaar Number"
                                        id="aadhaarNumber"
                                        name="aadhaarNumber"
                                        placeholder="Enter your Aadhaar Number"
                                        onChange={handleOnChangeNumericField}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.aadhaarNumber}
                                        helperText={formik.errors.aadhaarNumber}
                                        error={!!formik.errors.aadhaarNumber}
                                        variant="standard"
                                        required
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                )}
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className="accordian" defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Contact details
                            </AccordionSummary>

                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled={isLoading}
                                    className="field"
                                    type="tel"
                                    label="Phone Number"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Enter your phone number"
                                    onChange={handleOnChangeNumericField}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phoneNumber}
                                    helperText={formik.errors.phoneNumber}
                                    error={!!formik.errors.phoneNumber}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    disabled={isLoading}
                                    className="field"
                                    type="email"
                                    label="Email Address"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    helperText={formik.errors.email}
                                    error={!!formik.errors.email}
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className="accordian" defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Address
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled={isLoading}
                                    className="field"
                                    type="text"
                                    label="Address"
                                    id="address"
                                    name="address"
                                    placeholder="Enter your address"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                    helperText={formik.errors.address}
                                    error={!!formik.errors.address}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    disabled={isLoading}
                                    className="field"
                                    type="text"
                                    label="Pincode"
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Enter your pincode"
                                    onChange={handleOnChangeNumericField}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pincode}
                                    helperText={
                                        formik.errors.pincode ||
                                        (formik.values.pincode &&
                                            !isPincodeValid &&
                                            !isLoading &&
                                            'Invalid pincode')
                                    }
                                    error={
                                        !!formik.errors.pincode ||
                                        (!!formik.values.pincode &&
                                            !isPincodeValid &&
                                            !isLoading)
                                    }
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
                                    placeholder="Enter your District"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.district}
                                    helperText={formik.errors.district}
                                    error={!!formik.errors.district}
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
                                    placeholder="Enter your state"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.state}
                                    helperText={formik.errors.state}
                                    error={!!formik.errors.state}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className="accordian" defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                    placeholder="Enter your tour start date"
                                    onChange={handleChangeTourDate}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.tourStartDate}
                                    helperText={formik.errors.tourStartDate}
                                    error={!!formik.errors.tourStartDate}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: '2024-04-01',
                                        max: '2024-12-31',
                                    }}
                                />
                                <TextField
                                    disabled={isLoading}
                                    className="field three"
                                    type="date"
                                    label="Tour End Date"
                                    id="tourEndDate"
                                    name="tourEndDate"
                                    placeholder="Enter your tour end date"
                                    onChange={handleChangeTourDate}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.tourEndDate}
                                    helperText={formik.errors.tourEndDate}
                                    error={!!formik.errors.tourEndDate}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min:
                                            formik.values.tourStartDate >
                                            new Date()
                                                .toISOString()
                                                .slice(0, 10)
                                                ? formik.values.tourStartDate
                                                : new Date()
                                                      .toISOString()
                                                      .slice(0, 10),
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
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.tourDuration}
                                    helperText={formik.errors.tourDuration}
                                    error={!!formik.errors.tourDuration}
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                        {shouldUseAbhaFlow && (
                            <>
                                <div className="terms-policy">
                                    <Checkbox
                                        required
                                        disabled={isLoading}
                                        name="termsAccepted"
                                        className="terms-checkbox"
                                        checked={formik.values.termsAccepted}
                                        onChange={formik.handleChange}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#331895',
                                            },
                                        }}
                                    />
                                    <p>
                                        I agree to the&nbsp;
                                        <span onClick={handleTermsModal}>
                                            Terms & conditions
                                        </span>
                                    </p>
                                    {termsModalOpen && (
                                        <CardBackdrop
                                            setClose={() =>
                                                setTermsModalOpen(false)
                                            }
                                        >
                                            <TermsAndConditions
                                                setTerms={handleAcceptTerms}
                                                backNavigate={() =>
                                                    setTermsModalOpen(false)
                                                }
                                                initialConsent={formik.values.termsAccepted}
                                            />
                                        </CardBackdrop>
                                    )}
                                </div>
                                {formik.errors.termsAccepted ? (
                                    <FormHelperText
                                        children="Please agree to policies to proceed."
                                        error={true}
                                    ></FormHelperText>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                        <button className="submit-button" type="submit">
                            Create Abha&nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                    </form>
                    {shouldUseAbhaFlow && (
                        <div className="existing-abha-number">
                            <span className="abha-text">
                                Already have ABHA?
                            </span>
                            <NavLink
                                to={`/${coreRoutesEnum.LINK_ABHA}`}
                                className="link-abha"
                            >
                                Link ABHA
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

interface CreateByTourismIdFormTwoPropType {
    afterSubmitSuccess: (
        formData?: CreateByTourismIdFormTwoDataType,
        responseData?: GenerateAbhaByDemograpicSuccessResponseType | void,
    ) => void
    responseDataFormOne: GetUserInfoByIDTP_ApiResponseType | null
    shouldUseAbhaFlow: boolean
    onGoBack: () => void
}

export default CreateByTourismIdFormTwo
