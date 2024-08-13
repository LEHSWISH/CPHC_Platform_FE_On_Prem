import { ChangeEvent, useCallback, useState } from 'react'
import { useFormik } from 'formik'
import { Checkbox, FormHelperText } from '@mui/material'
import './TermsAndConditions.styles.scss'
import arrowLeftSvgIcon from '../../../../../../assets/icons/arrow-left.svg'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'

interface TermsAndConditionsPropType {
    setTerms: () => void
    backNavigate: () => void
    initialConsent: boolean
}

function TermsAndConditions({
    initialConsent,
    ...props
}: TermsAndConditionsPropType) {
    const handleBackNavigation = () => {
        props.backNavigate()
    }
    const [submitButtonErrorText, setSubmitButtonErrorText] =
        useState<string>('')
    const formik = useFormik({
        initialValues: {
            consent1: initialConsent,
            consent2: initialConsent,
        },
        onSubmit: value => {
            setSubmitButtonErrorText('')
            if(Object.values(value).includes(false)) {
                    setSubmitButtonErrorText(
                        'Please accept all the required terms & conditions above'
                )
            } else {
                props?.setTerms()
            }
        },
    })

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setSubmitButtonErrorText('')
            formik.handleChange(event)
        },
        [formik],
    )

    return (
        <div className="terms-container">
            <div className="terms-head-web">
                <img
                    src={arrowLeftSvgIcon}
                    alt="back"
                    onClick={() => props.backNavigate()}
                />
                <span>Terms and Conditions</span>
            </div>
            <div className="terms-head-mobile">
                <div className="header-with-nav">
                    <div className="back-button-mobile-div">
                        <BackButtonWithTitle
                            onBack={handleBackNavigation}
                            backButtonChildElement={
                                <span className="backbutton">Back</span>
                            }
                        />
                    </div>
                    <div className="terms-header">Terms and Conditions</div>
                </div>
            </div>
            <form className="terms-body-wrapper" onSubmit={formik.handleSubmit}>
                <div className="terms-and-conditions">
                    <div className="rowItem">
                        <Checkbox
                            checked={formik.values.consent1}
                            onChange={handleChange}
                            name={'consent1'}
                        />
                        <div className="label-text">
                            I am voluntarily sharing my Aadhaar Number/ Virtual
                            ID issued by the Unique Identification Authority of
                            India ("UIDAI"), and my demographic information for
                            the purpose of creating an Ayushman Bharat Health
                            Account number ("ABHA number") and Ayushman Bharat
                            Health Account address ("ABHA Address"). I authorize
                            NHA to use my Aadhaar number/Virtual ID for
                            performing Aadhaar based authentication with UIDAI
                            as per the provisions of the Aadhaar (Targeted
                            Delivery of Financial and other Subsidies, Benefits
                            and Services) Act, 2016 for the aforesaid purpose. I
                            understand that UIDAI will share my e-KYC details,
                            or response of "Yes" with NHA upon successful
                            authentication.
                        </div>
                    </div>
                    <div className="rowItem">
                        <Checkbox
                            checked={formik.values.consent2}
                            onChange={handleChange}
                            name={'consent2'}
                        />
                        <div className="label-text">
                            I intend to create Ayushman Bharat Health Account
                            Number ("ABHA number") and Ayushman Bharat Health
                            Account address ("ABHA Address") using document
                            other than Aadhaar.
                        </div>
                    </div>
                </div>
                <FormHelperText
                    className="validation-message"
                    children={submitButtonErrorText}
                    error={!!submitButtonErrorText}
                ></FormHelperText>
                <button type="submit" className="accept-terms-button">
                    I agree
                </button>
            </form>
        </div>
    )
}

export default TermsAndConditions
