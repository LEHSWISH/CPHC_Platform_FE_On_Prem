import React, { useState } from 'react'
import selectedIcon from '../../../assets/icons/check-blue.svg'
import {
    List,
    ListItem,
    Avatar,
    ListItemText,
    Divider,
    ListItemIcon,
    Box,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { convertBase64ToImage } from '../../../utils/HelperFunctions'
import SearchIcon from '../../../assets/icons/search.svg'

function UsersListDetailed(props: UserSelectionListProps) {
    const theme = useTheme()
    const [searchQuery, setSearchQuery] = useState('')

    const filteredUsers = props.users.filter(user =>
        user.primaryData.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return (
        <Box>
            {props.variant === 'typeTwo' ? (
                <div
                    className="input-container"
                    style={{ marginBottom: '14px' }}
                >
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            outline: 'none',
                            padding: '12px',
                            fontSize: '16px',
                            lineHeight: '19px',
                            paddingLeft: '44px',
                            borderRadius: '8px',
                            color: 'rgba(108, 105, 105, 1)',
                            background: 'rgba(255, 255, 255, 1)',
                            backgroundImage: `url(${SearchIcon})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: '12px 10px',
                            border: '1px solid rgba(51, 24, 159, 0.1)',
                            boxShadow:
                                '0px 0px 4px 0px rgba(108, 105, 105, 0.2)',
                        }}
                    />
                </div>
            ) : (
                <></>
            )}
            <Box
                sx={
                    props.variant === 'typeTwo'
                        ? {
                              maxHeight: '280px',
                              overflowY: 'auto',
                          }
                        : {}
                }
            >
                <List>
                    {filteredUsers.map((user, index) => (
                        <React.Fragment
                            key={user.uniqueKey || user.primaryData}
                        >
                            <ListItem
                                onClick={() => {
                                    props.onSelectUser(
                                        user.uniqueKey || user.primaryData,
                                    )
                                    user.extraData &&
                                        props.extraDataOnSelectUser &&
                                        props.extraDataOnSelectUser(
                                            user.extraData,
                                        )
                                }}
                                sx={{
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    marginBlock: 1,
                                    cursor: 'pointer',
                                    ...(props.selectedUser ===
                                        (user.uniqueKey ||
                                            user.primaryData) && {
                                        border: '1px solid rgba(51, 24, 159, 0.6)',
                                    }),
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(51, 24, 159, 0.6)',
                                        color: 'rgba(255, 255, 255, 1)',
                                        marginRight: '12px',
                                        fontSize: '20px',
                                        fontWeight: '400',
                                        lineHeight: '23px',
                                        height: '35px',
                                        width: '35px',
                                    }}
                                >
                                    {user.profilePhoto?.length ? (
                                        <img
                                            src={convertBase64ToImage(
                                                user.profilePhoto,
                                                'test',
                                                'png',
                                            )}
                                            style={{
                                                height: '100%',
                                            }}
                                        />
                                    ) : (
                                        user.primaryData[0].toUpperCase()
                                    )}
                                </Avatar>
                                <div>
                                    <ListItemText
                                        primary={user.primaryData}
                                        primaryTypographyProps={{
                                            fontSize: '1.2rem',
                                            lineHeight: '21px',
                                            fontWeight: '500',
                                            sx: {
                                                [theme.breakpoints.down('sm')]:
                                                    {
                                                        fontSize: '1rem',
                                                        // lineHeight: '19px',
                                                    },
                                            },
                                        }}
                                        style={{
                                            margin: '0',
                                        }}
                                        secondary={user.secondaryData}
                                    />
                                    <span
                                        style={{
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {user.extraData}
                                    </span>
                                </div>
                                <ListItemIcon
                                    sx={{
                                        minWidth: '25px',
                                        marginLeft: 'auto',
                                    }}
                                >
                                    {props.selectedUser ===
                                    (user.uniqueKey || user.primaryData) ? (
                                        <img
                                            src={selectedIcon}
                                            alt="selected"
                                        />
                                    ) : null}
                                </ListItemIcon>
                            </ListItem>
                            {index !== props.users.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    )
}

interface User {
    uniqueKey?: string
    primaryData: string
    secondaryData: string
    extraData?: any
    profilePhoto?: string
}

interface UserSelectionListProps {
    users: User[]
    variant?: string
    selectedUser: string
    onSelectUser: (user: string) => void
    extraDataOnSelectUser?: (data: any) => void
}

export default UsersListDetailed
