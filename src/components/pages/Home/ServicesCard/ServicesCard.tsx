import './ServicesCard.scss'
function ServicesCard(props: ServicesCardProps) {
    return (
        <>
            <div className="service-card" onClick={props.onClickFunction}>
                <img src={props.imageUrl} alt="" />
                <div className="card-content">
                    <div className="heading">{props.heading}</div>
                    <p>{props.text}</p>
                </div>
                {props?.status && (
                    <div
                        className={
                            props?.status === 'Pending'
                                ? 'status'
                                : 'linkedStatus'
                        }
                    >
                        {props.status}
                    </div>
                )}
                {/* {props?.heading === 'ABHA' && (
                    <div className="comming-soon-text">Coming Soon</div>
                )} */}
            </div>
        </>
    )
}
interface ServicesCardProps {
    // eslint-disable-next-line @typescript-eslint/ban-types
    imageUrl: string
    heading: string
    text: string
    status?: string
    onClickFunction?: () => void
}
export default ServicesCard
