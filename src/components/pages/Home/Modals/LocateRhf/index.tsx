import {
    Button,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    useMediaQuery,
} from '@mui/material'
import './FacilityLocator.styles.scss'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    getAllStateApi,
    getDistrictListApi,
    getRhfFacilityListApi,
} from '../../../../../services/api'
import {
    DistrictAllResponseType,
    RhfFacilityListType,
    StateAllResponseType,
} from '../../../../../interface/ApiResponseTypes'
import { setSnackBar } from '../../../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../../../utils/hooks/useAppDispatch'
import FacilityList from './FacilityList'

function LocateRHF() {
    const dispatch = useAppDispatch()
    const isSmallDisplay = useMediaQuery('(max-width:1024px)')
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [stateList, setStateList] = useState<StateAllResponseType | null>(
        null,
    )
    const [cityList, setCityList] = useState<DistrictAllResponseType | null>(
        null,
    )
    const [facilityList, setFacilityList] =
        useState<RhfFacilityListType | null>(null)

    useEffect(() => {
        !stateList &&
            !isLoading &&
            (() => {
                setIsLoading(true)
                getAllStateApi()
                    .then(res => setStateList(res.data as StateAllResponseType))
                    .catch(() =>
                        dispatch(
                            setSnackBar({
                                open: true,
                                message: t(
                                    'common_error_messages.something_went_wrong',
                                ),
                                severity: 'error',
                            }),
                        ),
                    )
                    .finally(() => setIsLoading(false))
            })()
    }, [dispatch, stateList, t, isLoading])

    const formik = useFormik({
        initialValues: {
            state: '',
            city: '',
        },
        onSubmit: value => {
            if (isLoading) {
                return
            }
            setIsLoading(true)
            getRhfFacilityListApi({
                stateCode: value.state,
                districtCode: value.city,
            })
                .then(r => {
                    setFacilityList(r?.data)
                })
                .catch(() => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => setIsLoading(false))
        },
    })

    const handleChange = (event: SelectChangeEvent<string>) => {
        if (isLoading) {
            return
        }
        if (event.target.name === 'state') {
            setIsLoading(true)
            formik.setFieldValue('city', '')
            getDistrictListApi(event.target.value)
                .then(r => {
                    setCityList(r?.data)
                })
                .catch(() => {
                    dispatch(
                        setSnackBar({
                            open: true,
                            message: t(
                                'common_error_messages.something_went_wrong',
                            ),
                            severity: 'error',
                        }),
                    )
                })
                .finally(() => setIsLoading(false))
        }
        formik.handleChange(event)
    }

    return (
        <div className="flex-row-center-wrap" style={{ maxWidth: '100vw' }}>
            {!(isSmallDisplay && facilityList !== null) && (
                <div className="facility-locator-container">
                    <div className="facility-locator-title">
                        Locate Health Facility
                    </div>
                    <div className="facility-locator-description">
                        Locate your nearest local health facility for your
                        medical check-ups and upload the certificate to the
                        portal.
                    </div>
                    <form
                        className="facility-form-container"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="form-fields">
                            <FormControl>
                                <InputLabel id="govtIdType" required>
                                    State
                                </InputLabel>
                                <Select
                                    label="State"
                                    id="state"
                                    name="state"
                                    onChange={handleChange}
                                    value={formik.values.state}
                                    variant="standard"
                                    required
                                    fullWidth
                                >
                                    {Array.isArray(stateList) &&
                                        stateList.map(state => (
                                            <MenuItem
                                                key={state.stateCode}
                                                value={state.stateCode}
                                            >
                                                {state.stateName}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="govtIdType" required>
                                    City/Village
                                </InputLabel>
                                <Select
                                    label="City/Village"
                                    id="city"
                                    name="city"
                                    onChange={handleChange}
                                    value={formik.values.city}
                                    variant="standard"
                                    required
                                    fullWidth
                                >
                                    {Array.isArray(cityList) &&
                                        cityList.map(city => (
                                            <MenuItem
                                                key={city.districtCode}
                                                value={city.districtCode}
                                            >
                                                {city.districtName}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Button
                            className="search-button"
                            type="submit"
                            disabled={isLoading}
                        >
                            Search Facility &nbsp;
                            {isLoading && (
                                <CircularProgress
                                    color="inherit"
                                    variant="indeterminate"
                                    size={'1em'}
                                />
                            )}
                        </Button>
                    </form>
                </div>
            )}
            {facilityList !== null && (
                <>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <FacilityList
                        facilityList={facilityList}
                        isLoading={isLoading}
                        onBackButton={() => setFacilityList(null)}
                    />
                </>
            )}
        </div>
    )
}

export default LocateRHF
