import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './TourismPortalId.scss'
import FillManuallyForm from '../FillManuallyForm/FillManuallyForm'
import TourismIdForm from '../TourismIdForm/TourismIdForm'
import { GetUserInfoByIDTP_ApiResponseType } from '../../../../interface/ApiResponseTypes'

function TourismPortalId() {
    const { t } = useTranslation()
    const [selectedValue, setSelectedValue] = useState('auto')
    const [tourismPortalId, setTourismPortalId] = useState('')
    const [userInfoByIDTP, setUserInfoByIDTP] =
        useState<GetUserInfoByIDTP_ApiResponseType>()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.name)
    }
    return (
        <div className="tourism-portal-parent-container">
            <h2 className="create-abha-heading">
                How would you like to provide your Yatri details?
            </h2>
            <p className="abha-description">
                Your Tourism ID is your key to a seamless pilgrimage experience!
                Registering with this unique identifier ensures personalized
                assistance, timely updates, and a secure journey as you embark
                on the sacred Char Dham Yatra. Don't forget to obtain your
                Tourism ID for hassle-free registration into the portal before
                setting out on this spiritual adventure.
            </p>
            {!tourismPortalId ? (
                <RadioGroup row name="position" defaultValue="top">
                    <FormControlLabel
                        checked={selectedValue === 'auto'}
                        name="auto"
                        value="auto"
                        control={<Radio onChange={handleChange} />}
                        label="Tourism Portal Id"
                    />
                    <FormControlLabel
                        value="manual"
                        control={<Radio onChange={handleChange} />}
                        checked={selectedValue === 'manual'}
                        label="I want to fill manually"
                        name="manual"
                    />
                </RadioGroup>
            ) : (
                <div className='flex-row-center'>
                    <div className="blue-highlight">
                        {t('pilgrim.onboarding.tourism-portal-id')}
                        {' - '}
                        <span>
                            {t('mask.tourism-portal-id', {
                                number: `${tourismPortalId}`.slice(-2),
                            })}
                        </span>
                    </div>
                    &nbsp;
                    <div className="link" onClick={() => {
                        setTourismPortalId('')
                        setSelectedValue('auto')
                        setUserInfoByIDTP(undefined)
                    }}>
                        {t('common_action_text.change')}
                    </div>
                </div>
            )}
            {selectedValue === 'auto' ? (
                <TourismIdForm
                    setTourismPortalId={setTourismPortalId}
                    setUserInfoByIDTP={setUserInfoByIDTP}
                    setSelectedValue={setSelectedValue}
                />
            ) : (
                <FillManuallyForm userInfoByIDTP={userInfoByIDTP} />
            )}
        </div>
    )
}

export default TourismPortalId
