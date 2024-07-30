import './AbhaAddressConfirmation.styles.scss'
import Caution from '../../../../../../assets/icons/Caution.svg'
import { AbhaAddressConfirmationDataType } from './SelectAbhaAddress'
import { fetchAbhaCard, fetchAbhaCardPdf, linkViaPhoneNumberUserVerify } from '../../../../../../services/api'
import { loadYatriAllData, setAbhaCardDetails } from '../../../../../../services/store/slices/yatriSlice'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { isAxiosError } from 'axios'

function AbhaAddressConfirmation(props: AbhaAddressConfirmationProps) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchAbhaCardFlow = useCallback(
        ({
            token,
            authType,
            aadharNumber,
        }: {
            token: string
            authType: string
            aadharNumber: string
        }) => {
            fetchAbhaCard({
                abhaToken: token,
                authType: authType,
                aadharNumber: aadharNumber,
            })
                .then(() => {})
                .catch(() => {})

            fetchAbhaCardPdf({
                abhaToken: token,
                authType: authType,
                aadharNumber: aadharNumber,
            })
                .then(() => {})
                .catch(() => {})
        },
        [],
    )

    const handleConfirmation = (event: any) => {
        event.preventDefault()
        if(isLoading) return
        setIsLoading(true)
        linkViaPhoneNumberUserVerify({
            txnId: props.data.txnId,
            abhaToken: props.data.abhaToken,
            ABHANumber: props.data.ABHANumber,
        })
            .then(res => {
                fetchAbhaCardFlow({
                    token: res.data.tokens?.token || '',
                    authType: res.data.authType,
                    aadharNumber: '',
                })
                dispatch(
                    setAbhaCardDetails({
                        abhaCardImage: res.data.preSignedUrl,
                        abhaCardPdfUrl: res.data.preSignedUrl,
                        abhaNumber: res.data.ABHANumber,
                    }),
                )
                dispatch(loadYatriAllData())
                navigate(`/${coreRoutesEnum.CREATE_ABHA}`)
            })
            .catch(err => {
                let message = 'Something went wrong, Please try again'
                if (isAxiosError(err) && err.response?.data?.message) {
                    message = err.response.data.errorDetails
                        ? err.response.data.errorDetails.message
                        : err.response?.data?.message
                }
                dispatch(
                    setSnackBar({
                        open: true,
                        message,
                        severity: 'error',
                    }),
                )
            })
            .finally(() => setIsLoading(false))
    }
    return (
        <div className="address-confirmation-container">
            <div className="caution-logo">
                <img src={Caution} />
            </div>
            <div className="confirmation-required-alert">
                Confirmation required!
            </div>
            <div className="confirmation-required-meessage">
                Confirming will permanently link the selected ABHA account to
                eSwasthya Dham and this action is irreversible.
                <p>Do you wish to continue?</p>
            </div>
            <button className="confirm-button" onClick={handleConfirmation}>
                Confirm
            </button>
        </div>
    )
}

interface AbhaAddressConfirmationProps {
    data: AbhaAddressConfirmationDataType
}

export default AbhaAddressConfirmation
