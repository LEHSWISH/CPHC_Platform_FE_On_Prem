import './AbhaViaTourismDetailsForm.styles.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
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
    InputAdornment,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import * as yup from 'yup'
import { isAxiosError } from 'axios'
import { NavLink } from 'react-router-dom'
import arrowLeftSvgIcon from '../../../../assets/icons/arrow-left.svg'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
import {
    generateAbhaByDemograpicAPI,
    getPostalPinCodeInfoAPI,
    updateYatriDetailsApi,
} from '../../../../services/api'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import BackButtonWithTitle from '../../../shared/BackButtonWithTitle'
import CardBackdrop from '../../../shared/CardBackdrop/CardBackdrop'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import {
    GenerateAbhaByDemograpicSuccessResponseType,
    GetUserInfoByIDTP_ApiResponseType,
} from '../../../../interface/ApiResponseTypes'
import TermsAndConditions from '../../../pages/CreateAbhaV2/Modals/CreateViaAadhaar/AadhaarIdForm/TermsAndConditions'
import { convertAadharCardNumber } from '../../../../utils/HelperFunctions'

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

const validationSchema = () =>
    yup.object({
        dateOfBirth: yup.date().required('Please enter your date of birth')
        .min(
            new Date('1899-12-31'),
            'Date of Birth cannot be before 1st January 1900',
        )
        .max(
            new Date(),
            'Date of Birth cannot be in the future'
        ),
        aadhaarNumber: yup.string().required('Please enter your Aadhaar number'),
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
    })

export interface AbhaViaTourismDetailsFormDataType {
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
    termsAccepted: boolean
}

const initialValues: AbhaViaTourismDetailsFormDataType = {
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
    termsAccepted: false,
}

function AbhaViaTourismDetailsForm({
    afterSubmitSuccess,
    responseDataFormOne,
    onGoBack,
}: AbhaViaTourismDetailsFormPropType) {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isPincodeValid, setIsPinCodeValid] = useState(false)
    const [termsModalOpen, setTermsModalOpen] = useState<boolean>(false)
    const [submitButtonErrorText, setSubmitButtonErrorText] = useState<string>('')
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
            setSubmitButtonErrorText('')
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
                    address: values.address,
                    pinCode: values.pincode,
                    state: values.state,
                    district: values.district,
                },
            })
                .then(async () => {
                    const encryptedAadharCardNumber = convertAadharCardNumber(
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
                    }).catch(err => {
                        let message = 'Something went wrong, Please try again'
                        if (isAxiosError(err) && err.response?.data?.errorDetails) {
                            try {
                                const errorDetails = JSON.parse(
                                    err.response?.data?.errorDetails,
                                )
                                if (errorDetails?.code === "HIS-422") {
                                    message = 'Your IDTP details does not match with the given Aadhaar card number. Please mention the correct Aadhaar detail of the user or visit the tourism portal to provide the correct details.'
                                    setSubmitButtonErrorText(message)
                                    return
                                }
                            } catch (err) {
                                //
                            }
                        }
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

    const handleTermsModal = () => {
        setTermsModalOpen(true)
    }

    const handleAcceptTerms = () => {
        formik.setFieldValue('termsAccepted', true)
        setTermsModalOpen(false)
    }

    return (
        <>
            <div className="abha-via-tourism-id-details-form-container">
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
                    <div className="title-web">Almost there!</div>
                    <div className="title-mobile">Yatri Details</div>
                </div>
                <div className="body">
                    <div className="description-text-web">
                        To complete your ABHA process, please fill out the
                        details.
                    </div>
                    <div className="description-text-mobile">
                        Almost there! To complete your ABHA process, please fill
                        out the details.
                    </div>
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <Accordion className="accordion" defaultExpanded>
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
                                    helperText={
                                        formik.touched.fullName &&
                                        formik.errors.fullName
                                    }
                                    error={
                                        !!(
                                            formik.touched.fullName &&
                                            formik.errors.fullName
                                        )
                                    }
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    disabled={
                                        !!(
                                            responseDataFormOne?.dateOfBirth ||
                                            yatriDetails?.dateOfBirth
                                        )
                                    }
                                    className="field"
                                    type="date"
                                    label="Date of Birth"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    placeholder="Enter your date of birth"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dateOfBirth}
                                    helperText={
                                        formik.touched.dateOfBirth &&
                                        formik.errors.dateOfBirth
                                    }
                                    error={
                                        !!(
                                            formik.touched.dateOfBirth &&
                                            formik.errors.dateOfBirth
                                        )
                                    }
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
                                    <FormLabel required>Gender</FormLabel>
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
                                <TextField
                                    className="field"
                                    type="text"
                                    label="Aadhaar Number"
                                    id="aadhaarNumber"
                                    name="aadhaarNumber"
                                    placeholder="Enter your Aadhaar Number"
                                    onChange={handleOnChangeNumericField}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.aadhaarNumber}
                                    helperText={
                                        formik.touched.aadhaarNumber &&
                                        formik.errors.aadhaarNumber
                                    }
                                    error={
                                        !!(
                                            formik.touched.aadhaarNumber &&
                                            formik.errors.aadhaarNumber
                                        )
                                    }
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion className="accordion" defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Contact details
                            </AccordionSummary>

                            <AccordionDetails className="accordion-details">
                                <TextField
                                    className="field"
                                    type="tel"
                                    label="Phone Number"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Enter your phone number"
                                    onChange={handleOnChangeNumericField}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phoneNumber}
                                    helperText={
                                        formik.touched.phoneNumber &&
                                        formik.errors.phoneNumber
                                    }
                                    error={
                                        !!(
                                            formik.touched.phoneNumber &&
                                            formik.errors.phoneNumber
                                        )
                                    }
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
                                <TextField
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
                        <Accordion className="accordion" defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Address
                            </AccordionSummary>
                            <AccordionDetails className="accordion-details">
                                <TextField
                                    disabled={!!responseDataFormOne?.address}
                                    className="field address"
                                    type="text"
                                    label="Address"
                                    id="address"
                                    name="address"
                                    placeholder="Enter your address"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                    helperText={
                                        formik.touched.address &&
                                        formik.errors.address
                                    }
                                    error={
                                        !!(
                                            formik.touched.address &&
                                            formik.errors.address
                                        )
                                    }
                                    variant="standard"
                                    required
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    className="field pincode"
                                    type="text"
                                    label="Pincode"
                                    id="pincode"
                                    name="pincode"
                                    placeholder="- - - - - -"
                                    onChange={handleOnChangeNumericField}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pincode}
                                    helperText={
                                        (formik.touched.pincode &&
                                            formik.errors.pincode) ||
                                        (formik.values.pincode &&
                                            !isPincodeValid &&
                                            !isLoading &&
                                            'Invalid pincode')
                                    }
                                    error={
                                        !!(
                                            (formik.touched.pincode &&
                                                formik.errors.pincode) ||
                                            (!!formik.values.pincode &&
                                                !isPincodeValid &&
                                                !isLoading)
                                        )
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
                        <FormHelperText
                            className='validation-message'
                            children={submitButtonErrorText}
                            error={!!submitButtonErrorText}
                        ></FormHelperText>
                        <button className="submit-button" type="submit">
                            Create &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                    </form>
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
                </div>
            </div>
        </>
    )
}

interface AbhaViaTourismDetailsFormPropType {
    afterSubmitSuccess: (
        formData?: AbhaViaTourismDetailsFormDataType,
        responseData?: GenerateAbhaByDemograpicSuccessResponseType | void,
    ) => void
    responseDataFormOne: GetUserInfoByIDTP_ApiResponseType | null
    onGoBack: () => void
}

export default AbhaViaTourismDetailsForm
