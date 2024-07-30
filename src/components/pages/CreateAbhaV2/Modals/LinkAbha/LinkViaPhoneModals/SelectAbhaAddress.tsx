import { useEffect, useState } from 'react'
import './SelectAbhaAddress.styles.scss'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import backNavigate from '../../../../../../assets/icons/backNavigate.svg'
import { NavLink } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import UsersListDetailed from '../../../../../shared/UsersList/UserListDetailed'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import AbhaAddressConfirmation from './AbhaAddressConfirmation'

function SelectAbhaAddress(props: SelectAbhaAddressPropType) {
    const [transformedData, setTransformedData] = useState()
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [abhaNumber, setAbhaNumber] = useState<string>('')
    const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
    const [selectErrorMessage, setSelectErrorMessage] = useState<string>('')

    const [confirmationModalData, setConfirmationModalData] =
        useState<AbhaAddressConfirmationDataType>({
            txnId: '',
            abhaToken: '',
            ABHANumber: '',
        })

    const handleLinking = (event: any) => {
        event.preventDefault()
        if (!selectedUser) {
            setSelectErrorMessage(
                'Please select one ABHA number before proceeding.',
            )
        } else {
            setSelectErrorMessage('')
            setConfirmationModal(true)
            setConfirmationModalData({
                txnId: props.responseData?.txnId,
                abhaToken: props.responseData?.token,
                ABHANumber: abhaNumber,
            })
        }
    }

    useEffect(() => {
        const transformed = props.responseData.accounts.map((data: any) => {
            return ({
                primaryData: data.name,
                secondaryData: data.preferredAbhaAddress,
                extraData: data.ABHANumber,
                profilePhoto:data.profilePhoto,
            })
        })
        setTransformedData(transformed)
    }, [props.responseData])

    return (
        <>
            <div className="abha-address-selection-container">
                <div className="address-selection-head">
                    <img
                        src={arrowLeftSvgIcon}
                        alt="back"
                        onClick={props.navigate}
                    />
                    <div className="back-btn" onClick={props.navigate}>
                        <img src={backNavigate} alt="back" />
                        <div>
                            <span>Back</span>
                        </div>
                    </div>
                    <span>Select ABHA Address</span>
                </div>
                <div className="address-selection-body">
                    <form>
                        <div className="address-selection-inner-container">
                            <div className="address-selection-heading">
                                Select the ABHA address you want to link with
                                this account.
                            </div>
                            <div className="address-list">
                                <UsersListDetailed
                                    users={transformedData || []}
                                    selectedUser={selectedUser}
                                    onSelectUser={setSelectedUser}
                                    extraDataOnSelectUser={setAbhaNumber}
                                />
                            </div>
                        </div>
                        <div className="select-error-message">
                            {selectErrorMessage}
                        </div>
                        <button
                            className="link-button"
                            type="submit"
                            onClick={handleLinking}
                        >
                            Link
                        </button>
                        <div className="existing-abha-number">
                            <span className="abha-text">
                                Don't have ABHA?
                            </span>
                            <NavLink
                                to={`/${coreRoutesEnum.CREATE_ABHA}`}
                                className="link-abha"
                            >
                                Create ABHA
                            </NavLink>
                        </div>
                    </form>
                </div>
            </div>
            {confirmationModal && (
                <CardBackdrop setClose={() => setConfirmationModal(false)}>
                    <AbhaAddressConfirmation data={confirmationModalData} />
                </CardBackdrop>
            )}
        </>
    )
}

export interface AbhaAddressConfirmationDataType {
    txnId: string | number
    abhaToken: string | number
    ABHANumber: string | number
}

interface SelectAbhaAddressPropType {
    responseData: any
    navigate: () => void
}

export default SelectAbhaAddress
