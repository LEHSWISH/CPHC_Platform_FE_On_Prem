import './RecoverAbhaSelection..styles.scss'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import backNavigate from '../../../../../../assets/icons/backNavigate.svg'
import { coreRoutesEnum } from '../../../../../../enums/routingEnums'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import UsersListDetailed from '../../../../../shared/UsersList/UserListDetailed'
import { RecoverAbhaVerifyUserApi, fetchAbhaCard, fetchAbhaCardPdf } from '../../../../../../services/api'
import { useDispatch } from 'react-redux'
import { loadYatriAllData, setAbhaCardDetails } from '../../../../../../services/store/slices/yatriSlice'
import { isAxiosError } from 'axios'
import { setSnackBar } from '../../../../../../services/store/slices/generalSlice'

function RecoverAbhaSelection(props: RecoverAbhaSelectionPropType) {

    const [transformedData, setTransformedData] = useState()
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [abhaNumber, setAbhaNumber] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectErrorMessage, setSelectErrorMessage] = useState<string>('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    const handleLinking = (event: any) => {
        event.preventDefault()
        if(isLoading) return
        if (!selectedUser) {
            setSelectErrorMessage(
                'Please select one ABHA number before proceeding.',
            )
        } else {
            setSelectErrorMessage('')
            setIsLoading(true)
            RecoverAbhaVerifyUserApi({
                txnId: props.responseData?.txnId,
                abhaToken: props.responseData?.token,
                ABHANumber: abhaNumber,
            })
                .then(res => {
                    fetchAbhaCardFlow({
                        token: res.data.tokens?.token || '',
                        authType: res.data.authType || '',
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
    }

    useEffect(() => {
        const transformed = props.responseData.accounts.map((data: any) => ({
            primaryData: data.name,
            secondaryData: data.preferredAbhaAddress,
            extraData: data.ABHANumber,
            profilePhoto:data.profilePhoto,
        }))
        setTransformedData(transformed)
    }, [props.responseData])

    return (
        <>
            <div className="recover-abha-selection-container">
                <div className="address-selection-head">
                    <img
                        src={arrowLeftSvgIcon}
                        alt="back"
                        onClick={props.backNavigate}
                    />
                    <div className="back-btn" onClick={props.backNavigate}>
                        <img src={backNavigate} alt="back" />
                        <div>
                            <span>Back</span>
                        </div>
                    </div>
                    <span>Select ABHA account</span>
                </div>
                <div className="address-selection-body">
                    <form>
                        <div className="address-selection-inner-container">
                            <div className="address-selection-heading">
                                Select the ABHA account you want to recover
                            </div>
                            <div className="address-list">
                                <UsersListDetailed
                                    users={transformedData || []}
                                    selectedUser={selectedUser}
                                    onSelectUser={setSelectedUser}
                                    extraDataOnSelectUser={setAbhaNumber}
                                />
                            </div>
                        </div>
                        <div className="select-error-message">
                            {selectErrorMessage}
                        </div>
                        <button
                            className="recover-button"
                            type="submit"
                            onClick={handleLinking}
                        >
                            Recover
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

interface RecoverAbhaSelectionPropType {
    responseData: any
    backNavigate: () => void
}

export default RecoverAbhaSelection