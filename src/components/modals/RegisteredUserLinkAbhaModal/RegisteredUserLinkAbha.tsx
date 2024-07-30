import './RegisteredUserLinkAbha.styles.scss'
import { useState } from 'react'
import ProfileIcon from '../../../assets/icons/profileIcon.svg'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { TextField } from '@mui/material'
import { OtpFormData } from '../../pages/CreateAbhaV2/Modals/LinkAbha'
import UsersList from '../../shared/UsersList/UsersList'
import LinkViaAbhaNumber from '../../pages/CreateAbhaV2/Modals/LinkAbha/LinkViaAbhaNumber/LinkViaAbhaNumber'
import LinkAbhaViaAbhaNumberOtp from '../../pages/CreateAbhaV2/Modals/LinkAbha/LinkViaAbhaNumberOtp/LinkAbhaViaAbhaNumberOtp'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import LinkAbhaConfirmationModal from './LinkAbhaConfirmationModal'

function RegisteredUserLinkAbha() {
    const [step, setStep] = useState<number>(0)
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
    const [radioButtonValues, setRadioButtonValues] = useState<string>(
        NumberType.AADHAR,
    )
    const [otpFormData, setOtpFormData] = useState<OtpFormData>({
        txnId: '',
        inputValue: '',
        otpFor: '',
        isMobile: false,
    })
    const yatriData = useAppSelector(state => {
        return state.yatri.yatriAllDetails.data
    })
    const comeBack = (step: number) => {
        setStep(step)
    }
    const moveAhead = (step: number) => {
        setStep(step)
    }
    const setOtpFormComponentData = (data: OtpFormData) => {
        setOtpFormData(data)
    }
    const closeModal = () => {
        setConfirmationModal(false)
    }
    const stepUpdate = () => {
        setStep(1)
    }

    const validationSchema = Yup.object({
        // abhaAddress: Yup.string().required('Please enter a valid ABHA address'),
    })

    const formik = useFormik({
        initialValues: {
            abhaAddress: '',
        },
        onSubmit: () => {
            setConfirmationModal(true)
        },
        validateOnBlur: true,
        validationSchema,
    })

    return (
        <>
            {step === 0 ? (
                <form
                    onSubmit={formik.handleSubmit}
                    className="confirm-link-abha-container"
                >
                    <div className="title">Confirm your ABHA address</div>
                    <div className="sub-title">
                        Please provide the following details to link your ABHA
                    </div>
                    <div className="details-outer-container">
                        <div className="profile-details-card">
                            <div className="profile-detail">
                                <img
                                    className="profile-img"
                                    src={
                                        yatriData?.abhaUserDetails?.imagePath ||
                                        ProfileIcon
                                    }
                                    alt=""
                                />
                                <div className="fullname">
                                    {yatriData?.abhaUserDetails?.fullName}
                                </div>
                                <div className="abha-number">
                                    ABHA Number -{' '}
                                    {yatriData?.abhaUserDetails?.ABHANumber}
                                </div>
                            </div>
                            <div className="details-section">
                                <div className="details">
                                    <div className="detail-left">
                                        Phone number
                                    </div>
                                    <div className="detail-right">
                                        +91{' '}
                                        {
                                            yatriData?.abhaUserDetails
                                                ?.phoneNumber
                                        }
                                    </div>
                                </div>
                                <div className="details">
                                    <div className="detail-left">
                                        Date of Birth
                                    </div>
                                    <div className="detail-right">
                                        {yatriData?.abhaUserDetails?.dateOfBirth
                                            .split('-')
                                            .reverse()
                                            .join('/')}
                                    </div>
                                </div>
                                <div className="details">
                                    <div className="detail-left">Gender</div>
                                    <div className="detail-right">
                                        {yatriData?.abhaUserDetails?.gender}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="abha-address-container">
                            <div className="abha-address-listing">
                                <div className="list-instruction">
                                    Select the ABHA Address you want to link
                                    with this account
                                </div>
                                <div className="list">
                                    <UsersList
                                        variant="typeTwo"
                                        username={
                                            yatriData?.abhaUserDetails?.fullName
                                        }
                                        users={
                                            yatriData?.abhaUserDetails
                                                ?.phrAddress || []
                                        }
                                        selectedUser={selectedUser}
                                        onSelectUser={setSelectedUser}
                                    />
                                </div>
                            </div>
                            <div className="separating-or">OR</div>
                            <div className="abha-address-manually">
                                <div className="manual-instruction">
                                    Enter the ABHA address manually
                                </div>
                                <TextField
                                    type="text"
                                    className="abha-address-field"
                                    label="ABHA Address"
                                    id="abhaAddress"
                                    name="abhaAddress"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.abhaAddress}
                                    error={!!formik.errors.abhaAddress}
                                    helperText={formik.errors.abhaAddress}
                                    placeholder="Enter your ABHA Address"
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="continue-button">
                        Continue
                    </button>
                    {confirmationModal && (
                        <CardBackdrop
                            setClose={() => setConfirmationModal(false)}
                        >
                            <LinkAbhaConfirmationModal updateStep={stepUpdate} closeModal={closeModal} />
                        </CardBackdrop>
                    )}
                </form>
            ) : step === 1 ? (
                <LinkViaAbhaNumber
                    abhaAddress={formik.values.abhaAddress || selectedUser}
                    goBack={comeBack}
                    moveAhead={moveAhead}
                    step={step}
                    setData={setOtpFormComponentData}
                    setRadioButtonValues={setRadioButtonValues}
                />
            ) : (
                <LinkAbhaViaAbhaNumberOtp
                    goBack={comeBack}
                    coming={'abhaAddress'}
                    abhaNumber={yatriData?.abhaUserDetails?.ABHANumber}
                    abhaAddress={formik.values.abhaAddress || selectedUser}
                    step={step}
                    data={otpFormData}
                    setData={setOtpFormComponentData}
                    radioButtonValues={radioButtonValues}
                />
            )}
        </>
    )
}

enum NumberType {
    AADHAR = 'aadhar',
    ABHA = 'abha',
}

export default RegisteredUserLinkAbha
