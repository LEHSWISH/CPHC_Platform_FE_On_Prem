import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../shared/Footer/Footer'
import Breadcrumb from '../../shared/breadCrumb/Breadcrumb'
import './index.scss'
import YatriDetails from '../Home/YatriDetails/YatriDetails'
import CareGiverRequestList from './careGiverRequestList/CareGiverRequestList'
import CaregiverDetails from './Caregiver-Details/CaregiverDetails'
import Nominator from './CareGiver-Nominator/Nominator'
import RequestListTileButton from './RequestListTileButton/RequestListTileButton'
import useAuthorizationStatus from '../../../utils/hooks/useAuthorizationStatus'
import careGiverAPI, {
    CareProviderAndRecipientListResponseType,
    ViewCareGiverRequestsApiResponseTypeItem,
} from '../../../services/api/careGiverAPI'
import { isAxiosError } from 'axios'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { useMediaQuery } from '@mui/material'

function Caregiver() {
    const isMobileView = useMediaQuery('(max-width:1024px)')
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isShowMobileRequestList, setIsShowMobileRequestList] =
        useState(false)
    const [careGiverRequests, setCareGiverRequests] = useState<
        ViewCareGiverRequestsApiResponseTypeItem[]
    >([])
    const [careProviderAndRecipientData, setCareProviderAndRecipientData] =
        useState<CareProviderAndRecipientListResponseType | null>(null)
    const isDataInitializedFirstTimeRef = useRef(false)

    const { isYatriAuthLoading, isYatriAuthorized } = useAuthorizationStatus()

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

    const refreshRequestStatusList = useCallback(() => {
        careGiverAPI
            .viewRequests()
            .then(res => {
                setCareGiverRequests(res.data.careGiverRequests)
            })
            .catch(errorCatch)
    }, [errorCatch])

    const refreshCareProviderAndRecipient = useCallback(() => {
        careGiverAPI
            .getCareProviderAndRecipient()
            .then(res => {
                setCareProviderAndRecipientData(res.data)
            })
            .catch(errorCatch)
    }, [errorCatch])

    const refreshAllStatus = useCallback(() => {
        refreshRequestStatusList()
        refreshCareProviderAndRecipient()
    }, [refreshCareProviderAndRecipient, refreshRequestStatusList])

    useEffect(() => {
        if (
            !isDataInitializedFirstTimeRef.current &&
            !isYatriAuthLoading &&
            isYatriAuthorized
        ) {
            refreshAllStatus()
        }
    }, [isYatriAuthLoading, isYatriAuthorized, refreshAllStatus])

    useEffect(()=>{
        if(!isMobileView){
            setIsShowMobileRequestList(false)
        }
    },[isMobileView])

    const isAlreadyAssignedCareGiver =
        !!careProviderAndRecipientData?.careGiver?.length
    const recipientCount =
        careProviderAndRecipientData?.careGiverRecipient?.length || 0

    return (
        <>
            <div className="care-giver-outer">
                <Breadcrumb
                    clickableListItems={[
                        {
                            label: 'eSwasthya Dham',
                            onClick: () => navigate(-1),
                        },
                        { label: 'Caregiver' },
                    ]}
                />

                {(!isShowMobileRequestList || !isMobileView) && (
                    <div className="care-giver-inner-container">
                        <div className="careGiver-innerLeft">
                            <div className="yatriCareGiver-leftUp-container">
                                <YatriDetails />
                            </div>

                            <div className="careGiver-leftDown-container">
                                <CaregiverDetails
                                    careProviderAndRecipientData={
                                        careProviderAndRecipientData
                                    }
                                    refreshAllStatus={refreshAllStatus}
                                />
                            </div>
                        </div>

                        <div className="careGiver-inner-right">
                            <div className="careGiver-innerrightUp">
                                <div className="heading-innerrightUp">
                                    <h1>Caregiver</h1>
                                </div>

                                <div className="paragraph">
                                    <p>
                                        Nominate your caregiver and experience
                                        personalized assistance throughout your
                                        Yatra.
                                    </p>
                                </div>
                            </div>

                            <div className="careGiver-inner-rightdown">
                                <div className="caregiver-nominator">
                                    <Nominator
                                        isAlreadyAssignedCareGiver={
                                            isAlreadyAssignedCareGiver
                                        }
                                        isCareRecipientExist={!!recipientCount}
                                    />
                                </div>

                                <div className="careGiver-request">
                                    <CareGiverRequestList
                                        careGiverRequests={careGiverRequests}
                                        refreshAllStatus={refreshAllStatus}
                                        isAlreadyAssignedCareGiver={
                                            isAlreadyAssignedCareGiver
                                        }
                                        recipientCount={recipientCount}
                                    />
                                </div>

                                <div
                                    className="caregiver-request-modal"
                                    onClick={() => {
                                        setIsShowMobileRequestList(true)
                                    }}
                                >
                                    <RequestListTileButton />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {isShowMobileRequestList && isMobileView && (
                    <CareGiverRequestList
                        careGiverRequests={careGiverRequests}
                        refreshAllStatus={refreshAllStatus}
                        isAlreadyAssignedCareGiver={isAlreadyAssignedCareGiver}
                        recipientCount={recipientCount}
                        onGoBackMobileView={() =>
                            setIsShowMobileRequestList(false)
                        }
                    />
                )}
                <Footer />
            </div>
        </>
    )
}

export default Caregiver
