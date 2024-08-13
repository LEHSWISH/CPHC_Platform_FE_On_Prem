import TextField from '@mui/material/TextField/TextField'
import GroupHeart from '../../../../assets/icons/GroupHeart 499.svg'
import {
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    FormHelperText,
} from '@mui/material'
import { useCallback, useState } from 'react'
import './Nominator.scss'
import { useFormik } from 'formik'
import careGiverAPI, {
    CareGiverGetAllUserLinkedWithPhoneResponseType,
} from '../../../../services/api/careGiverAPI'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../utils/hooks/useAppDispatch'
import FailureModal from '../../../modals/Failure/FailureModal'
import { isAxiosError } from 'axios'
import UsersListDetailed from '../../../shared/UsersList/UserListDetailed'
import CardModal from '../../../shared/CardModal/CardModal'
import { careRequestFormvalidationSchema } from '../../../../utils/constants/validations'
import { decryptUsername } from '../../../../utils/HelperFunctions'

function Nominator({
    isAlreadyAssignedCareGiver,
    isCareRecipientExist,
}: {
    isAlreadyAssignedCareGiver: boolean
    isCareRecipientExist: boolean
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [faliureModalData, setFaliureModalData] = useState<{
        headingText: string
        descriptionText: string
    } | null>(null)
    const [phoneNumberLinkedResponse, setPhoneNumberLinkedResponse] =
        useState<CareGiverGetAllUserLinkedWithPhoneResponseType | null>(null)
    const [selectedUser, setSelectedUser] = useState('')
    const dispatch = useAppDispatch()

    const submitWithUserId = useCallback(
        (userNameOrPhoneNumber: string) => {
            setIsLoading(true)
            careGiverAPI
                .sendRequest(userNameOrPhoneNumber)
                .then(() => {
                    formik.resetForm()
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: 'Caregiver request sent successfully.',
                            severity: 'success',
                            anchorOrigin: {
                                horizontal: 'center',
                                vertical: 'bottom',
                            },
                        }),
                    )
                })
                .catch(err => {
                    if (err?.response?.data?.code === 'USR046') {
                        setFaliureModalData({
                            headingText: 'High Risk Yatri',
                            descriptionText:
                                'High-risk Yatris are not eligible to serve as caregivers.',
                        })
                    } else {
                        dispatch(
                            setSnackBar({
                                open: true,
                                message:
                                    err.response.data.message ||
                                    'Something went wrong',
                                severity: 'error',
                            }),
                        )
                    }
                })
                .finally(() => {
                    setIsLoading(false)
                })
        },
        [dispatch],
    )

    const handleSubmitSelectedUser = useCallback(() => {
        setPhoneNumberLinkedResponse(null)
        submitWithUserId(selectedUser)
    }, [selectedUser, submitWithUserId])

    const formik = useFormik({
        initialValues: {
            userNameOrPhoneNumber: '',
            consent: false,
        },
        validationSchema: careRequestFormvalidationSchema,
        onSubmit: values => {
            if (isAlreadyAssignedCareGiver) {
                setFaliureModalData({
                    headingText: 'Caregiver already exists!',
                    descriptionText:
                           'Please remove your caregiver to raise a new request.'
                })
                return
            } else if (isCareRecipientExist) {
                setFaliureModalData({
                    headingText: 'Care Recipient already exists!',
                    descriptionText: 'You cannot request a caregiver while you have been assigned care recipients. Please remove your care recipient(s) to send a new request'
                })
                return
            }
            if (/^[0-9]+$/.test(values.userNameOrPhoneNumber)) {
                setIsLoading(true)
                careGiverAPI
                    .getAllUserLinkedWithPhoneNumber(
                        values.userNameOrPhoneNumber,
                    )
                    .then(res => {
                        const decryptedData: CareGiverGetAllUserLinkedWithPhoneResponseType =
                            []
                        if (res.data?.length == 0) {
                            formik.setFieldError(
                                'userNameOrPhoneNumber',
                                'No user linked with this Phone number',
                            )
                        } else {
                            res.data.forEach(userData => {
                                decryptedData.push({
                                    fullName: userData.fullName,
                                    userName: decryptUsername(userData.userName)
                                        .toString()
                                        .trim(),
                                })
                            })
                            setPhoneNumberLinkedResponse(decryptedData)
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
                    .finally(() => {
                        setIsLoading(false)
                    })
            } else {
                submitWithUserId(values.userNameOrPhoneNumber)
            }
        },
    })

    return (
        <>
            <div className="form-up">
                <img src={GroupHeart} alt="" />
                <div className="form-up-heading">
                    <h1>Nominate a Caregiver</h1>
                    <p>Assign a caregiver for safer yatra </p>
                </div>
            </div>
            <form
                action=""
                onSubmit={formik.handleSubmit}
                className="personal-details-form"
                autoComplete="off"
            >
                <div className="form-middle">
                    <TextField
                        type="text"
                        className="abha-number-field"
                        label="Username or Phone Number"
                        id="userNameOrPhoneNumber"
                        name="userNameOrPhoneNumber"
                        placeholder="Enter caregiver’s username or phone number"
                        variant="standard"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        helperText={
                            formik.touched.userNameOrPhoneNumber &&
                            formik.errors.userNameOrPhoneNumber
                        }
                        error={
                            formik.touched.userNameOrPhoneNumber &&
                            !!formik.errors.userNameOrPhoneNumber
                        }
                        value={formik.values.userNameOrPhoneNumber}
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ maxWidth: '100%' }}
                    />
                </div>

                <div className="form-down">
                    <div className="form-down-up">
                        <FormGroup>
                            <FormControlLabel
                                required
                                control={
                                    <Checkbox
                                        required
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        checked={formik.values.consent}
                                        name="consent"
                                    />
                                }
                                label="I agree to share my details with the requested caregiver"
                            />
                            <FormHelperText
                                className="validation-message"
                                children={
                                    formik.touched.consent &&
                                    formik.errors.consent
                                }
                                error={
                                    formik.touched.consent &&
                                    !!formik.errors.consent
                                }
                            ></FormHelperText>
                        </FormGroup>
                    </div>
                    <div className="form-down-down">
                        <button className="get-otp-button" type="submit">
                            Request &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </form>
            {faliureModalData && (
                <FailureModal
                    headingText={faliureModalData?.headingText}
                    descriptionText={faliureModalData?.descriptionText}
                    setClose={() => setFaliureModalData(null)}
                />
            )}
            {phoneNumberLinkedResponse && (
                <CardModal setClose={() => setPhoneNumberLinkedResponse(null)}>
                    <div className="user-id-selection-container">
                        <div className="title">
                            Choose an account to be your caregiver
                        </div>
                        <UsersListDetailed
                            users={
                                phoneNumberLinkedResponse?.map(user => ({
                                    uniqueKey: user.userName,
                                    primaryData: user.fullName || user.userName,
                                    secondaryData: user.fullName
                                        ? user.userName
                                        : '-',
                                })) || []
                            }
                            selectedUser={selectedUser}
                            onSelectUser={setSelectedUser}
                            variant="typeTwo"
                        />
                        <button onClick={handleSubmitSelectedUser}>
                            Request
                        </button>
                    </div>
                </CardModal>
            )}
        </>
    )
}

export default Nominator
