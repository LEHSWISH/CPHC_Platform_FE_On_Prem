import {
    ChangeEvent,
    DragEvent,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Button, FormHelperText, IconButton } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import './uploadCertificate.styles.scss'
import YellowCaution from '../../../assets/icons/YellowCaution.svg'
import { getUnlinkedCareContextApi, syncMedicalRecordsWithAbhaApi, updateYatriDetailsApi } from '../../../services/api'
import uploadMedicalCertificateAPI from '../../../services/api/uploadMedicalCertificateAPI'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import CardBackdrop from '../../shared/CardBackdrop/CardBackdrop'
import downloadSvgIcon from '../../../assets/icons/download.svg'
import { GetMedicalUploadPreSignedUrlResponseType, GetUnlinkedCareContextResponseType } from '../../../interface/ApiResponseTypes'
import VisuallyHiddenFileInput from '../../shared/VisuallyHiddenInput'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import Medical_Certificate from '../../../assets/Medical_Certificate.pdf'
import { loadYatriAllData } from '../../../services/store/slices/yatriSlice'
import { FileDetailsType } from '../../../interface/medicalCertificate/FileDetailsType'
import ChangesSaved from '../../modals/changesSaved/ChangesSaved'
import UploadDetailsForm, {
    UploadDetailsFormDataType,
} from './uploadDetailsForm/UploadDetailsForm'
import UploadCameraFileIcon from '../../../assets/icons/camera 1.svg'
import ImportFile from '../../../assets/icons/ImportFileFrame.svg'
import FullPageLoader from '../../shared/FullPageLoader'
import FileInfoRowItemV2 from './FileInfoRowItemV2'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import { convertFiletoBase64String } from '../../../utils/HelperFunctions'
import SyncRecordsLinkAbhaModal from './SyncRecordsModals/SyncRecordsLinkAbhaModal/SyncRecordsLinkAbhaModal'
import { isAxiosError } from 'axios'
import SyncRecordsSuccessModal from './SyncRecordsModals/SyncRecordsSuccessModal/SyncRecordsSuccessModal'

const MAX_FILE_SIZE_TO_UPLOAD_IN_MB = 10
const MAX_FILE_NUMBER_TO_KEEP_SAVED = 20

const ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png', 'pdf']

enum FileDetailsActionType {
    ADD = 'ADD',
    DELETE = 'DELETE',
    CLEAR = 'CLEAR',
}

function reducer(
    state: FileDetailsType[],
    action: {
        fileName?: string
        type: FileDetailsActionType
        fileDetail?: FileDetailsType
    },
): FileDetailsType[] {
    switch (action.type) {
        case FileDetailsActionType.ADD: {
            const newList: FileDetailsType[] = [...state]
            if (action.fileDetail) {
                newList.push(action.fileDetail)
            }
            return newList
        }
        case FileDetailsActionType.DELETE:
            return state.filter(res => res.fileName !== action.fileName)
        case FileDetailsActionType.CLEAR:
            return []
        default:
            return state
    }
}

const UploadCertificate = ({
    setIsShowTabs,
    isShowTabs,
    setIsShowMedicalDeclarationModal,
}: {
    setIsShowTabs: (state: boolean) => void
    isShowTabs: boolean
    setIsShowMedicalDeclarationModal: (state: boolean) => void
}) => {
    const dispatch = useDispatch()
    const isAllowedToUpdateFilesSavedListRef = useRef(true)
    const [isLoading, setIsLoading] = useState(false)
    const [filesToBeUploadedList, dispatchReducer] = useReducer(
        reducer,
        [] as FileDetailsType[],
    )
    const [filesSavedList, setFilesSavedList] = useState<FileDetailsType[]>([])
    const [validationMessage, setValidationMessage] = useState('')
    const [isShowSuccessModal, setIsShowSuccessModal] = useState(false)
    const [linkAbhaModal, setLinkAbhaModal] = useState<boolean>(false)
    const [syncRecordsSuccess, setSyncRecordsSuccess] = useState<boolean>(false)
    const [unlinkedCareContextData, setUnlinkedCareContextData] = useState<GetUnlinkedCareContextResponseType[]>([])

    const savedDocumentsPath = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.documentsPath,
    )

    const isYatriDetailsLoading = useAppSelector(
        s => s.yatri.yatriAllDetails.loading,
    )

    const phoneNumber = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.phoneNumber,
    )

    const isYatriAuthLoading = useAppSelector(s => s.auth.yatri.loading)
    const medicalsReports = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.medicalsReports,
    )

    const abhaDetails = useAppSelector(s => s.yatri.yatriAllDetails.data?.abhaUserDetails)

    useEffect(() => {
        if (
            !isYatriAuthLoading &&
            !isYatriDetailsLoading &&
            medicalsReports === null
        ) {
            setIsShowMedicalDeclarationModal(true)
        }
    }, [
        isYatriDetailsLoading,
        isYatriAuthLoading,
        medicalsReports,
        setIsShowMedicalDeclarationModal,
    ])

    useEffect(() => {
        if (
            !isYatriDetailsLoading &&
            savedDocumentsPath?.length &&
            isAllowedToUpdateFilesSavedListRef.current
        ) {
            const savedDocumentsPathCopy = [
                ...(savedDocumentsPath?.map(o => ({
                    isFileOnLocal: false,
                    isFileToBeDeleted: false,
                    createdOn: o?.createdOn ? new Date(o.createdOn) : undefined,
                    filePath: o?.filePath,
                    fileName: o.fileName,
                })) ?? []),
            ]
            savedDocumentsPathCopy.sort((a, b) => {
                if (!a?.createdOn || !b?.createdOn) {
                    return 0
                }
                return a.createdOn?.getTime() < b.createdOn?.getTime()
                    ? 1
                    : a.createdOn?.getTime() > b.createdOn?.getTime()
                      ? -1
                      : 0
            })
            setFilesSavedList(savedDocumentsPathCopy)
            isAllowedToUpdateFilesSavedListRef.current = false
        }
    }, [isYatriDetailsLoading, savedDocumentsPath])

    const dropHandler = (ev: DragEvent<HTMLDivElement>) => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault()
        ev.dataTransfer.items
            ? [...ev.dataTransfer.items].forEach(item => {
                  // Use DataTransferItemList interface to access the file(s)
                  if (item.kind === 'file') {
                      // If dropped items aren't files, reject them
                      const file = item.getAsFile()
                      file && selectFileToUpload(file)
                  }
              })
            : [...ev.dataTransfer.files].forEach(file => {
                  // Use DataTransfer interface to access the file(s)
                  file && selectFileToUpload(file)
              })
    }

    const handleFileInputByBrowse = (ev: ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault()
        ev.target.files?.length
        for (let i = 0; i < (ev.target.files?.length || 0); i++) {
            const file = ev.target?.files?.item(i)
            file && selectFileToUpload(file)
        }
    }

    const selectFileToUpload = (file: File) => {
        if (file && validateFile(file)) {
            convertFiletoBase64String(file)
                .then(fileBase64 => {
                    dispatchReducer({
                        type: FileDetailsActionType.ADD,
                        fileDetail: {
                            fileObj: file,
                            fileBase64: `${fileBase64}`,
                            fileName: file.name,
                            createdOn: new Date(),
                            isFileOnLocal: true,
                            isFileToBeDeleted: false,
                        },
                    })
                })
                .catch()
        }
    }

    const validateFile = (file: File) => {
        if (isLoading || isYatriDetailsLoading) {
            return
        }

        if (file.size / 1024 / 1024 > MAX_FILE_SIZE_TO_UPLOAD_IN_MB) {
            setValidationMessage('File size should be up to 10 MB.')
            return false
        }

        if (file.name?.length > 50) {
            setValidationMessage('File name length should be up to 50')
            return false
        }

        const extension = file.name.split('.')?.pop()?.toLowerCase()
        if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
            setValidationMessage('File format should be jpeg, jpg, pdf or png.')
            return
        }

        if (
            filesSavedList?.length + filesToBeUploadedList?.length >
            MAX_FILE_NUMBER_TO_KEEP_SAVED
        ) {
            setValidationMessage(
                'Only Maximum 20 files are allowed to be saved',
            )
            return false
        }

        let isFileNameUsedAlready = false
        filesSavedList?.forEach(o => {
            if (o.fileName === file.name) {
                isFileNameUsedAlready = true
            }
        })
        !isFileNameUsedAlready &&
            filesToBeUploadedList?.forEach(o => {
                if (o.fileName === file.name) {
                    isFileNameUsedAlready = true
                }
            })
        if (isFileNameUsedAlready) {
            setValidationMessage(
                'Given file name is already used, please try again with a different file name.',
            )
            return false
        }

        setValidationMessage('')
        return true
    }

    const preparePayloads = () => {
        return {
            uploadPreSignedUrlPayload: filesToBeUploadedList.map(o => ({
                fileName: o.fileObj?.name || String(Math.random()),
                fileBase64: o.fileBase64,
            })),
            deletionPayload: filesSavedList
                ?.filter(o => o.isFileToBeDeleted)
                .map(o => ({
                    fileName: o.fileName,
                    filePath: o.filePath || '',
                })),
        }
    }

    const handleOnSubmit = (formData?: UploadDetailsFormDataType) => {
        const { uploadPreSignedUrlPayload, deletionPayload } = preparePayloads()

        if (!uploadPreSignedUrlPayload?.length && !deletionPayload?.length) {
            setValidationMessage('At least one file must be uploaded.')
            return
        } else {
            setValidationMessage('')
        }

        setIsLoading(true)
        Promise.all([
            ...(uploadPreSignedUrlPayload?.length
                ? [
                      uploadMedicalCertificateAPI
                          .getMedicalUploadPreSignedUrl(
                              uploadPreSignedUrlPayload,
                          )
                          .then(r => {
                              return handleUploadFiles(r.data, formData)
                          }),
                  ]
                : []),
            ...(deletionPayload?.length
                ? [
                      uploadMedicalCertificateAPI.deleteMedicalDocuments(
                          deletionPayload,
                      ),
                  ]
                : []),
        ])
            .then(() => {
                isAllowedToUpdateFilesSavedListRef.current = true
                dispatch(loadYatriAllData())
                setIsShowSuccessModal(true)
                if (!abhaDetails) {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message:
                                "Documents Uploaded Successfully! We've sent an SMS to your registered phone number to sync your medical records with your ABHA ID.",
                            severity: 'success',
                        }),
                    )
                }
            })
            .catch(() => {
                isAllowedToUpdateFilesSavedListRef.current = true
                dispatch(loadYatriAllData())
                dispatch(
                    setSnackBar({
                        open: true,
                        message: 'Something went wrong, Please try again',
                        severity: 'error',
                    }),
                )
                dispatchReducer({ type: FileDetailsActionType.CLEAR })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleUploadFiles = (
        preSignedList: GetMedicalUploadPreSignedUrlResponseType,
        formData?: UploadDetailsFormDataType,
    ) => {
        const documentsPath: Array<{ fileName: string; filePath: string }> = []
        preSignedList.forEach((o, i) => {
            const file = filesToBeUploadedList[i].fileObj
            if (typeof file === 'object') {
                documentsPath.push({
                    fileName: file.name,
                    filePath: o.filePath,
                })
            }
        })

        return updateYatriDetailsApi({
            phoneNumber: phoneNumber || '',
            documentType: formData?.documentType,
            hospitalLabName: formData?.hospitalLabName,
            visitPurpose: formData?.visitPurpose,
            documentsPath,
        })
    }

    const handleOnDelete = (i: number, isSaved?: boolean) => {
        if (isSaved) {
            const filesSavedListCopy = [...filesSavedList]
            filesSavedListCopy[i].isFileToBeDeleted = true
            setFilesSavedList(filesSavedListCopy)
        } else {
            const fileName = filesToBeUploadedList[i].fileName
            dispatchReducer({
                type: FileDetailsActionType.DELETE,
                fileName,
            })
        }
    }

    const handleOnBackUploadForm = useCallback(() => {
        dispatchReducer({
            type: FileDetailsActionType.CLEAR,
        })
    }, [])

    useEffect(() => {
        if (filesToBeUploadedList?.length && isShowTabs) {
            setIsShowTabs(false)
        } else if (!filesToBeUploadedList?.length && !isShowTabs) {
            setIsShowTabs(true)
        }
    }, [filesToBeUploadedList, isShowTabs, setIsShowTabs])

    useEffect(() => {
        if (filesSavedList?.length) {
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
        }
    }, [filesSavedList])

    const handleSync = async (event: React.MouseEvent<HTMLElement>) => {
        event?.preventDefault()
        if (abhaDetails) {
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
        } else {
            setLinkAbhaModal(true)
        }
    }

    return (
        <div className="upload-certificate-container-v2">
            {!filesToBeUploadedList?.length ? (
                <>
                    {!filesSavedList?.length && (
                        <div className="medical-query">
                            Please upload your past and present medical records
                            filled by any medical facility.
                        </div>
                    )}
        <div className="template-message">
                        Download the template and fill it out or upload the
                        certificate.{' '}
                    </div>
                    {filesSavedList?.length &&
                    unlinkedCareContextData?.length ? (
                        <div className="sync-records-container">
                            <div className="sync-records-logo">
                                <img src={YellowCaution} alt="caution-logo" />
                            </div>
                            <div className="sync-text-container">
                                <p className="sync-title">
                                    Sync medical records with ABHA
                                </p>
                                <p className="sync-message">
                                    If your ABHA ID is linked to eSwasthya Dham,
                                    sync your medical records with ABHA to
                                    access across government registered health
                                    apps.
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
                    {linkAbhaModal && (
                        <CardBackdrop setClose={() => setLinkAbhaModal(false)}>
                            <SyncRecordsLinkAbhaModal />
                        </CardBackdrop>
                    )}
                    {syncRecordsSuccess && (
                        <CardBackdrop
                            setClose={() => setSyncRecordsSuccess(false)}
                        >
                            <SyncRecordsSuccessModal />
                        </CardBackdrop>
                    )}
                    <div className="find-hospital">
                        Find a nearby hospital &nbsp;
                        <NavLink
                            to={`/${coreRoutesEnum.LOCATE_MEDICAL_FACILITY}`}
                            className="link"
                        >
                            Medical Check-up Facility.
                        </NavLink>
                    </div>
                    <div className="download-form-container">
                        <span className="text">Medical Certificate format</span>
                        <a
                            className="link center"
                            href={Medical_Certificate}
                            download
                        >
                            <IconButton aria-label="download" size="small">
                                <img src={downloadSvgIcon} />
                            </IconButton>
                            Download Template
                        </a>
                    </div>
                    <div className="form-container">
                        <div className={`form-group`}>
                            {!filesSavedList?.length && (
                                <>
                                    <div
                                        className="dotted-box"
                                        id="drop_zone"
                                        onDrop={dropHandler}
                                        onDragOver={ev => {
                                            // Prevent default behavior (Prevent file from being opened)
                                            ev.preventDefault()
                                        }}
                                    >
                                        <UploadFileIcon fontSize="large" />
                                        <div className="browse-files">
                                            <Button
                                                variant="text"
                                                component="label"
                                            >
                                                Browse files
                                                <VisuallyHiddenFileInput
                                                    type="file"
                                                    onChange={
                                                        handleFileInputByBrowse
                                                    }
                                                    multiple
                                                />
                                            </Button>
                                            or drag & drop it here
                                        </div>
                                        <div className="info-text-secondry">
                                            JPEG, JPG, PNG and PDF formats up to
                                            10MB
                                        </div>
                                    </div>

                                    <div className="upload-files-container">
                                        <div className="browse">
                                            <img
                                                src={ImportFile}
                                                alt="import-file"
                                                className="browse-icon"
                                            />

                                            <div className="browse-files">
                                                <Button
                                                    variant="text"
                                                    component="label"
                                                >
                                                    <span> Browse files</span>
                                                    <VisuallyHiddenFileInput
                                                        type="file"
                                                        onChange={
                                                            handleFileInputByBrowse
                                                        }
                                                        multiple
                                                    />
                                                </Button>
                                            </div>
                                            <div className="info-text-secondry">
                                                JPEG, JPG, PNG, PDF and BitMap
                                                formats up to 10MB
                                            </div>
                                        </div>

                                        <div className="camera">
                                            <img
                                                src={UploadCameraFileIcon}
                                                alt="camera"
                                                className="camera-icon"
                                            />
                                            <div className="camera-files">
                                                <Button
                                                    variant="text"
                                                    component="label"
                                                >
                                                    <span> Use Camera</span>
                                                    <VisuallyHiddenFileInput
                                                        type="file"
                                                        capture="user"
                                                        accept="image/*"
                                                        onChange={
                                                            handleFileInputByBrowse
                                                        }
                                                        multiple
                                                    />
                                                </Button>
                                            </div>
                                            <div className="info-text-secondry">
                                                File format should be up to
                                                100MB
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {filesSavedList.map(o => {
                                return (
                                    <FileInfoRowItemV2
                                        key={o.fileName}
                                        fileName={o.fileName}
                                        fileObject={o.fileObj}
                                        createdOn={o.createdOn}
                                        filePath={o.filePath}
                                        isFileOnLocal={o.isFileOnLocal}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <FormHelperText
                        className="validation-message"
                        children={validationMessage || ' '}
                        error={!!validationMessage}
                    ></FormHelperText>
                    <div className="button-container">
                        {!!filesSavedList.length && (
                            <Button
                                className="blue-button"
                                component="label"
                                color="primary"
                                variant="contained"
                            >
                                Add Documents
                                <VisuallyHiddenFileInput
                                    type="file"
                                    onChange={handleFileInputByBrowse}
                                    multiple
                                />
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <UploadDetailsForm
                    filesToBeUploadedList={filesToBeUploadedList}
                    onBack={handleOnBackUploadForm}
                    onSubmit={handleOnSubmit}
                    onDiscard={handleOnDelete}
                    fileValidationMessage={validationMessage}
                />
            )}
            {isShowSuccessModal && (
                <CardBackdrop
                    setClose={() => {
                        setIsShowSuccessModal(false)
                        handleOnBackUploadForm()
                    }}
                >
                    <ChangesSaved />
                </CardBackdrop>
            )}
            {isLoading && <FullPageLoader />}
        </div>
    )
}

export default UploadCertificate
