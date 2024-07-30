import { IconButton, Menu, MenuItem } from '@mui/material'
import { useCallback, useState } from 'react'

import VectorGroup from '../../../../../assets/icons/VectorGroup.svg'
import Highrisk from '../../../../../assets/icons/HighRisk.svg'
import careGiverAPI, {
    CareRecipientItemType,
} from '../../../../../services/api/careGiverAPI'
import CardModal from '../../../../shared/CardModal/CardModal'
import ConfirmationModal from '../../../../modals/ConfirmationModal/ConfirmationModal'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import { switchToGuestUser } from '../../../../../services/store/slices/authSlice'
import {
    setFullPageLoader,
    setSnackBar,
} from '../../../../../services/store/slices/generalSlice'
import { isAxiosError } from 'axios'
import FailureModal from '../../../../modals/Failure/FailureModal'

const CareTakeeRowItem = ({
    recipientData,
    refreshAllStatus,
}: {
    recipientData: CareRecipientItemType
    refreshAllStatus: () => void
}) => {
    const dispatch = useAppDispatch()
    const [
        isShowRemoveRecipientConfirmationModal,
        setIsShowRemoveRecipientConfirmationModal,
    ] = useState(false)
    const [isShowSwitchConfirmationModal, setIsShowSwitchConfirmationModal] =
        useState(false)
    const [faliureModalData, setFaliureModalData] = useState<{
        headingText: string
        descriptionText: string
    } | null>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const errorCatch = useCallback(
        (err: unknown) => {
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
        },
        [dispatch],
    )

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event?.preventDefault()
        event?.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClickConfirmRemove = useCallback(() => {
        handleClose()
        setIsShowRemoveRecipientConfirmationModal(false)
        careGiverAPI
            .removeRecipient(recipientData.userName)
            .then(() => {
                //
            })
            .catch(err => {
                if (err?.response?.data?.code === 'USR040') {
                    setFaliureModalData({
                        headingText:
                            'High Risk Care Recipient cannot be Removed',
                        descriptionText:
                            'If you wish to remove this care recipient, kindly contact them to request removal from their list.',
                    })
                } else {
                    errorCatch(err)
                }
            })
            .finally(() => refreshAllStatus && refreshAllStatus())
    }, [errorCatch, recipientData.userName, refreshAllStatus])

    const handleSwitch = useCallback(() => {
        setIsShowSwitchConfirmationModal(false)
        careGiverAPI
            .getToken(recipientData.userName)
            .then(res => {
                dispatch(setFullPageLoader(true))
                dispatch(
                    switchToGuestUser({
                        token: res.data.token,
                        userName: recipientData.userName,
                    }),
                )
            })
            .catch(errorCatch)
    }, [dispatch, errorCatch, recipientData.userName])

    return (
        <>
            <div
                className="care-takee-card-1"
                onClick={() => setIsShowSwitchConfirmationModal(true)}
            >
                <div className="card-text-wrapper">
                    <p>{recipientData.fullName}</p>
                    <p>{recipientData.userName}</p>
                    <p>{recipientData.phoneNumber}</p>
                </div>
                <IconButton onClick={handleClick} className="three-dots">
                    <img src={VectorGroup} alt="vector-group-svg" />
                </IconButton>

                {recipientData?.status &&
                    [
                        'HIGH_RISK',
                        'HIGH_RISK_FIT_TO_TRAVEL',
                        'HIGH_RISK_NOT_FIT_TO_TRAVEL',
                    ].includes(recipientData?.status) && (
                        <div className="high-risk-svg">
                            <img src={Highrisk} alt="highrisk-svg" />
                        </div>
                    )}
            </div>
            <Menu
                id="care-giver-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        event.stopPropagation()
                        event.preventDefault()
                        setIsShowRemoveRecipientConfirmationModal(true)
                        handleClose()
                    }}
                >
                    Remove
                </MenuItem>
            </Menu>
            {isShowRemoveRecipientConfirmationModal && (
                <CardModal
                    setClose={() =>
                        setIsShowRemoveRecipientConfirmationModal(false)
                    }
                >
                    <ConfirmationModal
                        heading="Remove Care Recipient"
                        description={`Are you sure you want to remove “${recipientData.userName}” as your care recipient?`}
                        confirm="Remove"
                        cancel="Cancel"
                        onExit={() =>
                            setIsShowRemoveRecipientConfirmationModal(false)
                        }
                        onSave={handleClickConfirmRemove}
                    />
                </CardModal>
            )}
            {isShowSwitchConfirmationModal && (
                <CardModal
                    setClose={() => setIsShowSwitchConfirmationModal(false)}
                >
                    <ConfirmationModal
                        heading="Switch Profile"
                        description={`Do you want to switch Dashboard to view “${recipientData.userName}” details`}
                        confirm="Confirm"
                        cancel="Cancel"
                        onExit={() => setIsShowSwitchConfirmationModal(false)}
                        onSave={handleSwitch}
                    />
                </CardModal>
            )}
            {faliureModalData && (
                <FailureModal
                    headingText={faliureModalData?.headingText}
                    descriptionText={faliureModalData?.descriptionText}
                    setClose={() => setFaliureModalData(null)}
                />
            )}
        </>
    )
}

export default CareTakeeRowItem
