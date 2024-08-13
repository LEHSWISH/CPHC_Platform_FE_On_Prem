import { useCallback, useEffect, useRef, useState } from 'react'
import './FetchCertificates.scss'
import FetchDocuments from './FetchDocuments/FetchDocuments'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import MedicalRecordsData from './MedicalRecordsData/MedicalRecordsData'
import MedicalRecordRequestSent from './MedicalRecordRequestSent/MedicalRecordRequestSent'
import LinkedMedicalRecords from './LinkedMedicalRecords/LinkedMedicalRecords'
import linkMedicalRecords from '../../../services/api/linkMedicalRecordsM3'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import useAuthorizationStatus from '../../../utils/hooks/useAuthorizationStatus'
function FetchCertificates() {
    const [showFetchDocuments, setShowFetchDocuments] = useState<boolean>(false)
    const [documents, setDocuments] = useState<boolean>(false)
    const [hipData, setHipData] = useState()
    const [loader, setLoader] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const [btnperform, setBtnperform] = useState<boolean>(false)
    const { isYatriAuthLoading, isYatriAuthorized } = useAuthorizationStatus()
    const isDataInitializedFirstTimeRef = useRef(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const getData = useCallback((userInitiated = false) => {
        if (userInitiated) {
            setIsRefreshing(true);
        } else {
            setLoader(true)
        }
        linkMedicalRecords.getConsentDb({}).then((res: any) => {
            if (!res.data.length) {
                setShowFetchDocuments(true)
            }
            if (res.data.length) {
                const ids: string[] = []
                const initiatedIds: string[] = []
                res.data.forEach((res: any) => {
                    if (res.status === 'GRANTED') {
                        ids.push(res.id)
                    }
                    if (res.status === 'INITIATED') {
                        initiatedIds.push(res.id)
                    }
                })
                if (!ids.length && initiatedIds.length) {
                    setDocuments(true)
                }
                linkMedicalRecords.getConsentWithId({ consentIds: ids }).then((res: any) => {
                    setHipData(res.data)
                    setIsRefreshing(false)
                    setLoader(false)
                }).catch(() => {
                    setIsRefreshing(false)
                    setLoader(false)
                })

            }
        }).catch(() => {
            setShowFetchDocuments(true)
            dispatch(
                setSnackBar({
                    open: true,
                    message: 'Something went wrong, please  refresh again.',
                    severity: 'error',
                }),
            )
        })
    }, [dispatch])
    useEffect(() => {
        if (
            !isDataInitializedFirstTimeRef.current &&
            !isYatriAuthLoading &&
            isYatriAuthorized
        ) {
            isDataInitializedFirstTimeRef.current = true
            getData()
        }
    }, [getData, isYatriAuthLoading, isYatriAuthorized])


    return (
        <>
            {showFetchDocuments ? (
                <>
                    <MedicalRecordRequestSent setBtnperform={setBtnperform} />
                    {btnperform && (
                        <CardBackdrop setClose={() => { setBtnperform(false) }}>
                            <FetchDocuments setBtnPerform={setBtnperform} closeModal={() => {
                                setBtnperform(false)
                                getData()
                            }} />
                        </CardBackdrop>
                    )}
                </>
            ) : (
                <>
                    {documents ? (
                        <LinkedMedicalRecords />
                    ) : (
                        <div className="medicals-record">
                            <MedicalRecordsData data={hipData} loaderState={loader} refresh={isRefreshing} refreshData={getData} />
                        </div>
                    )}

                    {/* <div className="medical-record-buttons">
                        <button className="view-medical-declaration-button">
                            View Medical Declaration
                        </button>
                        <button className="fetch-documents-button">
                            Fetch Documents
                        </button>
                    </div> */}
                </>
            )}
        </>
    )



}

export default FetchCertificates
