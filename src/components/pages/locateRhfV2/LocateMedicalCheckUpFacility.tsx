import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    useMediaQuery,
} from '@mui/material'
import { useFormik } from 'formik'
import './locateMedicalCheckUpFacility.style.scss'
import {
    getAllStateApi,
    getDistrictListApi,
    getRhfFacilityListApi,
} from '../../../services/api'
import {
    DistrictAllResponseType,
    RhfFacilityListType,
    StateAllResponseType,
} from '../../../interface/ApiResponseTypes'
import { setSnackBar } from '../../../services/store/slices/generalSlice'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import FacilityList from './FacilityList'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import Footer from '../../shared/Footer/Footer'
import Breadcrumb from '../../shared/breadCrumb/Breadcrumb'
import { coreRoutesEnum } from '../../../enums/routingEnums'
import BackButtonWithTitle from '../../shared/BackButtonWithTitle'
import EnterLocationDisplayFacilityRecord from './EnterLocationDisplayFacilityRecord/EnterLocationDisplayFacilityRecord'

function LocateMedicalCheckUpFacility() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const location = useLocation();
    const fromHomePage = location.state?.fromHomePage || false;
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

    const isYatriAuthLoading = useAppSelector(s => s.auth.yatri.loading)
    const isYatriDetailsLoading = useAppSelector(
        s => s.yatri.yatriAllDetails.loading,
    )

    useEffect(() => {
        !isYatriAuthLoading &&
            !isYatriDetailsLoading &&
            !stateList &&
            !isLoading &&
            (() => {
                setIsLoading(true)
                getAllStateApi()
                    .then(res => {
                        const sortedData = res.data.sort((a, b) => a.stateName.localeCompare(b.stateName));
                        setStateList(sortedData as StateAllResponseType);
                    })
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
    }, [
        dispatch,
        stateList,
        t,
        isLoading,
        isYatriAuthLoading,
        isYatriDetailsLoading,
    ])

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

    const breadcrumbClickableListItems = useMemo(() => {
        if(fromHomePage) {
            return [
                {
                    label: 'eSwasthya Dham',
                    onClick: () => navigate('/', { replace: true }),
                },
                { label: 'Medical Check-up Facility', onClick: () => {} },
            ]
        } else {
            return [
                {
                    label: 'eSwasthya Dham',
                    onClick: () => navigate('/', { replace: true }),
                },
                {
                    label: 'Medical Records',
                    onClick: () =>
                        navigate(`/${coreRoutesEnum.MEDICAL_RECORDS}`, {
                            replace: true,
                        }),
                },
                { label: 'Medical Check-up Facility', onClick: () => {} },
            ]
        }
    }, [navigate, fromHomePage])

    return (
        <div className="locate-medical-checkup-facility-container">
            {!(isSmallDisplay && facilityList !== null) && (
                <div className="facility-locator-container-v2">
                    <Breadcrumb
                        clickableListItems={breadcrumbClickableListItems}
                    />
                    <div className="facility-locator-title">
                        <span className="back-medical-button-div">
                            <BackButtonWithTitle
                                backButtonChildElement={
                                    <span className="back-button">Back</span>
                                }
                                onBack={() =>
                                    navigate(
                                        `/${coreRoutesEnum.MEDICAL_RECORDS}`,
                                    )
                                }
                            />
                        </span>
                        <span className="locate-medical-span">
                            Locate Medical Check-up Facility
                        </span>
                    </div>
                    <div className="facility-locator-description">
                        Locate your nearest local medical facility for your
                        health check-ups and upload the certificate to the
                        portal.
                    </div>
                    <form
                        className={`facility-form-container ${
                            +isSmallDisplay ? 'direction-column' : ''
                        }`}
                        onSubmit={formik.handleSubmit}
                    >
                        <FormControl>
                            <InputLabel
                                required
                                shrink={true}
                                variant="standard"
                                htmlFor="state"
                            >
                                State
                            </InputLabel>
                            <Select
                                id="state"
                                name="state"
                                onChange={handleChange}
                                value={formik.values.state}
                                variant="standard"
                                required
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select State
                                </MenuItem>
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
                            <InputLabel
                                required
                                shrink={true}
                                variant="standard"
                                htmlFor="city"
                            >
                                District
                            </InputLabel>
                            <Select
                                id="city"
                                name="city"
                                onChange={handleChange}
                                value={formik.values.city}
                                variant="standard"
                                required
                                fullWidth
                                displayEmpty
                            >
                                <MenuItem
                                    value=""
                                    disabled
                                    className="placeholder"
                                >
                                    Select City/village
                                </MenuItem>
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
                    <FacilityList
                        facilityList={facilityList}
                        isLoading={isLoading}
                        fromHomePage={fromHomePage}
                        onBackButton={() => setFacilityList(null)}
                    />
                </>
            )}
            {facilityList === null && (
                <>
                    <EnterLocationDisplayFacilityRecord
                        fromHomePage={fromHomePage}
                    />
                </>
            )}
            <Footer />
        </div>
    )
}

export default LocateMedicalCheckUpFacility
