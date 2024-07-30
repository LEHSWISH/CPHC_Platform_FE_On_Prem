import { useCallback, useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import careGiverAPI, {
    CareProviderAndRecipientListResponseType,
} from '../../../../../services/api/careGiverAPI'
import './CareGiver.scss'
import HearHandShake from '../../../../../assets/icons/heart-handshake.svg'
import VectorGroup from '../../../../../assets/icons/VectorGroup.svg'
import ConfirmationModal from '../../../../modals/ConfirmationModal/ConfirmationModal'
import CardModal from '../../../../shared/CardModal/CardModal'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'

function CareGiver({
    careProviderAndRecipientData,
    refreshAllStatus,
}: {
    careProviderAndRecipientData: CareProviderAndRecipientListResponseType
    refreshAllStatus: () => void
}) {
    const dispatch = useAppDispatch()
    const [isShowConfirmationModal, setIsShowConfirmationModal] =
        useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

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

    const handleClickConfirmRemove = useCallback(() => {
        handleClose()
        setIsShowConfirmationModal(false)
        careGiverAPI
            .removeCareProvider()
            .then(() => {
                //
            })
            .catch(errorCatch)
            .finally(() => refreshAllStatus && refreshAllStatus())
    }, [errorCatch, refreshAllStatus])

    return (
        <>
            <div className="care-giver-parent">
                <div className="parent-3dots">
                    <IconButton onClick={handleClick} className="three-dots">
                        <img src={VectorGroup} alt="vector-group-svg" />
                    </IconButton>
                </div>
                <Menu
                    id="care-giver-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => setIsShowConfirmationModal(true)}>
                        Remove
                    </MenuItem>
                </Menu>

                <div className="child-1-1">
                    <div className="heart-hand-logo">
                        <img src={HearHandShake} alt="" />
                    </div>
                    <div className="text">
                        <div className="title">
                            <p> My Caregiver </p>
                        </div>
                        <div className="heading-description">
                            <p>Below are your caregiver details</p>
                        </div>
                    </div>
                </div>

                <div className="child-2-2-details">
                    <div className="name-details">
                        <div>
                            <p>Name</p>
                        </div>
                        <div>
                            <p>
                                {
                                    careProviderAndRecipientData.careGiver?.[0]
                                        ?.fullName
                                }
                            </p>
                        </div>
                    </div>
                    <div className="username-details">
                        <div>
                            <p>UserName</p>
                        </div>
                        <div>
                            <p>
                                {
                                    careProviderAndRecipientData.careGiver?.[0]
                                        ?.userName
                                }
                            </p>
                        </div>
                    </div>
                    <div className="phonenumber-details">
                        <div>
                            <p>Phone number</p>
                        </div>
                        <div>
                            <p>
                                XXXXXX
                                {careProviderAndRecipientData.careGiver?.[0]?.phoneNumber?.slice(
                                    -4,
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {isShowConfirmationModal && (
                <CardModal setClose={() => setIsShowConfirmationModal(false)}>
                    <ConfirmationModal
                        heading="Remove Caregiver"
                        description={`Are you sure you want to remove ”${careProviderAndRecipientData.careGiver?.[0]?.userName}” as your Caregiver?`}
                        confirm="Remove"
                        cancel="Cancel"
                        onExit={() => setIsShowConfirmationModal(false)}
                        onSave={handleClickConfirmRemove}
                    />
                </CardModal>
            )}
        </>
    )
}

export default CareGiver
