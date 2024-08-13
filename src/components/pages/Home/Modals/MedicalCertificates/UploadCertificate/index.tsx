import {
    ChangeEvent,
    DragEvent,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react'
import { useDispatch } from 'react-redux'
import {
    Button,
    CircularProgress,
    FormHelperText,
    IconButton,
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import './uploadCertificate.styles.scss'

import { updateYatriDetailsApi } from '../../../../../../services/api'
import uploadMedicalCertificateAPI from '../../../../../../services/api/uploadMedicalCertificateAPI'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import CardBackdrop from '../../../../../shared/CardBackdrop/CardBackdrop'
import downloadSvgIcon from '../../../../../../assets/icons/download.svg'
import { GetMedicalUploadPreSignedUrlResponseType } from '../../../../../../interface/ApiResponseTypes'
import VisuallyHiddenFileInput from '../../../../../shared/VisuallyHiddenInput'
import { useAppSelector } from '../../../../../../utils/hooks/useAppSelector'
import Medical_Certificate from '../../../../../../assets/Medical_Certificate.pdf'
import { loadYatriAllData } from '../../../../../../services/store/slices/yatriSlice'
import FileInfoRowItem from './FileInfoRowItem'
import ChangesUnsaved from '../ChangesUnsaved/ChangesUnsaved'
import ChangesSaved from '../ChangesSaved/ChangesSaved'
import { FileDetailsType } from '../../../../../../interface/medicalCertificate/FileDetailsType'
import { convertFiletoBase64String } from '../../../../../../utils/HelperFunctions'

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
interface UploadCertificatePropTypes {
    onClose: () => void
    goToMedicalDeclaration?: () => void
}

const UploadCertificate = ({
    onClose,
    goToMedicalDeclaration,
}: UploadCertificatePropTypes) => {
    const dispatch = useDispatch()
    const isAllowedToUpdateFilesSavedListRef = useRef(true)
    const [isLoading, setIsLoading] = useState(false)
    const [filesToBeUploadedList, dispatchReducer] = useReducer(
        reducer,
        [] as FileDetailsType[],
    )
    const [filesSavedList, setFilesSavedList] = useState<FileDetailsType[]>([])
    const [validationMessage, setValidationMessage] = useState('')
    const [isShowSaveConfirmationModal, setIsShowSaveConfimationModal] =
        useState(false)
    const [isShowSuccessModal, setIsShowSuccessModal] = useState(false)
    const [isBackFlow, setIsBackFlow] = useState(false)

    const savedDocumentsPath = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.documentsPath,
    )

    const isYatriDetailsLoading = useAppSelector(
        s => s.yatri.yatriAllDetails.loading,
    )

    const phoneNumber = useAppSelector(
        s => s.yatri.yatriAllDetails.data?.phoneNumber,
    )

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

        const extension = file.name.split('.')?.pop()?.toLowerCase()
        if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
            setValidationMessage('File format should be jpeg, jpg, pdf, png.')
            return
        }

        if (
            filesSavedList?.length + filesToBeUploadedList?.length >=
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

    const checkAreThereUnsavedChanges = () => {
        const { uploadPreSignedUrlPayload, deletionPayload } = preparePayloads()
        if (!uploadPreSignedUrlPayload?.length && !deletionPayload?.length) {
            return false
        } else {
            return true
        }
    }

    const handleOnSubmit = () => {
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
                              return handleUploadFiles(r.data)
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
                dispatch(loadYatriAllData())
                setIsShowSuccessModal(true)
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
    ) => {
        return Promise.all([
            ...preSignedList.map((o, i) => {
                const file = filesToBeUploadedList[i].fileObj
                if (typeof file === 'object') {
                    return uploadMedicalCertificateAPI
                        .patchFileOnAwsPreSignedUrl({
                            presignedUrl: o.presignedUrl,
                            file,
                        })
                        .then(() => {
                            return updateYatriDetailsApi({
                                phoneNumber: phoneNumber || '',
                                documentsPath: [
                                    {
                                        fileName: file.name,
                                        filePath: o.filePath,
                                    },
                                ],
                            })
                        })
                }
            }),
        ])
    }

    const handleOnDelete = (i: number, isSaved: boolean) => {
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

    const handleOnClose = (_isBackFlow?: boolean) => {
        if (checkAreThereUnsavedChanges()) {
            setIsShowSaveConfimationModal(true)
        } else {
            _isBackFlow && goToMedicalDeclaration
                ? goToMedicalDeclaration()
                : onClose()
        }
    }

    const isTwoChildShown =
        !!filesToBeUploadedList?.length || !!filesSavedList?.length

    return (
        <>
            <CardBackdrop
                setClose={() => {
                    setIsBackFlow(false)
                    handleOnClose()
                }}
            >
                <div className="upload-certificate-container">
                    <div className="modal-title">Upload Medical Records</div>
                    <div className="medical-query">
                        Please upload your past and present medical records
                        filled by any medical facility.
                    </div>
                    <div className="chose-from">
                        Download the template and fill it out or upload the
                        certificate from a medical check-up facility.
                    </div>
                    <div className="download-form-container">
                        <span className="text">Medical Certificate format</span>
                        <a
                            className="link"
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
                        <div
                            className={`form-group ${(!isTwoChildShown && 'grid-template-columns-1') || ''}`}
                        >
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
                                    <Button variant="text" component="label">
                                        Browse files
                                        <VisuallyHiddenFileInput
                                            type="file"
                                            onChange={handleFileInputByBrowse}
                                            multiple
                                        />
                                    </Button>
                                    or drag & drop it here
                                </div>
                                <div className="info-text-secondry">
                                    JPEG, JPG, PNG, PDF and formats up to 10MB
                                </div>
                            </div>
                            {isTwoChildShown && (
                                <div className="round-box">
                                    {filesToBeUploadedList.map((o, i) => {
                                        return (
                                            <FileInfoRowItem
                                                key={`${o.fileObj?.name}`}
                                                indexNumber={`${i + 1}`}
                                                fileName={o.fileObj?.name || ''}
                                                isFileOnLocal={true}
                                                isFileToBeDeleted={false}
                                                fileObject={o.fileObj}
                                                onDelete={() =>
                                                    handleOnDelete(i, false)
                                                }
                                                disabled={isLoading}
                                            />
                                        )
                                    })}
                                    {filesSavedList.map((o, i) => {
                                        return (
                                            <FileInfoRowItem
                                                key={`${o.fileName}`}
                                                indexNumber={`${i + 1 + filesToBeUploadedList?.length}`}
                                                fileName={o.fileName || ''}
                                                filePath={o.filePath}
                                                isFileOnLocal={false}
                                                isFileToBeDeleted={
                                                    !!o.isFileToBeDeleted
                                                }
                                                createdOn={o.createdOn}
                                                onDelete={() =>
                                                    handleOnDelete(i, true)
                                                }
                                                disabled={isLoading}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <FormHelperText
                        className="validation-message"
                        children={validationMessage || ' '}
                        error={!!validationMessage}
                    ></FormHelperText>
                    <Button
                        className="submit-declaration-button"
                        color="primary"
                        onClick={() => {
                            setIsBackFlow(false)
                            handleOnSubmit()
                        }}
                        variant="contained"
                        disabled={isLoading || isYatriDetailsLoading}
                    >
                        {isLoading ? (
                            <CircularProgress color="inherit" />
                        ) : (
                            <span>Upload & Submit</span>
                        )}
                    </Button>
                    {goToMedicalDeclaration && (
                        <div
                            className="bottom-link"
                            onClick={() => {
                                setIsBackFlow(true)
                                handleOnClose(true)
                            }}
                        >
                            View Medical Declaration
                        </div>
                    )}
                </div>
            </CardBackdrop>
            {isShowSaveConfirmationModal && (
                <CardBackdrop
                    setClose={() => setIsShowSaveConfimationModal(false)}
                >
                    <ChangesUnsaved
                        onExit={() =>
                            !(isLoading || isYatriDetailsLoading) && onClose()
                        }
                        onSave={() =>
                            !(isLoading || isYatriDetailsLoading) &&
                            handleOnSubmit()
                        }
                    />
                </CardBackdrop>
            )}
            {isShowSuccessModal && (
                <CardBackdrop
                    setClose={() =>
                        isBackFlow && goToMedicalDeclaration
                            ? goToMedicalDeclaration()
                            : onClose()
                    }
                >
                    <ChangesSaved />
                </CardBackdrop>
            )}
        </>
    )
}

export default UploadCertificate
