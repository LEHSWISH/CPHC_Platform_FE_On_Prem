import MyRequestRecord from './MyRequestRecords/MyRequestRecords'
import './MyRequest.scss'
import Breadcrumb from '../../../shared/breadCrumb/Breadcrumb'
import { useMemo, useState } from 'react'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import { useNavigate } from 'react-router-dom'
import Footer from '../../../shared/Footer/Footer'
import CardBackdrop from '../../../shared/CardBackdrop/CardBackdrop'
import FetchDocuments from '../FetchDocuments/FetchDocuments'
import BackButtonWithTitle from '../../../shared/BackButtonWithTitle'
function MyRequest() {
    const navigate = useNavigate()
    const [toggleFetchRecords, setToggleFetchRecords] = useState<boolean>(false)
    const breadcrumbClickableListItems = useMemo(() => {
        return [
            {
                label: 'eSwasthya Dham',
                onClick: () => navigate('/', { replace: true }),
            },
            {
                label: 'Medical Records',
                onClick: () =>
                    navigate(`/${coreRoutesEnum.MEDICAL_RECORDS}`, {
                        replace: true,
                    }),
            },
            { label: 'My Requests', onClick: () => {} },
        ]
    }, [navigate])

    const handleBackNavigation = () => {
        navigate(`/${coreRoutesEnum.MEDICAL_RECORDS}`, {
            replace: true,
        })
    }

    return (
        <>
                <div className="request-outer-container">
                    <Breadcrumb
                        clickableListItems={breadcrumbClickableListItems}
                    />
                    <div className="request-inner-container">
                        <div className="header-web">
                            <div className="request-header">My Requests</div>
                            <div
                                className="fetch-records"
                                onClick={() => setToggleFetchRecords(true)}
                            >
                                Fetch Records
                            </div>
                        </div>
                        <div className="header-mobile">
                            <div className="header-with-nav">
                                <div className="back-button-mobile-div">
                                    <BackButtonWithTitle
                                        onBack={handleBackNavigation}
                                        backButtonChildElement={
                                            <span className="backbutton">
                                                Back
                                            </span>
                                        }
                                    />
                                </div>
                                <div className="request-header">
                                    My Requests
                                </div>
                            </div>
                            <div className="fetch-records-mobile">
                                To add records, please click on
                                <span
                                    onClick={() => setToggleFetchRecords(true)}
                                >
                                    Fetch Records
                                </span>
                            </div>
                        </div>
                        <div className="request-record-component">
                            <MyRequestRecord />
                        </div>
                    </div>
                    {toggleFetchRecords && (
                        <CardBackdrop
                            setClose={() => setToggleFetchRecords(false)}
                        >
                            <FetchDocuments
                                setBtnPerform={setToggleFetchRecords}
                                closeModal={() => setToggleFetchRecords(false)}
                            />
                        </CardBackdrop>
                    )}
                <Footer />
                </div>
        </>
    )
}
export default MyRequest
