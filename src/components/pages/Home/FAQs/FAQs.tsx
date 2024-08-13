import './FAQs.scss'
import FAQS  from '../../../../assets/FAQ.json'
import Accordion from './Accordion/Accordion'
function FAQs() {
    return (
        <div className="faqs-parent">
            <div className="heading">FAQs &nbsp;</div>
            <span>(Frequently Asked Questions)</span>
            {Object.values(FAQS).map((each, i) => {
                return <Accordion each={each} key={i} />
            })}
        </div>
    )
}
export default FAQs
