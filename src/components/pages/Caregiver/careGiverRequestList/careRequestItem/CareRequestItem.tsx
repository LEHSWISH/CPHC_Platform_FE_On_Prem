import { useCallback } from 'react'
import './careRequestItem.style.scss'
import careGiverAPI, {
    CareGiverRequestStatusPayloadType,
    ViewCareGiverRequestsApiResponseTypeItem,
} from '../../../../../services/api/careGiverAPI'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'

function CareRequestItem({
    requestItemData,
    refreshAllStatus,
    isAcceptDisabled,
}: {
    requestItemData: ViewCareGiverRequestsApiResponseTypeItem
    refreshAllStatus: () => void
    isAcceptDisabled: boolean
}) {
    const dispatch = useAppDispatch()

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

    const handleSubbmitStatus = useCallback(
        (status: CareGiverRequestStatusPayloadType) => () => {
            if (isAcceptDisabled && status === 'ACCEPT') {
                return
            }
            careGiverAPI
                .respondRequestStatus({
                    status,
                    userName: requestItemData.userName,
                })
                .then(() => {})
                .catch(errorCatch)
                .finally(() => refreshAllStatus && refreshAllStatus())
        },
        [
            errorCatch,
            isAcceptDisabled,
            refreshAllStatus,
            requestItemData.userName,
        ],
    )

    return (
        <div className="care-request-item-container">
            <div className="care-giver-request-main">
                <div className="care-giver-request-main-left">
                    <div className="care-giver-request-user-name">
                        <p>{requestItemData?.userName}</p>
                    </div>
                    <div className="care-giver-request-phone-number">
                        <p> +91 {requestItemData?.phoneNumber}</p>
                    </div>
                </div>
                <div className="care-giver-request-main-right">
                    <div className="care-giver-request-decline">
                        <div className="decline-button-div">
                            <button
                                className="decline-button"
                                onClick={handleSubbmitStatus('REJECT')}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                    <div className="care-giver-request-accept">
                        <div className="accept-button-div">
                            <button
                                className={`accept-button ${isAcceptDisabled ? 'disabled' : ''}`}
                                onClick={handleSubbmitStatus('ACCEPT')}
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="div-underline"> </div>
        </div>
    )
}

export default CareRequestItem
