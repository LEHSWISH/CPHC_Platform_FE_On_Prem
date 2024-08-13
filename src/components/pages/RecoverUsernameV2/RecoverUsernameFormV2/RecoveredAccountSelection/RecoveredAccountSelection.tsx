import './RecoveredAccountSelection.styles.scss'

import UttarakhandGovtLogo from '../../../../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo from '../../../../../assets/icons/NhmLogo1.svg'
import { CircularProgress, Divider } from '@mui/material'
import Footer from '../../../../shared/Footer/Footer'
import { useState } from 'react'
import UsersList from '../../../../shared/UsersList/UsersList'

function RecoveredAccountSelection(props: RecoveredAccountSelectionPropsType) {
    const [isLoading] = useState<boolean>(false)
    const users = ['rinz01', 'rinz02', 'rinz03', 'rinz04']
    const [selectedUser, setSelectedUser] = useState<string>('')
    const handleSelection = (user: string) => {
        // Logic here
        setSelectedUser(user)
        props.updateStep(3)
    }

    return (
        <div className="account-selection-container">
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
            <div className="selection-list-container">
                <div className="selection-list-description">
                    <h2>Choose an account</h2>
                    <p>
                        Choose your account and we will redirect you to log in.
                    </p>
                </div>
                <UsersList
                        users={users}
                        selectedUser={selectedUser}
                        onSelectUser={handleSelection}
                    />
                <button
                    className="login-button"
                    type="submit"
                    disabled={isLoading}
                >
                    Go to Log in &nbsp;
                    {isLoading && (
                        <CircularProgress
                            color="inherit"
                            variant="indeterminate"
                            size={'1em'}
                        />
                    )}
                </button>
            </div>
            <Footer />
        </div>
    )
}

interface RecoveredAccountSelectionPropsType {
    updateStep: (step: number) => void
}

export default RecoveredAccountSelection
