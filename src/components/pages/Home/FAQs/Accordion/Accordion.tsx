import React from 'react'
import PlusIcon from '../../../../../assets/icons/plusIcon.svg'
import MinusIcon from '../../../../../assets/icons/minusIcon.svg'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
function Accordions(props: AccordionType) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <>
      <Accordion expanded={expanded} className='accordion'
        onChange={handleExpansion}>
        <AccordionSummary
          expandIcon={<img src={expanded ? MinusIcon : PlusIcon
          } />}
          aria-controls="panel1-content"
          id="panel1-header"
          className='accordion-header'
          sx={{borderTop: '1px solid rgba(32, 32, 32, 0.2)', color: 'rgba(32, 32, 32, 1)'}}
        >
          {props.each.question}
        </AccordionSummary>
        <AccordionDetails
          sx={{color: 'rgba(108, 105, 105, 1)'}}
        >
          {props.each.answer}
        </AccordionDetails>
      </Accordion>
    </>
  )
}
interface AccordionType{
  each:{
    question:string,
    answer:string
  }
}
export default Accordions