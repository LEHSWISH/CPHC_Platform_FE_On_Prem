import { useState } from 'react'
import { InputAdornment, TextField } from '@mui/material'
import { useFormik } from 'formik'
import './RecoverWithAbhaNumber.scss'
// import { forgetUsername } from '../../../../services/api'
// import TickIcon from '../../../../assets/icons/tickIcon.svg'

function RecoverWithAbhaNumber({ onSuccess }: RecoverWithAbhaNumberPropType) {
    const [phoneNumberFocused, setPhoneNumberFocused] = useState<string>('')
    const [abhaNumberFocused, setAbhaNumberFocused] = useState<string>('')

    const formik = useFormik({
        initialValues: {
            abhaNumber: '',
            phoneNumber: '',
        },
        onSubmit: values => {
            if (values.abhaNumber === '') {
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

    const handleAbhaNumberBlur = (
        event: React.FocusEvent<HTMLInputElement>,
    ) => {
        const abhaNumber = event.target.value
        if (abhaNumber === '') {
            setAbhaNumberFocused('Please enter ABHA number')
        } else if (!(abhaNumber.length >= 8 && abhaNumber.length <= 18)) {
            setAbhaNumberFocused('Please enter a valid abha number')
        } else {
            setAbhaNumberFocused('')
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

    return (
        <form className="abha-number-form" onSubmit={formik.handleSubmit} autoComplete='off'>
            <div className="form-fields">
                <TextField
                    type="text"
                    label="ABHA Number"
                    id="abhaNumer"
                    name="abhaNumber"
                    placeholder="Enter your ABHA number"
                    onChange={formik.handleChange}
                    onBlur={handleAbhaNumberBlur}
                    value={formik.values.abhaNumber}
                    helperText={abhaNumberFocused}
                    error={!!abhaNumberFocused}
                    variant="standard"
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
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

interface RecoverWithAbhaNumberPropType {
    onSuccess: (value: any) => void
}

export default RecoverWithAbhaNumber
