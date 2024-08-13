import './MedicalRecordRequestSent.scss'
import Refresh from '../../../../assets/Images/Vector (1).png'
function MedicalRecordRequestSent(props:cardbackdropopen) {
    function handleClick(){
        props.setBtnperform(true)
    }
    return (
        <>
            <div className="medical-record-main-file">
                <div className="request-sent-box-main">
                    <div className="request-sent-records">
                        <div className="request-sent-img-text">
                            <div className="No-request-sent-image">
                                <img src={Refresh}></img>
                            </div>
                        </div>
                        <div className="request-sent-no-record-found">
                            No record found
                        </div>
                        <div className="request-sent-paragraph">
                            To view records, please send consent request by
                            clicking on ‘Fetch Records’.
                        </div>
                        <div className="fetch-record">
                            <div className="fetch-record-button">
                                <button className="fetch-btn" onClick={handleClick}>
                                    Fetch record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bbtn'>
                    <button className='b' onClick ={handleClick}>
                        Fetch Record
                    </button>
                </div>
            </div>
        </>
    )
}

export interface cardbackdropopen{
    setBtnperform: (val:boolean)=> void
}
export default MedicalRecordRequestSent


