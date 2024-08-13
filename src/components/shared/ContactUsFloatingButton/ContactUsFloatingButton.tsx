import { Fab } from '@mui/material'
import { Chat } from '../Icons'
import { useState } from 'react'
import CardBackdropV2 from '../CardBackdrop/CardBackdropV2'
import ContactUs from '../../modals/ContactUs/ContactUs'

function ContactUsFloatingButton() {
    const [openSupportModal, setOpenSupportModal] = useState<boolean>(false)

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault()
        setOpenSupportModal(true)
    }

    return (
        <>
            <Fab aria-label="contact" disableRipple onClick={handleClick}>
                <Chat />
            </Fab>
            {openSupportModal ? (
                <CardBackdropV2
                    showClose={true}
                    setClose={() => setOpenSupportModal(false)}
                >
                    <ContactUs
                        isModal
                        closeModal={() => setOpenSupportModal(false)}
                    />
                </CardBackdropV2>
            ) : (
                <></>
            )}
        </>
    )
}

export default ContactUsFloatingButton
