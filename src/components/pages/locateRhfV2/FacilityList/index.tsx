import { Fragment, useEffect, useRef, useState } from 'react'
import {
    Paper,
    IconButton,
    InputBase,
    CircularProgress,
    useMediaQuery,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { RhfFacilityListType } from '../../../../interface/ApiResponseTypes'
import BackButtonWithTitle from '../../../shared/BackButtonWithTitle'
import './facilityList.styles.scss'
import { coreRoutesEnum } from '../../../../enums/routingEnums'
import { useNavigate } from 'react-router-dom'

interface FacilityListPropType {
    facilityList: RhfFacilityListType
    isLoading: boolean
    fromHomePage: boolean
    onBackButton: () => void
}

function FacilityList({
    facilityList,
    isLoading,
    onBackButton,
    fromHomePage
}: FacilityListPropType) {
    const navigate = useNavigate()
    const [searchText, setSearchText] = useState('')
    const [filteredFaciltyList, setFilteredFacilityList] =
        useState<RhfFacilityListType>(facilityList)
    const timeOutId = useRef<any>()
    const isSmallDisplay = useMediaQuery('(max-width:1024px)')

    useEffect(() => {
        setSearchText('')
    }, [facilityList])

    useEffect(() => {
        timeOutId.current = setTimeout(() => {
            if (!searchText) {
                setFilteredFacilityList(facilityList)
            } else {
                const lText = searchText?.toLowerCase()
                setFilteredFacilityList(
                    facilityList.filter(
                        i =>
                            i.facilityName?.toLowerCase()?.includes(lText) ||
                            i.facilityId?.toLowerCase()?.includes(lText) ||
                            i.facilityType?.toLowerCase()?.includes(lText) ||
                            i.ownership?.toLowerCase()?.includes(lText) ||
                            i.address?.toLowerCase()?.includes(lText),
                    ),
                )
            }
        }, 300)
        return () => {
            clearInterval(timeOutId.current)
        }
    }, [facilityList, searchText])

    useEffect(() => {
        return () => {
            clearInterval(timeOutId.current)
        }
    }, [])
   
    return (
        <div className="facility-list-v2-container">
            {isSmallDisplay && (
                <BackButtonWithTitle
                    onBack={onBackButton}
                    titleElement={
                        <div className="facility-locator-title">
                            Registered Medical Facilities
                        </div>
                    }
                />
            )}

            {isLoading ? (
                <CircularProgress
                    sx={{ m: 'auto' }}
                    color="primary"
                    variant="indeterminate"
                />
            ) : (
                <>
                    <div className="search-container">
                        {!isSmallDisplay && (
                            <div className="facility-locator-title">
                                Registered Medical Facilities
                            </div>
                        )}
                        <Paper
                            className="search"
                            component="form"
                            sx={{
                                m: '1rem',
                                p: '0.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                // width: 400,
                            }}
                        >
                            <IconButton sx={{ p: '10px' }} aria-label="search">
                                <Search />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={e => setSearchText(e?.target?.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        return
                                    }
                                }}
                            />
                        </Paper>
                    </div>

                    {!filteredFaciltyList?.length && (
                        <div className="no-result">
                            No Registered health facility found
                        </div>
                    )}

                    <div className="list-wrapper">
                        {filteredFaciltyList?.map((f, i) => (
                            <Fragment key={`${f.facilityId}${f.address}${i}`}>
                                <div className="item">
                                    <div className="title-row">
                                        <div className="title">
                                            {f.facilityName}
                                        </div>
                                        {!isSmallDisplay && (
                                            <div className="facility-type">
                                                ({f.facilityType})
                                            </div>
                                        )}
                                        <div className="ownership">
                                            {f.ownership}
                                        </div>
                                    </div>
                                    <div className="detail">
                                        <div className="labels">
                                            Facility ID :
                                        </div>
                                        <div className="values">
                                            {f.facilityId}
                                        </div>
                                    </div>
                                    {isSmallDisplay && (
                                        <div className="detail">
                                            <div className="labels">
                                                Facility Type :
                                            </div>
                                            <div className="values">
                                                {f.facilityType}
                                            </div>
                                        </div>
                                    )}
                                    <div className="detail">
                                        <div className="labels">Address :</div>
                                        <div className="values">
                                            {f.address}
                                        </div>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                    <div className="medical-record-button">
                        { !fromHomePage && 
                            <button
                            className="m-btn"
                            onClick={() =>
                                navigate(`/${coreRoutesEnum.MEDICAL_RECORDS}`)
                            }
                        >
                            Back to Medical Records
                        </button>
                        }
                    </div>
                </>
            )}
        </div>
    )
}
export default FacilityList
