import { useEffect, useMemo, useState } from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import './otpField.style.scss'

interface OtpFieldProps {
    fieldProps: TextFieldProps
    descriptionText: string
    onResend: () => void | Promise<unknown>
    isDisabled?: boolean
    uniqueId?: symbol
}

const OtpField = ({
    fieldProps,
    onResend,
    descriptionText,
    isDisabled,
    uniqueId,
}: OtpFieldProps) => {
    const { t } = useTranslation()
    const [timer, setTimer] = useState(59)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        let intervalId: any
        if (started) {
            intervalId = setInterval(() => {
                setTimer(prevSeconds => {
                    if (prevSeconds <= 0) {
                        setStarted(false)
                        clearInterval(intervalId)
                    }
                    return prevSeconds > 0 ? prevSeconds - 1 : 0
                })
            }, 1000)
        }
        return () => {
            clearInterval(intervalId)
        }
    }, [started])

    const startTimer = () => {
        if (started) {
            return
        }
        onResend()
        setTimer(59)
        setStarted(true)
    }

    useEffect(() => {
        setStarted(true)
        setTimer(59)
    }, [uniqueId])

    const timerValue = useMemo(() => {
        return timer < 10 ? `0${timer}` : timer
    }, [timer])

    return (
        <>
            {descriptionText && (
                <div className="otp-description">{descriptionText}</div>
            )}
            <TextField
                type="text"
                label={t('field.otp.label')}
                id="otp"
                name="otp"
                placeholder="- - - - - -"
                variant="standard"
                margin="normal"
                required
                disabled={!!isDisabled}
                fullWidth
                {...fieldProps}
            />
            <div className="resend-div">
                <span className="resend-text">
                    <Trans
                        i18nKey={'field.otp.resend-text'}
                        values={{
                            timerValue,
                        }}
                        components={{
                            1: <span />,
                        }}
                    />
                </span>
                <a
                    className={`resend-button ${started ? 'disabled' : ''}`}
                    onClick={startTimer}
                >
                    {t('common_action_text.resend')}
                </a>
            </div>
        </>
    )
}

export default OtpField
