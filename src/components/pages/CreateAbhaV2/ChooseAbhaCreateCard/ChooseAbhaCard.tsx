import './ChooseAbhaCard.scss'
function ChooseAbhaCard(props: ServicesCardProps) {
    return (
        <>
            <div
                className='choose-abha-card'
                onClick={props.onClickFunction}
            >
                <img src={props.imageUrl} alt="" />
                <div className="card-content">
                    <div className="heading">{props.heading}</div>
                    {props.secondaryText && <p>{props.secondaryText}</p>}
                    <p>{props.text}</p>
                </div>
                    <div
                        className='action'
                    >
                        {props.action}
                    </div>
            </div>
        </>
    )
}
interface ServicesCardProps {
    // eslint-disable-next-line @typescript-eslint/ban-types
    imageUrl: string
    heading: string
    text: string
    secondaryText?:string
    action?: string
    onClickFunction?: () => void
}
export default ChooseAbhaCard
