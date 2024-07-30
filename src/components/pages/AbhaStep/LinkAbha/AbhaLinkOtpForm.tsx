import { useTranslation } from 'react-i18next'
import { InputAdornment } from '@mui/material'
import { FormikHelpers, useFormik } from 'formik'
import OtpField from '../../../shared/InputFields/OtpField'

interface AbhaLinkOtpFormPropType {
    onSubmit: (
        values: AbhaLinkOtpFormValueType,
        actions: FormikHelpers<AbhaLinkOtpFormValueType>,
    ) => void | Promise<unknown>
    onResend: () => void | Promise<unknown>
    abhaNumber: number | string
    changeAbha: () => void
    skipForLater: () => void
}

export interface AbhaLinkOtpFormValueType {
    otp: string
}

const initialValues: AbhaLinkOtpFormValueType = {
    otp: '',
}

const AbhaLinkOtpForm = ({
    onSubmit,
    onResend,
    skipForLater,
    abhaNumber,
    changeAbha,
}: AbhaLinkOtpFormPropType) => {
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues,
        onSubmit,
    })

    return (
        <>
            <div className="aadhar-number-block">
                <div className="aadhar-number">
                    {t('pilgrim.onboarding.link_abha_page.abha_number')}
                    {' - '}
                    <span>
                        {t('mask.abha', {
                            number: `${abhaNumber}`.slice(-4),
                        })}
                    </span>
                </div>
                &nbsp;
                <div className="link" onClick={changeAbha}>
                    {t('common_action_text.change')}
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <OtpField
                    descriptionText={t(
                        'pilgrim.onboarding.link_abha_page.otp_description'
                    )}
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
                />
                <button type="submit">
                    {t('common_action_text.verify_&_Link')}
                </button>
                <div className="link-info">
                    {t('common_action_text.change_of_mind')}
                    &nbsp;
                    <a className="link" onClick={() => skipForLater()}>
                        {t('common_action_text.skip_for_later')}
                    </a>
                </div>
            </form>
        </>
    )
}

export default AbhaLinkOtpForm
