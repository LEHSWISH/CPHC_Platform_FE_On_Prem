import { TextField, InputAdornment, CircularProgress } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import './CreateAbha.scss'
import { createAbhaAddress, fetchAbhaCard, fetchAbhaCardPdf, saveAbhaDetails, suggestionsApi } from '../../../../../../services/api'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { useDispatch } from 'react-redux'
import { loadYatriAllData } from '../../../../../../services/store/slices/yatriSlice'

function CreateAbha({ formData, txnId, onClose,responseData }: AbhaAddressPropType) {
    // const [notChecked, setNotChecked] = useState<boolean>(false)
    const [abhaAddressFocused, ] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [messages, setMessages] = useState([
        {
            message: 'Minimum length - 8 characters',
            pattern: /^.{8,}$/,
            isValid: '',
        },
        {
            message: 'Maximum length - 18 characters',
            pattern: /^.{1,18}$/,
            isValid: '',
        },
        {
            message:'Special characters allowed - 1 dot (.) and/or 1 underscore (_)',
            pattern: /^(?!.*(?:_.*_|\..*\..*))[a-zA-Z\d]+(?:[._][a-zA-Z\d]+)*$/,
            isValid: '',
        },
        {
            message:
                'Special character dot and underscore should be in between. Special characters cannot be in the beginning or at the end',
            pattern: /^[a-zA-Z0-9]+([._][a-zA-Z0-9]+)*$/,
            isValid: '',
        },
        {
            message:
                'Alphanumeric - only numbers, only letters or any combination of numbers and letters is allowed.',
            pattern: /^(?!^[_.])(?!.*[_.]$)(?=.*[a-zA-Z\d])[a-zA-Z\d_.]+$/,
            isValid: '',
        },
    ])
    const [suggestions, setSuggestions] = useState(['John_doe', 'John_doe1'])
    const navigate=useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        suggestionsApi({
            txnId: txnId
        })
            .then((res) => {
                setSuggestions(res.data.abhaAddressList)
            })
            .catch(() => {
            })
    }, [ txnId])
    
    const formik = useFormik({
        initialValues: formData,
        onSubmit: (values) => {
            if (isLoading || values.abhaAddress === '') {
                return
            }
            let submissionAbhaAddress = values.abhaAddress;
        
            if (!submissionAbhaAddress.endsWith('@abdm')) {
                submissionAbhaAddress += '@abdm';
            }
            setIsLoading(true)
            createAbhaAddress({
                abhaAddress:values.abhaAddress,
                preferred:1,
                txnId:txnId
            }).then(()=>{
                saveAbhaDetails({
                    abhaToken:responseData.data.tokens?.token || ''
                }).then(()=>{}).catch(()=>{})

                fetchAbhaCard({
                    abhaToken:responseData.data.tokens?.token || '',
                    authType:responseData.data.authType,
                    aadharNumber: responseData.aadharNumber
                }).then(()=>{})
                .catch(()=>{})
    
                fetchAbhaCardPdf({
                    abhaToken:responseData.data.tokens?.token || '',
                    authType:responseData.data.authType,
                    aadharNumber: responseData.aadhaar
                }).then(()=>{})
                .catch(()=>{})
                onClose()
                dispatch(loadYatriAllData())
                navigate(`/${coreRoutesEnum.CREATE_ABHA}`)
            })
            .catch(err => {
                let message = 'Something went wrong, Please try again'
                    if (isAxiosError(err) && err.response?.data?.errorDetails) {
                        try {
                            const errorDetails = JSON.parse(
                                err.response?.data?.errorDetails,
                            )
                            message = errorDetails.error.message
                        } catch (err) {console.log('')}
                    } else if (
                        isAxiosError(err) &&
                        err.response?.data?.message
                    ) {
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
    })

    const handleAadhaarChange = (event: React.ChangeEvent<HTMLInputElement>, directValue?: string) => {
        const copyAadharState = [...messages]
        if (directValue) {
            formik.setFieldValue('abhaAddress', directValue)
            return
        }
        const { name, value } = event.target;
        if (name === 'abhaAddress') {
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].pattern.test(value)) {
                    copyAadharState[i].isValid = 'true'
                } else {
                    copyAadharState[i].isValid = 'false'
                }
            }

            formik.handleChange(event);
            setMessages(copyAadharState)
        } else {
            formik.handleChange(event);
        }
    };

    const fillSuggestion = (suggestion: string) => {
        const copyAadharState = [...messages]
        if (suggestion) {
            formik.setFieldValue('abhaAddress', suggestion)
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].pattern.test(suggestion)) {

                    copyAadharState[i].isValid = 'true'
                } else {
                    copyAadharState[i].isValid = 'false'
                }
            }
            setMessages(copyAadharState)
            return
        }
    }
    return (
        <div className="abha-address-form-container">
            <div className='step-text-div'>Step 3 of 3</div>
            <div className="abha-head">Create ABHA Address</div>
            <div className="abha-body">
                <div className="abha-description">
                    ABHA address is a unique username that allows you to share
                    and access your health records digitally
                </div>
                <form onSubmit={formik.handleSubmit} className="form" autoComplete='off'>
                    <TextField
                        type="text"
                        className='textfield'
                        label="ABHA Address"
                        id="abhaAddress"
                        name="abhaAddress"
                        placeholder=""
                        onChange={handleAadhaarChange}
                        value={formik.values.abhaAddress}
                        helperText={abhaAddressFocused}
                        error={!!abhaAddressFocused}
                        variant="standard"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    @abdm
                                </InputAdornment>
                            ),
                        }}
                        sx={{ maxWidth: '50%' }}
                    />
                    <ul className="error-messages">
                        {messages.map((message, i) => {
                            return (
                                <li
                                    key={i}
                                    className={
                                        message.isValid.length === 0
                                            ? 'first'
                                            : message.isValid === 'true'
                                              ? 'first'
                                              :'error'
                                    }
                                >
                                    {message.message}
                                </li>
                            )
                        })}
                    </ul>
                    <div className="suggestions">
                        Suggestions:
                        <div className="suggestions-parent">
                            {suggestions.slice(0, 4).map((suggestion, i) => {
                                return (
                                    <span
                                        key={i}
                                        className="suggestion"
                                        onClick={() =>
                                            fillSuggestion(suggestion)
                                        }
                                    >
                                        {suggestion}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                    <button className="create-button" type="submit">
                        Create Abha Address &nbsp;
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
    )
}
interface AbhaAddressPropType {
    txnId: string
    formData: AbhaAddressFormDataType,
    setUpdatedFormData?: (data: AbhaAddressFormDataType) => void
    onClose: () => void,
    responseData:any
}

interface AbhaAddressFormDataType {
    abhaAddress: string,
}

export default CreateAbha