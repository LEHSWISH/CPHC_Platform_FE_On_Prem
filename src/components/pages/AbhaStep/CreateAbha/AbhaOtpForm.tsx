import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InputAdornment } from '@mui/material'
import { FormikHelpers, useFormik } from 'formik'
import OtpField from '../../../shared/InputFields/OtpField'

interface CreateAbhaOtpFormPropType {
    onSubmit: (
        values: CreateAbhaOtpFormValueType,
        actions: FormikHelpers<CreateAbhaOtpFormValueType>,
    ) => void | Promise<unknown>
    onResend: () => void | Promise<unknown>
    phoneNumber: number | string
    aadharNumber: number | string
    changeNumber: () => void
    isOtpAaadharForm: boolean
    otpFieldDescriptionText: string
    setSelectedStep?: (step: number) => void
}

export interface CreateAbhaOtpFormValueType {
    otp: string
}

const initialValues: CreateAbhaOtpFormValueType = {
    otp: '',
}

const AbhaOtpForm = ({
    onSubmit,
    onResend,
    phoneNumber,
    aadharNumber,
    changeNumber,
    isOtpAaadharForm,
    otpFieldDescriptionText,
    setSelectedStep,
}: CreateAbhaOtpFormPropType) => {
    const otpAadharFormPreviousStateRef = useRef(isOtpAaadharForm)
    const [uniqueId, setUniqueId] = useState(Symbol())
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues,
        onSubmit,
    })

    useEffect(() => {
        if (isOtpAaadharForm != otpAadharFormPreviousStateRef.current) {
            formik.resetForm()
            setUniqueId(Symbol())
            otpAadharFormPreviousStateRef.current = isOtpAaadharForm
        }
    }, [isOtpAaadharForm, formik])

    return (
        <>
            <div className="aadhar-number-block">
                <div className="aadhar-number">
                    {isOtpAaadharForm
                        ? t('pilgrim.onboarding.create_abha_page.aadhar_number')
                        : t('common_action_text.phone_number')}
                    {' - '}
                    <span>
                        {isOtpAaadharForm
                            ? t('mask.aadhar', {
                                  number: `${aadharNumber}`.slice(-4),
                              })
                            : t('mask.phone', {
                                  number: `${phoneNumber}`.slice(-4),
                              })}
                    </span>
                </div>
                &nbsp;
                <div className="link" onClick={changeNumber}>
                    {t('common_action_text.change')}
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <OtpField
                    descriptionText={otpFieldDescriptionText}
                    onResend={onResend}
                    fieldProps={{
                        onChange: formik.handleChange,
                        value: formik.values.otp,
                        error: !!formik.errors.otp,
                        helperText: formik.errors.otp || ' ',
                        InputProps: {
                            startAdornment: (
                                <InputAdornment position="start"></InputAdornment>
                            ),
                        },
                    }}
                    uniqueId={uniqueId}
                />
                <button type="submit">
                    {t('common_action_text.verify_&_continue')}
                </button>
                <div className="link-info">
                    {t('pilgrim.onboarding.create_abha_page.form.LINK_INFO')}
                    &nbsp;
                    <a className="link" onClick={() => setSelectedStep && setSelectedStep(3)}>
                        {t('common_action_text.skip_for_later')}
                    </a>
                </div>
            </form>
        </>
    )
}

export default AbhaOtpForm
