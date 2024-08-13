import './AccountSelectionForm.styles.scss'
import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import { Divider } from '@mui/material'
import { useState } from 'react'
import UsersList from '../../../../shared/UsersList/UsersList'
import { GetAllUserLinkedWithPhoneNumberResponseType } from '../../../../../interface/ApiResponseTypes'
import Footer from '../../../../shared/Footer/Footer'

function AccountSelectionForm({
    setSelection,
    updateStep,
    response,
}: AccountSelectionFormType) {
    const users = response?.users
    const [selectedUser, setSelectedUser] = useState<string>('')
    const handleSelection = (user: string) => {
        setSelectedUser(user)
        setSelection(user)
        updateStep(3)
    }

    return (
        <div className="account-selectionform-container">
            <div className="page-logo">
                <img
                    src={UttarakhandGovtLogo}
                    alt="Uttrakhand Simply Heaven!"
                />
                <Divider orientation="vertical" variant="middle" flexItem />
                <img
                    src={NhmLogo}
                    className="nhm-image"
                    alt="Uttrakhand Simply Heaven!"
                />
            </div>
            <div className="selection-form">
                <div className="selection-form-description">
                    <p>Choose an account</p>
                    <div className="phone-number-display">
                        <div className="phone-number-detail">
                            Phone Number - <span>{response?.mobileNumber}</span>
                        </div>
                        <a
                            href="#"
                            className="change-link"
                            onClick={() => updateStep(1)}
                        >
                            Change
                        </a>
                    </div>
                </div>
                <div className="selection-list-container">
                    <UsersList
                        users={users || []}
                        selectedUser={selectedUser}
                        onSelectUser={handleSelection}
                    />
                </div>
            </div>
            <Footer variant="typeTwo" />
        </div>
    )
}

interface AccountSelectionFormType {
    updateStep: (step: number) => void
    response?: GetAllUserLinkedWithPhoneNumberResponseType
    setSelection: (val: string) => void
}

export default AccountSelectionForm
