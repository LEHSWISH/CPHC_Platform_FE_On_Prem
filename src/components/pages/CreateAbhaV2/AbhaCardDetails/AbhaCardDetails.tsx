import './AbhaCardDetails.styles.scss'
import Download from '../../../../assets/icons/download.svg'
import { useAppSelector } from '../../../../utils/hooks/useAppSelector'
// import { downloadFileFromLink } from '../../../../utils/HelperFunctions'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAbhaCardDetails } from '../../../../services/store/slices/yatriSlice'
import AbhaCardLoader from '../../../shared/AbhaCardCreateLoader/AbhaCardLoader'
import { fetchAbhaCard, fetchAbhaCardPdf, getUnlinkedCareContextApi, syncMedicalRecordsWithAbhaApi } from '../../../../services/api'
import BackButtonWithTitle from '../../../shared/BackButtonWithTitle'
import { convertBase64ToFile, convertBase64ToImage } from '../../../../utils/HelperFunctions'
import YellowCaution from '../../../../assets/icons/YellowCaution.svg'
import { GetUnlinkedCareContextResponseType } from '../../../../interface/ApiResponseTypes'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../services/store/slices/generalSlice'
import CardBackdrop from '../../../shared/CardBackdrop/CardBackdrop'
import SyncRecordsSuccessModal from '../../uploadCertificateV2/SyncRecordsModals/SyncRecordsSuccessModal/SyncRecordsSuccessModal'

function AbhaCardDetails() {
    const dispatch = useDispatch()
    const abhaCardDetails = useAppSelector(s => s.yatri.abhaCardDetails)
    const yatriAllDetails = useAppSelector(s => s.yatri.yatriAllDetails)
    const imageFetchTriedCountRef = useRef(0)
    const pdfFetchTriedCountRef = useRef(0)
    const imageFetchTimerRef = useRef<number | null>(null)
    const pdfFetchTimerRef = useRef<number | null>(null)
    const [syncRecordsSuccess, setSyncRecordsSuccess] = useState<boolean>(false)
    const [unlinkedCareContextData, setUnlinkedCareContextData] = useState<GetUnlinkedCareContextResponseType[]>([])

    const savedDocumentsPath = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.documentsPath,
    )

    const fetchImageFlow = useCallback(
        (isUseDelay: boolean) => {
            imageFetchTimerRef.current = setTimeout(
                () => {
                    imageFetchTriedCountRef.current += 1
                    fetchAbhaCard(
                        isUseDelay
                            ? {
                                  authType: 'v2',
                              }
                            : {},
                    )
                        .then(response => {
                            const abhaCardImage=convertBase64ToImage(response.data.fileBase64,'test','image/png')
                            dispatch(
                                setAbhaCardDetails({
                                    abhaCardImage: abhaCardImage,
                                }),
                            )
                        })
                        .catch(
                            () =>
                                imageFetchTriedCountRef.current < 5 &&
                                fetchImageFlow(true),
                        )
                },
                isUseDelay ? 5000 : 0,
            )
        },
        [dispatch],
    )

    useEffect(() => {
        if (
            abhaCardDetails?.abhaCardImage ||
            !(
                imageFetchTriedCountRef.current < 5 &&
                imageFetchTimerRef.current === null
            )
        ) {
            return
        } else {
            fetchImageFlow(false)
        }
        return () => {
            if (imageFetchTimerRef.current !== null) {
                clearTimeout(imageFetchTimerRef.current)
                imageFetchTimerRef.current = null
            }
        }
    }, [abhaCardDetails, dispatch, fetchImageFlow])

    const fetchPdfFlow = useCallback(
        (isUseDelay: boolean) => {
            pdfFetchTimerRef.current = setTimeout(
                () => {
                    pdfFetchTriedCountRef.current += 1
                    fetchAbhaCardPdf(
                        isUseDelay
                            ? {
                                  authType: 'v2',
                              }
                            : {},
                    )
                        .then(response => {
                            dispatch(
                                setAbhaCardDetails({
                                    abhaCardPdfUrl:
                                        response?.data?.fileBase64,
                                }),
                            )
                        })
                        .catch(
                            () =>
                                pdfFetchTriedCountRef.current < 5 &&
                                fetchPdfFlow(true),
                        )
                },
                isUseDelay ? 5000 : 0,
            )
        },
        [dispatch],
    )

    useEffect(() => {
        if (
            abhaCardDetails?.abhaCardPdfUrl ||
            !(
                pdfFetchTriedCountRef.current < 5 &&
                pdfFetchTimerRef.current === null
            )
        ) {
            return
        } else {
            fetchPdfFlow(false)
        }
        return () => {
            if (pdfFetchTimerRef.current !== null) {
                clearTimeout(pdfFetchTimerRef.current)
                pdfFetchTimerRef.current = null
            }
        }
    }, [abhaCardDetails, dispatch, fetchPdfFlow])

    useEffect(() => {
        getUnlinkedCareContextApi()
            .then(res => {
                setUnlinkedCareContextData(res?.data)
            })
            .catch(err => {
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
            })
    }, [dispatch])

    const handleSync = async (event: React.MouseEvent<HTMLElement>) => {
        event?.preventDefault()
        try {
            await Promise.all(
                unlinkedCareContextData.map(async careContext => {
                    const documentsPathEntity =
                        savedDocumentsPath?.filter(path =>
                            careContext.documentPathId.find(
                                docString => path.id === docString,
                            ),
                        ) || []

                    const syncPayload = {
                        visitPurpose: careContext.documentsDescription,
                        documentsPathEntity,
                        documentType: careContext.hiType,
                        careContextId: careContext.id,
                    }

                    return syncMedicalRecordsWithAbhaApi(syncPayload)
                }),
            )
            setUnlinkedCareContextData([])
            setSyncRecordsSuccess(true)
        } catch (err) {
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
        }
    }


    const navigate = useNavigate()
    return (
        <>
            {!abhaCardDetails?.abhaCardImage?.length ? (
                <div className="abha-card-details-container">
                    <div className="abha-card-details-left">
                        <div className="abha-card-details">
                            <div className="greeting-message">
                                {`Hi, ${yatriAllDetails.data?.yatriDetails?.fullName}`}
                            </div>
                            <div className="created-message">
                                Congratulations! Your ABHA (Ayushman Bharat
                                Health Account) card has been created
                                successfully.
                            </div>
                            <div className="loader1">
                                <div className="circular-task-component">
                                    <AbhaCardLoader />
                                </div>
                                <div className="loader1-heading">
                                    It's taking longer than usual to get your
                                    ABHA card. We’ll notify you once generated
                                </div>
                            </div>

                            <div className="modify-button-center">
                                <button
                                    className="goto-homepage-button"
                                    onClick={() =>
                                        navigate(coreRoutesEnum.HOME)
                                    }
                                >
                                    Go to Homepage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="abha-card-details-container-second-screen">
                    <div className="abha-card-details-left-second-screen">
                        <div className="abha-card-details-second-screen">
                            <div className="abha-card-mobile-header">
                                <div className="home-button-mobile">
                                    <BackButtonWithTitle
                                        backButtonChildElement={
                                            <span className="backbutton">
                                                Home
                                            </span>
                                        }
                                        onBack={() => {
                                            navigate(`${coreRoutesEnum.HOME}`)
                                        }}
                                    />
                                </div>
                                <span className="abha-card-title">ABHA</span>
                            </div>
                            <div className="greeting-message-second-screen">
                                {`Hi, ${yatriAllDetails.data?.yatriDetails?.fullName}`}
                            </div>
                            <div className="created-message-second-screen">
                                Congratulations! Your ABHA (Ayushman Bharat
                                Health Account) card has been created
                                successfully.
                            </div>
                            {unlinkedCareContextData?.length ? (
                                <div className="sync-records-container">
                                    <div className="sync-records-logo">
                                        <img
                                            src={YellowCaution}
                                            alt="caution-logo"
                                        />
                                    </div>
                                    <div className="sync-text-container">
                                        <p className="sync-title">
                                            Sync medical records with ABHA
                                        </p>
                                        <p className="sync-message">
                                            Sync your medical records with ABHA
                                            for access across various government
                                            registered health apps.
                                        </p>
                                    </div>
                                    <div className="sync-button-container">
                                        <span
                                            className="sync-link"
                                            onClick={handleSync}
                                        >
                                            Sync Now
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            {syncRecordsSuccess && (
                                <CardBackdrop
                                    setClose={() =>
                                        setSyncRecordsSuccess(false)
                                    }
                                >
                                    <SyncRecordsSuccessModal />
                                </CardBackdrop>
                            )}
                            <div className="download-buttons-second-screen">
                                <a
                                    target="_blank"
                                    download
                                    className="download-links-second-screen"
                                    onClick={() => {
                                        convertBase64ToFile(abhaCardDetails?.abhaCardPdfUrl,'abha-card','application/pdf')
                                    }}
                                >
                                    Download PDF
                                    <img src={Download} alt="download-icon" />
                                </a>
                                <a
                                    href={abhaCardDetails?.abhaCardImage}
                                    download
                                    className="download-links-second-screen"
                                    target="_blank"
                                    // onClick={() => {
                                    //     downloadFileFromLink(
                                    //         'name',
                                    //         abhaCardDetails?.abhaCardImage ||
                                    //             '',
                                    //     )
                                    // }}
                                >
                                    Download Image
                                    <img src={Download} alt="download-icon" />
                                </a>
                            </div>
                            <div className="modify-button-center-second-screen">
                                <button
                                    className="goto-homepage-button-second-screen"
                                    onClick={() =>
                                        navigate(coreRoutesEnum.HOME)
                                    }
                                >
                                    Go to Homepage
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="abha-card-details-right-second-screen">
                        <div className="abha-card-container-second-screen">
                            <img
                                src={`${abhaCardDetails?.abhaCardImage}`}
                                alt="abha-card-back"
                            />
                            <div className="go-to-button-mobile-container">
                                <button
                                    className="goto-homepage-button-mobile"
                                    onClick={() =>
                                        navigate(coreRoutesEnum.HOME)
                                    }
                                >
                                    Go to Homepage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AbhaCardDetails
