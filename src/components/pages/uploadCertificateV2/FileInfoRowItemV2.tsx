import { IconButton } from '@mui/material'
import downloadSvgIcon from '../../../assets/icons/download.svg'
import { useState } from 'react'
import uploadMedicalCertificateAPI from '../../../services/api/uploadMedicalCertificateAPI'
import {
    downloadByFileObject,
    downloadBase64StringAsFile,
} from '../../../utils/HelperFunctions'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'

interface FileInfoRowItemV2PropType {
    fileName: string
    fileObject?: File
    filePath?: string
    isFileOnLocal: boolean
    createdOn?: Date
}

const FileInfoRowItemV2 = ({
    fileName,
    filePath,
    isFileOnLocal,
    fileObject,
    createdOn,
}: FileInfoRowItemV2PropType) => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const handleOnDownload = () => {
        if (isFileOnLocal) {
            fileObject && downloadByFileObject(fileObject)
            return
        }

        if (isLoading || !filePath) {
            return
        }

        setIsLoading(true)
        uploadMedicalCertificateAPI
            .getMedicalDownloadPreSignedUrl([
                {
                    fileName,
                    filePath: filePath || '',
                },
            ])
            .then(r => {
                const fileBase64 = r?.data?.[0]?.fileBase64
                if (fileBase64) {
                    downloadBase64StringAsFile(fileBase64, fileName)
                } else {
                    throw new Error()
                }
            })
            .catch(() => {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: 'Download failed',
                        severity: 'error',
                    }),
                )
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div key={`${fileName}`} className="saved-file-row">
            
            <div className="file-name-text"> <p>{fileName}</p>
            <span className='file-name-text-date-mobile-view'>{createdOn && createdOn.toLocaleDateString()} </span>
            </div>
            <div className="h-2">
                <div className="time-text">
                    <div className="label">Uploaded on:</div>
                    &nbsp;
                    <div className="value">
                        {createdOn && createdOn.toLocaleDateString()}
                    </div>
                </div>
                
                <div className="icon-buttons-container">
                    <div className="link" onClick={handleOnDownload}>
                        View
                    </div>
                    <IconButton
                        aria-label="download"
                        size="small"
                        onClick={handleOnDownload}
                        disabled={isLoading}
                    >
                        <img src={downloadSvgIcon} />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default FileInfoRowItemV2
