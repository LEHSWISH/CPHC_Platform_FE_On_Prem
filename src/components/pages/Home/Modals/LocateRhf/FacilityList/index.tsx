import { Fragment, useEffect, useRef, useState } from 'react'
import {
    Divider,
    Paper,
    IconButton,
    InputBase,
    CircularProgress,
    useMediaQuery,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { RhfFacilityListType } from '../../../../../../interface/ApiResponseTypes'
import BackButtonWithTitle from '../../../../../shared/BackButtonWithTitle'
import './facilityList.styles.scss'

interface FacilityListPropType {
    facilityList: RhfFacilityListType
    isLoading: boolean
    onBackButton: () => void
}

function FacilityList({
    facilityList,
    isLoading,
    onBackButton,
}: FacilityListPropType) {
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
                            `${i.abdmEnabled}`
                                ?.toLowerCase()
                                ?.includes(lText) ||
                            i.facilityType?.toLowerCase()?.includes(lText) ||
                            i.facilityStatus?.toLowerCase()?.includes(lText) ||
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
        <div className="facility-list-container">
            {isSmallDisplay ? (
                <BackButtonWithTitle
                    onBack={onBackButton}
                    titleElement={
                        <div className="facility-locator-title">
                            Medical Health Facilities
                        </div>
                    }
                />
            ) : (
                <div className="facility-locator-title">
                    Medical Health Facilities
                </div>
            )}

            <Divider orientation="horizontal" variant="middle" />

            {isLoading ? (
                <CircularProgress
                    sx={{ m: 'auto' }}
                    color="primary"
                    variant="indeterminate"
                />
            ) : (
                <>
                    <Paper
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
                        />
                    </Paper>

                    {!filteredFaciltyList?.length && (
                        <div className="no-result">
                            No Registered health facility found
                        </div>
                    )}

                    <div className="list-wrapper">
                        {filteredFaciltyList?.map((f, i) => (
                            <Fragment key={`${f.facilityId}${f.address}${i}`}>
                                {!!i && (
                                    <Divider
                                        orientation="horizontal"
                                        variant="middle"
                                    />
                                )}
                                <div className="item">
                                    <div className="title">
                                        {f.facilityName}
                                    </div>
                                    <div className="detail">
                                        <div className="labels">
                                            Facility ID :
                                        </div>
                                        <div className="values">
                                            {f.facilityId}
                                        </div>
                                    </div>

                                    <div className="detail">
                                        <div className="labels">
                                            Facility Type :
                                        </div>
                                        <div className="values">
                                            {f.facilityType}
                                        </div>
                                    </div>

                                    <div className="detail">
                                        <div className="labels">
                                            Ownership :
                                        </div>
                                        <div className="values">
                                            {f.ownership}
                                        </div>
                                    </div>

                                    <div className="detail">
                                        <div className="labels">Address :</div>
                                        <div className="values">
                                            {f.address}
                                        </div>
                                    </div>
                                    {/* Might be used in future, else remove it */}
                                    {/* <div className="detail">
                                        <div className="labels">
                                            Facility Status :
                                        </div>
                                        <div className="values">
                                            {f.facilityStatus}
                                        </div>
                                    </div>

                                    <div className="detail">
                                        <div className="labels">
                                            ABDM Enabled :
                                        </div>
                                        <div className="values">
                                            {f.abdmEnabled ? 'Yes' : 'No'}
                                        </div>
                                    </div> */}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default FacilityList
