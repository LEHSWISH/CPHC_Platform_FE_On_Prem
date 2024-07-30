import { InputAdornment, TextField } from '@mui/material'
import { FormikHelpers, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { createAbhaFormSchema } from '../../../../utils/constants/validations'

export interface CreateAbhaFormValueType {
    aadharNumber: string
    phoneNumber: string
}

interface CreateAbhaFormPropType {
    onSubmit: (
        values: CreateAbhaFormValueType,
        actions: FormikHelpers<CreateAbhaFormValueType>,
    ) => void | Promise<unknown>
    setSelectedStep?: (step: number) => void
}

const initialValues: CreateAbhaFormValueType = {
    aadharNumber: '',
    phoneNumber: '',
}

const CreateAbhaForm = ({
    onSubmit,
    setSelectedStep,
}: CreateAbhaFormPropType) => {
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues,
        validationSchema: createAbhaFormSchema({ t }),
        onSubmit,
    })

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        // replace non-numeric input
        const onlyNumbers = value
            .replace(/[^\d]/g, '')
            .slice(0, name === 'aadharNumber' ? 12 : 10)
        formik.setFieldValue(name, onlyNumbers)
    }

    return (
        <>
            <p className="view-description">
                {t('pilgrim.onboarding.create_abha_page.DESCRIPTION')}
            </p>
            <div className="form-title">
                {t('pilgrim.onboarding.create_abha_page.form.title')}
            </div>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    type="text"
                    label={t(
                        'pilgrim.onboarding.create_abha_page.form.FIELD_1.LABEL',
                    )}
                    id="aadharNumber"
                    name="aadharNumber"
                    placeholder={t(
                        'pilgrim.onboarding.create_abha_page.form.FIELD_1.PLACEHOLDER',
                    )}
                    onChange={handleNumberChange}
                    value={formik.values.aadharNumber}
                    variant="standard"
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    error={!!formik.errors.aadharNumber}
                    helperText={formik.errors.aadharNumber || ' '}
                />
                <TextField
                    type="tel"
                    label={t(
                        'pilgrim.onboarding.create_abha_page.form.FIELD_2.LABEL',
                    )}
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder={t(
                        'pilgrim.onboarding.create_abha_page.form.FIELD_2.PLACEHOLDER',
                    )}
                    onChange={handleNumberChange}
                    value={formik.values.phoneNumber}
                    variant="standard"
                    required
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                +91
                            </InputAdornment>
                        ),
                    }}
                    error={!!formik.errors.phoneNumber}
                    helperText={formik.errors.phoneNumber || ' '}
                />
                <div className="link-info">
                    {t('pilgrim.onboarding.create_abha_page.form.LINK_INFO')}
                    &nbsp;
                    <a className="link" onClick={() => setSelectedStep && setSelectedStep(1)}>
                        {t('pilgrim.onboarding.create_abha_page.link_abha')}
                    </a>
                </div>
                <button type="submit">
                    {t('pilgrim.onboarding.create_abha_page.form.SUBMIT_TEXT')}
                </button>
                <a className="link" onClick={() => setSelectedStep && setSelectedStep(3)}>
                    {t('common_action_text.skip_for_later')}
                </a>
            </form>
        </>
    )
}

export default CreateAbhaForm
