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
import SearchIcon from '../../../assets/icons/search.svg'

function UsersList(props: UserSelectionListProps) {
    const theme = useTheme()
    const [searchQuery, setSearchQuery] = useState('')

    const filteredUsers = props.users.filter(user =>
        user.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return (
        <Box>
            <div className="input-container" style={{ marginBottom: '14px' }}>
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
                        boxShadow: '0px 0px 4px 0px rgba(108, 105, 105, 0.2)',
                    }}
                />
            </div>
            <Box
                sx={{
                    maxHeight: '246px',
                    overflowY: 'auto',
                }}
            >
                <List>
                    {filteredUsers.map((user, index) => (
                        <React.Fragment key={user}>
                            <ListItem
                                onClick={() => props.onSelectUser(user)}
                                sx={{
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    marginBlock: 1,
                                    cursor: 'pointer',
                                    ...(props.selectedUser === user && {
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
                                        height: '28px',
                                        width: '28px',
                                    }}
                                >
                                    {props.username
                                        ? props.username[0].toUpperCase()
                                        : user[0].toUpperCase()}
                                </Avatar>
                                <ListItemText
                                    primary={user}
                                    primaryTypographyProps={{
                                        fontSize: '1.2rem',
                                        lineHeight: '21px',
                                        fontWeight: '500',
                                        sx: {
                                            [theme.breakpoints.down('sm')]: {
                                                fontSize: '1rem',
                                                lineHeight: '19px',
                                            },
                                        },
                                    }}
                                />
                                <ListItemIcon sx={{ minWidth: '25px' }}>
                                    {props.selectedUser === user ? (
                                        <img
                                            src={selectedIcon}
                                            alt="selected"
                                        />
                                    ) : null}
                                </ListItemIcon>
                            </ListItem>
                            {props.variant === 'typeTwo' ? (
                                <Divider />
                            ) : (
                                index !== props.users.length - 1 && <Divider />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    )
}

interface UserSelectionListProps {
    users: string[]
    variant?: string
    username?: string
    selectedUser: string
    onSelectUser: (user: string) => void
}

export default UsersList
