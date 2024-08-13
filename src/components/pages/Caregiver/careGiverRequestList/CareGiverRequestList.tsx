import { useState } from 'react'
import './careGiverRequestList.style.scss'
import CareRequestItem from './careRequestItem/CareRequestItem'
import BackButtonWithTitle from '../../../shared/BackButtonWithTitle'
import { ViewCareGiverRequestsApiResponseTypeItem } from '../../../../services/api/careGiverAPI'
import InfoBox from './infoBox/InfoBox'

function CareGiverRequestList({
    careGiverRequests,
    refreshAllStatus,
    isAlreadyAssignedCareGiver,
    recipientCount,
    onGoBackMobileView,
}: {
    careGiverRequests: ViewCareGiverRequestsApiResponseTypeItem[]
    refreshAllStatus: () => void
    isAlreadyAssignedCareGiver: boolean
    recipientCount: number
    onGoBackMobileView?: () => void
}) {
    const [
        isShowAlreadyAssignedCareGiverInfo,
        setIsShowAlreadyAssignedCareGiverInfo,
    ] = useState(true)
    const [isShowRecipientCountInfo, setIsShowRecipientCountInfo] =
        useState(true)
    const [isShowRequestCountInfo, setIsShowRequestCountInfo] = useState(true)

    const close = () => {
        onGoBackMobileView && onGoBackMobileView()
    }

    const isAcceptDisabled = isAlreadyAssignedCareGiver || recipientCount > 1

    return (
        <div className="care-giver-request">
            <div className="care-giver-request-title">
                {!careGiverRequests?.length ? (
                    <>
                        <div className="button">
                            <BackButtonWithTitle
                                titleElement={''}
                                onBack={close}
                            />
                        </div>
                        <h1>Caregiver Requests</h1>
                    </>
                ) : (
                    <>
                        <div className="button">
                            <BackButtonWithTitle
                                titleElement={''}
                                onBack={close}
                            />
                        </div>
                        Care Recipient Requests
                        {!!careGiverRequests?.length &&
                            ` (${careGiverRequests.length})`}
                    </>
                )}
            </div>
            {!careGiverRequests?.length ? (
                <div className="no-req">
                    <h1>No requests to list</h1>
                </div>
            ) : (
                <div className="care-given-main">
                    {isShowRecipientCountInfo &&
                        recipientCount > 1 &&
                        careGiverRequests.length && (
                            <InfoBox
                                descriptionText='Limit of 2 care recipients reached. Please remove your care recipient to accept a new request.'
                                onClose={() => {
                                    setIsShowRecipientCountInfo(false)
                                }}
                            />
                        )}
                    {isShowRequestCountInfo &&
                        careGiverRequests?.length > 14 && (
                            <InfoBox
                                titleText={`Limit alert: ${careGiverRequests?.length} of 20 care recipient requests`}
                                descriptionText="To receive new requests, you’ll need to manage your current ones."
                                onClose={() => {
                                    setIsShowRequestCountInfo(false)
                                }}
                            />
                        )}
                    {isShowAlreadyAssignedCareGiverInfo &&
                        isAlreadyAssignedCareGiver && (
                            <InfoBox
                                descriptionText='To accept a caregiver request, you must first remove your current assigned caregiver'
                                onClose={() =>
                                    setIsShowAlreadyAssignedCareGiverInfo(false)
                                }
                            />
                        )}
                    {careGiverRequests.map(requestItemData => {
                        return (
                            <CareRequestItem
                                key={requestItemData?.userName}
                                requestItemData={requestItemData}
                                refreshAllStatus={refreshAllStatus}
                                isAcceptDisabled={isAcceptDisabled}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
export default CareGiverRequestList
