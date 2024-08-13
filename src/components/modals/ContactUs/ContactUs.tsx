import {
    Button,
    CircularProgress,
    FormHelperText,
    InputAdornment,
    InputLabel,
    TextField,
} from '@mui/material'
import './ContactUs.styles.scss'
import { useFormik } from 'formik'
import { useState, DragEvent, ChangeEvent, useEffect, useRef, useMemo } from 'react'
import * as Yup from 'yup'
import VisuallyHiddenFileInput from '../../shared/VisuallyHiddenInput'
import { convertFiletoBase64String, extractBase64Data } from '../../../utils/HelperFunctions'
import { useDispatch } from 'react-redux'
import { FileDetailsType } from '../../../interface/medicalCertificate/FileDetailsType'
import UploadIcon from '../../../assets/icons/Upload.svg'
import Close from '../../../assets/icons/Close.svg'
import ImageIcon from '../../../assets/icons/image-icon.svg'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { SendSupportEmailApiPayloadType } from '../../../interface/ApiRequestPayoadTypes'
import { isAxiosError } from 'axios'
import { yatriSupportSendEmailWithBasicApi, yatriSupportSendEmailWithBearerApi } from '../../../services/api'

const MAX_FILE_SIZE_TO_UPLOAD_IN_MB = 2
const ALLOWED_EXTENSIONS = ['jpeg', 'png','jpg']

const initialValues: ContactUsDetailsDataType = {
    fullName: '',
    phoneNumber: '',
    message: '',
}

function ContactUs({ closeButton = false, isModal = false, goBack = () => {}, closeModal = () => {} }) {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isDetailsLoadedRef = useRef(false)
    const [validationMessage, setValidationMessage] = useState<string>('')
    const [fileToBeUploaded, setFileToBeUploaded] = useState<FileDetailsType>()
    const fullName = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.yatriDetails?.fullName,
    )
    const phoneNumber = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.phoneNumber,
    )
    const { token, userName } = useAppSelector(s => s.auth.yatri)
    const subjectMessage = userName ? ` || ${userName}` : ''
    const isAuthenticated = useMemo(
        () =>
            typeof token === 'string' &&
            typeof userName === 'string' &&
            token.length > 0 &&
            userName.length > 0,
        [token, userName],
    )

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Please enter a valid input'),
        phoneNumber: Yup.string()
            .required('Please enter a valid input')
            .length(10, 'Phone number length should be 10 digits'),
        message: Yup.string().required('Please enter a valid input'),
    })

    const formik = useFormik({
        initialValues,
        onSubmit: values => {
            if (isLoading) return
            setIsLoading(true)
            const payLoadObject: SendSupportEmailApiPayloadType = {
                subject: `Support Request ||  ${values.fullName}${subjectMessage}`,
                messageBody: values.message,
                phoneNumber: values.phoneNumber,
                name: values.fullName,
                emailTo: ["chardhamsupport@wishfoundationindia.org"],
                bcc: ["yatrisupport@centilytics.com"]
            }
            if (fileToBeUploaded) {
                payLoadObject.fileName = fileToBeUploaded.fileName
                payLoadObject.attachFiles = [fileToBeUploaded.fileBase64]
            }
            if(isAuthenticated) {
                yatriSupportSendEmailWithBearerApi(payLoadObject).then(() => {
                    if(isModal) {
                        closeModal()
                    }
                    setFileToBeUploaded(undefined)
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: 'Our team has received your request and will contact you shortly.',
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
            } else {
                yatriSupportSendEmailWithBasicApi(payLoadObject).then(() => {
                    if(!isModal) {
                        goBack()
                    }
                    setFileToBeUploaded(undefined)
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: 'Our team has received your request and will contact you shortly.',
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
        if (isModal && !isDetailsLoadedRef.current) {
            isDetailsLoadedRef.current = true
            formik.setValues({
                ...formik.values,
                fullName: fullName || '',
                phoneNumber: phoneNumber || '',
            })
        }
    }, [formik, isModal, fullName, phoneNumber])

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
    }

    const dropHandler = (ev: DragEvent<HTMLDivElement>) => {
        // Prevent default behavior (prevent the file from being opened)
        ev.preventDefault()
        const file = ev.dataTransfer.items
            ? ev.dataTransfer.items[0].kind === 'file'
                ? ev.dataTransfer.items[0].getAsFile()
                : null
            : ev.dataTransfer.files[0]
        file && selectFileToUpload(file)
    }

    const handleFileInputByBrowse = (ev: ChangeEvent<HTMLInputElement>) => {
        // Prevent default behavior (prevent the file from being opened)
        ev.preventDefault()
        const file = ev.target?.files?.[0]
        file && selectFileToUpload(file)
    }

    const selectFileToUpload = (file: File) => {
        if (file && validateFile(file)) {
            convertFiletoBase64String(file)
                .then(fileBase64 => {
                    setFileToBeUploaded({
                        fileObj: file,
                        fileBase64: extractBase64Data(`${fileBase64}`),
                        fileName: file.name,
                        createdOn: new Date(),
                        isFileOnLocal: true,
                    })
                })
                .catch()
        }
    }

    const validateFile = (file: File) => {
        if (isLoading) {
            return
        }

        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_TO_UPLOAD_IN_MB) {
            setValidationMessage('File size should be up to 2 MB.')
            return false
        }

        const extension = file.name.split('.')?.pop()?.toLowerCase()
        if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
            setValidationMessage('File format should be jpeg, jpg and png only.')
            return
        }

        setValidationMessage('')
        return true
    }

    const handleFileDelete = (ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault()
        setFileToBeUploaded(undefined)
    }

    return (
        <div className="contact-us-container">
            {closeButton ? (
                <div className="close-button" onClick={goBack}>
                    <img src={Close} alt="close-button" />
                </div>
            ) : (
                <></>
            )}
            <div className="contact-us-header">Raise Request</div>
            <div className="contact-us-desc">
                <p>Please provide your details and any inquiries you may have.</p>
                <p>Our team will contact you shortly.</p>
            </div>
            <form onSubmit={formik.handleSubmit} autoComplete="off">
                <div className="input-field-container">
                    <InputLabel
                        style={{ left: '0px' }}
                        shrink
                        htmlFor="fullName"
                    >
                        Full Name <span className="asterik">*</span>
                    </InputLabel>
                    <TextField
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your Full Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                        helperText={
                            formik.touched.fullName && formik.errors.fullName
                        }
                        error={
                            !!(
                                formik.touched.fullName &&
                                formik.errors.fullName
                            )
                        }
                        required
                        fullWidth
                    />
                </div>
                <div className="input-field-container">
                    <InputLabel
                        style={{ left: '0px' }}
                        shrink
                        htmlFor="phoneNumber"
                    >
                        Phone Number <span className="asterik">*</span>
                    </InputLabel>
                    <TextField
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter your Phone Number"
                        onChange={handlePhoneNumberChange}
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
                        required={true}
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
                <div className="input-field-container">
                    <InputLabel
                        style={{ left: '0px' }}
                        shrink
                        htmlFor="drop_zone"
                    >
                        Message <span className="asterik">*</span>
                    </InputLabel>
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        id="message"
                        name="message"
                        placeholder="Enter your Message"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.message}
                        helperText={
                            formik.touched.message && formik.errors.message
                        }
                        error={
                            !!(formik.touched.message && formik.errors.message)
                        }
                        inputProps={{
                            maxLength: 200, // Set the maximum length to 200 characters
                        }}
                    />
                </div>
                <div className="input-field-container">
                    <InputLabel
                        style={{ left: '0px' }}
                        shrink
                        htmlFor="drop_zone"
                    >
                        Image
                    </InputLabel>
                    {!fileToBeUploaded && (
                        <>
                            <div
                                className="dotted-box"
                                id="drop_zone"
                                onDrop={dropHandler}
                                onDragOver={ev => {
                                    // Prevent default behavior (Prevent file from being opened)
                                    ev.preventDefault()
                                }}
                            >
                                <div className="browse-files">
                                    <img
                                        src={UploadIcon}
                                        className="upload-icon"
                                        alt="upload-files"
                                    />
                                    Drop image here or
                                    <Button variant="text" component="label">
                                        Browse
                                        <VisuallyHiddenFileInput
                                            type="file"
                                            onChange={handleFileInputByBrowse}
                                        />
                                    </Button>
                                </div>
                            </div>
                            <div className="info-text-secondry">
                                Up to 2MB ● JPEG,JPG and PNGs only
                            </div>
                        </>
                    )}
                    {fileToBeUploaded && (
                        <div className="img-uploaded-container">
                            <div className="img-uploaded-inner-container">
                                <div className="img-uploaded-content">
                                    <img src={ImageIcon} alt="image-icon" />
                                    <span className="filename">
                                        {fileToBeUploaded.fileName}
                                    </span>
                                </div>
                                <span
                                    className="delete-button"
                                    onClick={handleFileDelete}
                                >
                                    <img src={Close} alt="delete-button" />
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <FormHelperText
                    className="validation-message"
                    children={validationMessage || ' '}
                    error={!!validationMessage}
                ></FormHelperText>
                <button className="submit-button" type="submit">
                    Submit &nbsp;
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
    )
}

export interface ContactUsDetailsDataType {
    fullName: string
    phoneNumber: string
    message: string
}

export default ContactUs
