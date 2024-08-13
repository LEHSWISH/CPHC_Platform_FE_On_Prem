import { useFormik } from 'formik'
import './RecoverWithGovernmentId.styles.scss'
import {
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useState } from 'react'

function RecoverWithGovernmentId({
    onSuccess,
}: RecoverWithGovernmentIdPropType) {
    const [idValueErrorMessage, setIdValueErrorMessage] = useState<string>('')
    const [idTypeErrorMessage, setIdTypeErrorMessage] = useState<string>('')
    const [phoneNumberFocused, setPhoneNumberFocused] = useState<string>('')
    const [notSelectedIdType, setNotSelectedIdType] = useState<boolean>(false)

    const documentTypes = [
        // {
        //     key: 'Aadhar Card',
        //     value: 'AADHAR_CARD',
        //     validationRegex: new RegExp('^[2-9]\\d{3}\\d{4}\\d{4}$'),
        //     invalidMessage: 'Invalid Aadhaar number. Please try again',
        // },
        {
            key: 'PAN Card',
            value: 'PAN_CARD',
            validationRegex: new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
            invalidMessage: 'Invalid PAN card number. Please try again',
        },
        {
            key: 'Passport',
            value: 'PASSPORT',
            validationRegex: new RegExp('^[A-PR-WY-Z][1-9]\\d\\d{4}[1-9]$'),
            invalidMessage: 'Invalid Passport. Please try again',
        },
        {
            key: 'Voter ID Card',
            value: 'VOTER_ID_CARD',
            validationRegex: [
                new RegExp('^[A-Z]{3}\\d{7}$'),
                new RegExp('^[A-Z]{3}[0-9]{7}$'),
            ],
            invalidMessage: 'Invalid Voter ID number. Please try again',
        },
        {
            key: 'Driving License',
            value: 'DRIVING_LICENSE',
            validationRegex: new RegExp(
                '^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$',
            ),
            invalidMessage: 'Invalid Driving License number. Please try again',
        },
    ]

    const formik = useFormik({
        initialValues: {
            governmentIdType: '',
            governmentId: '',
            phoneNumber: '',
        },
        onSubmit: (values: RecoverWithGovernmentIdDataType) => {
            if (values.governmentId === '') {
                return
            }

            if (values.governmentIdType === '') {
                return
            }

            if (values.phoneNumber === '' || values.phoneNumber.length !== 10) {
                return
            }
            onSuccess(values)
        },
    })

    const handlePhoneNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target
        if (name === 'phoneNumber') {
            // Allow only digits
            const onlyNumbers = value.replace(/[^0-9]/g, '')
            // If first digit not from 2-9, give empty string, else allow up to 12 digits
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

    const handleIdBlur = () => {
        if (formik.values.governmentId === '') {
            setIdValueErrorMessage(
                `Please enter ${formik.values.governmentIdType.replace(/_/g, ' ')} number.`,
            )
        } else {
            if (formik.values.governmentIdType) {
                const docInfo = documentTypes.find(
                    val => val.value === formik.values.governmentIdType,
                )
                if (docInfo && docInfo.validationRegex) {
                    if (Array.isArray(docInfo.validationRegex)) {
                        if (
                            docInfo.validationRegex?.length &&
                            !docInfo.validationRegex?.every(reg => {
                                return reg.test(formik.values.governmentId)
                            })
                        ) {
                            setIdValueErrorMessage(docInfo.invalidMessage)
                            return
                        }
                    } else if (
                        !docInfo.validationRegex.test(
                            formik.values.governmentId,
                        )
                    ) {
                        setIdValueErrorMessage(docInfo.invalidMessage)
                        return
                    }
                }
            }
            setIdValueErrorMessage('')
        }
    }

    const handleIdTypeBlur = () => {
        if (formik.values.governmentIdType === '') {
            setNotSelectedIdType(true)
            setIdTypeErrorMessage('Please select government ID type.')
        } else {
            setNotSelectedIdType(false)
            setIdTypeErrorMessage('')
        }
        idValueErrorMessage && handleIdBlur()
    }

    return (
        <form className="abha-number-form" onSubmit={formik.handleSubmit} autoComplete='off'>
            <div className="form-fields">
                <FormControl>
                    <InputLabel
                        id="governmentIdTypeLabel"
                        htmlFor="governmentIdType"
                        shrink={true}
                        variant="standard"
                        error={notSelectedIdType}
                    >
                        Government ID type{' '}
                        <span style={{ color: '#d32f2f' }}>*</span>
                    </InputLabel>
                    <Select
                        label="Government ID Type"
                        id="governmentIdType"
                        name="governmentIdType"
                        onChange={formik.handleChange}
                        onBlur={handleIdTypeBlur}
                        value={formik.values.governmentIdType}
                        error={notSelectedIdType}
                        variant="standard"
                        required
                        fullWidth
                        displayEmpty
                    >
                        <MenuItem disabled value="">
                            Select government ID type
                        </MenuItem>
                        {documentTypes.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.key}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText sx={{ color: '#d32f2f;' }}>
                        {idTypeErrorMessage}
                    </FormHelperText>
                </FormControl>
                <TextField
                    type="text"
                    label="Government ID"
                    id="governmentId"
                    name="governmentId"
                    placeholder="Enter your government ID"
                    onChange={formik.handleChange}
                    onBlur={handleIdBlur}
                    value={formik.values.governmentId}
                    error={
                        !!idValueErrorMessage || !!formik.errors.governmentId
                    }
                    helperText={
                        idValueErrorMessage || formik.errors.governmentId
                    }
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    type="text"
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
            <button className="continue-button" type="submit">
                Continue
            </button>
        </form>
    )
}

interface RecoverWithGovernmentIdDataType {
    governmentIdType: string
    governmentId: string
    phoneNumber: string
}

interface RecoverWithGovernmentIdPropType {
    onSuccess: (value: any) => void
}

export default RecoverWithGovernmentId
