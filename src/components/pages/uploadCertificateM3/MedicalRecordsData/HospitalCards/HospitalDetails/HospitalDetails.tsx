import './HospitalDetails.scss'
import Footer from '../../../../../shared/Footer/Footer'
import HipData from './hipData/HipData'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import linkMedicalRecords from '../../../../../../services/api/linkMedicalRecordsM3'
import { extractAttachmentByFhirBundleResponse } from '../../../../../../utils/FHIRBundleHelper'
import useAuthorizationStatus from '../../../../../../utils/hooks/useAuthorizationStatus'
import { useLocation } from 'react-router-dom'
import FullPageLoader from '../../../../../shared/FullPageLoader'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'
import Breadcrumb from '../../../../../shared/breadCrumb/Breadcrumb'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import NoDocumentsLinked from '../../../../../shared/NoDocumentsLinked/NoDocumentsLinked'
function HospitalDetails() {
    const [hipData, setHipData] = useState<HipData[]>()
    const { isYatriAuthLoading, isYatriAuthorized } = useAuthorizationStatus()
    const isDataInitializedFirstTimeRef = useRef(false)
    const { state } = useLocation()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        if (
            !isDataInitializedFirstTimeRef.current &&
            !isYatriAuthLoading &&
            isYatriAuthorized
        ) {
            isDataInitializedFirstTimeRef.current = true
            setIsLoading(true)
            linkMedicalRecords
                .getFhirBundle(state.hipId)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        const data: object[] = []
                        res?.data?.forEach((bundle: any) => {
                            if (bundle.content) {
                                try {
                                    const processedData3 =
                                        extractAttachmentByFhirBundleResponse(
                                            JSON.parse(bundle.content),
                                        )

                                    processedData3.documentReferenceAttachmentList?.forEach(
                                        res => {
                                            data.push(res)
                                        },
                                    )
                                    processedData3.binaryAttachmentList?.forEach(
                                        res => {
                                            data.push(res)
                                        },
                                    )
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        })
                        setHipData(data as HipData[])
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [isYatriAuthLoading, isYatriAuthorized, state])

    const navigate = useNavigate()

    const backBtn = () => {
        navigate(-1)
    }
    return (
        <>
            <div className="hospitals-details-parent">
                <Breadcrumb
                    clickableListItems={[
                        {
                            label: 'eSwasthya Dham',
                            onClick: () => navigate(`/${coreRoutesEnum.HOME}`),
                        },
                        {
                            label: 'Medical Records',
                            onClick: () =>
                                navigate(`/${coreRoutesEnum.MEDICAL_RECORDS}`),
                        },
                        {
                            label: state.hipName,
                        },
                    ]}
                />
                <div className="left-child">
                    <div className="back-button-mobile-div">
                        <BackButtonWithTitle
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                            onBack={backBtn}
                        />
                    </div>
                    <span className="hospital-title">{state.hipName}</span>
                </div>
                {hipData?.length ? (
                    hipData?.map((res, i) => {
                        return (
                            <>
                                <HipData hipData={res} i={i} key={i} />
                            </>
                        )
                    })
                ) : !isLoading ? (
                    <NoDocumentsLinked />
                ) : (
                    <></>
                )}
                {isLoading && <FullPageLoader />}
            </div>
            <Footer />
        </>
    )
}
interface HipData {
    contentType: string
    creation?: string
    data?: string
    language?: string
    title?: string
}
export default HospitalDetails
