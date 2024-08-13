import { IconButton } from '@mui/material'
import deleteSvgIcon from '../../../../../../assets/icons/delete.svg'
import downloadSvgIcon from '../../../../../../assets/icons/download.svg'
import cautionSvgIcon from '../../../../../../assets/icons/Vector.svg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import uploadMedicalCertificateAPI from '../../../../../../services/api/uploadMedicalCertificateAPI'
import { downloadByFileObject, downloadFileFromLink, formatSecondToMSS } from '../../../../../../utils/HelperFunctions'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../../utils/hooks/useAppDispatch'

const TIME_ALLOWED_TO_DELETE_SECONDS = 5 * 60

interface FileInfoRowItemPropType {
    indexNumber: string
    fileName: string
    fileObject?: File
    filePath?: string
    isFileToBeDeleted: boolean
    isFileOnLocal: boolean
    createdOn?: Date
    onDelete: () => void
    disabled: boolean
}

const FileInfoRowItem = ({
    indexNumber,
    fileName,
    filePath,
    isFileOnLocal,
    isFileToBeDeleted,
    fileObject,
    onDelete,
    createdOn,
    disabled,
}: FileInfoRowItemPropType) => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeDifference, setTimeDifference] = useState(TIME_ALLOWED_TO_DELETE_SECONDS)

    const getTimeDifferenceInSeconds = useCallback((startDate: Date) => {
        const start = startDate.getTime()
        const end = new Date().getTime()
        return (end - start) / 1000
    }, [])

    useEffect(() => {
        if (createdOn) {
            const timeDifference = getTimeDifferenceInSeconds(createdOn)
            if (timeDifference < TIME_ALLOWED_TO_DELETE_SECONDS) {
                setIsTimerRunning(true)
            }
        }
        // const seconds = Math.floor(diff / 1000 % 60);
    }, [createdOn, getTimeDifferenceInSeconds])

    useEffect(() => {
        let intervalId: any
        if (isTimerRunning && createdOn) {
            intervalId = setInterval(() => {
                const diff = getTimeDifferenceInSeconds(createdOn)
                setTimeDifference(diff)
                if (diff >= TIME_ALLOWED_TO_DELETE_SECONDS) {
                    setIsTimerRunning(false)
                    clearInterval(intervalId)
                }
            }, 1000)
        }
        return () => {
            clearInterval(intervalId)
        }
    }, [createdOn, getTimeDifferenceInSeconds, isTimerRunning])

    const handleOnDownload = () => {
        if(isFileOnLocal) {
            fileObject && downloadByFileObject(fileObject)
            return
        }

        if (isLoading || !filePath) {
            return
        }

        setIsLoading(true)
        uploadMedicalCertificateAPI.getMedicalDownloadPreSignedUrl([
            {
                fileName,
                filePath: filePath || '',
            },
        ])
            .then(r => {
                const presignedUrl = r?.data?.[0]?.presignedUrl
                if (presignedUrl) {
                    downloadFileFromLink(fileName, presignedUrl)
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

    const timeString = useMemo(
        () =>
            formatSecondToMSS(TIME_ALLOWED_TO_DELETE_SECONDS - timeDifference),
        [timeDifference],
    )

    return (
        <div className="file-info-row-item">
            <div className="file-info-container-first">
                <div
                    className="text"
                    style={{ opacity: isFileToBeDeleted ? 0.4 : 1 }}
                >
                    {indexNumber}
                    {'. '}
                    {fileName}
                </div>

                {!isFileToBeDeleted && (
                    <div className="icon-buttons-container">
                        {(isFileOnLocal ||
                            (createdOn &&
                                isTimerRunning)) && (
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={onDelete}
                                disabled={isLoading || disabled}
                            >
                                <img src={deleteSvgIcon} />
                            </IconButton>
                        )}
                        <IconButton
                            aria-label="download"
                            size="small"
                            onClick={handleOnDownload}
                            disabled={isLoading || disabled}
                        >
                            <img src={downloadSvgIcon} />
                        </IconButton>
                    </div>
                )}
            </div>
            {(isFileOnLocal ||
                (createdOn && isTimerRunning)) && (
                <div className="deletion-info">
                    <IconButton aria-label="info" size="small">
                        <img src={cautionSvgIcon} />
                    </IconButton>
                    {isFileToBeDeleted && 'This file will be deleted'}
                    {!isFileToBeDeleted &&
                        (isFileOnLocal
                            ? 'You cannot remove this file after 5 mins, once you upload & submit'
                            : 'You cannot remove this file after 5 mins.')}

                    {!(isFileOnLocal || isFileToBeDeleted) && (
                        <span>{timeString}</span>
                    )}
                </div>
            )}
        </div>
    )
}

export default FileInfoRowItem
