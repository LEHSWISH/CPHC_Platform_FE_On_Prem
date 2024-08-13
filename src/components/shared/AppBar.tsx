import { useEffect, useState, MouseEvent, useRef, useCallback } from 'react'
import AppBarMUI from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import UttarakhandGovtLogo1 from '../../assets/icons/UttarakhandGovtLogo1.svg'
import NhmLogo1 from '../../assets/icons/NhmLogo1.svg'
import ManageAccountsSvg from '../../assets/icons/manageAccounts.svg'
import { useAppDispatch } from '../../utils/hooks/useAppDispatch'
import {
    logoutYatri,
    switchToMainUser,
} from '../../services/store/slices/authSlice'
import { Divider, ListItemIcon, styled } from '@mui/material'
import { AppBarPropsType } from '../../interface/appDrawerWrapper/appDrawerWrapper'
import careGiver from '../../assets/icons/GroupHeart 499.svg'
import { useNavigate } from 'react-router-dom'
import { coreRoutesEnum } from '../../enums/routingEnums'
import { useAppSelector } from '../../utils/hooks/useAppSelector'
import { setFullPageLoader } from '../../services/store/slices/generalSlice'

const SwitchToMyDashboardButtonWrapperMobile = styled('div')({
    background:
        'linear-gradient(180deg, rgba(51, 24, 159, 0.004) 0%, rgba(51, 24, 159, 0.05) 100%)',
    padding: '9px 0 8px 0',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
})

const SwitchToMyDashboardButton = styled('button')({
    border: '1px solid rgba(51, 24, 159, 1)',
    boxShadow: '0px 3px 6px 0px rgba(32, 32, 32, 0.3)',
    background: 'rgba(255, 255, 255, 1)',
    cursor: 'pointer',
    padding: '9px 58px 8px 58px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: '1.2em',
    textAlign: 'center',
    color: 'rgba(51, 24, 159, 1)',
})

function AppBar({
    toggleDrawer,
    isSmallDisplay,
    onHeightChanged,
}: AppBarPropsType) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const appBarRef = useRef<HTMLElement>(null)
    const appBarPreviousHeightRef = useRef(100)
    const isGuestUserActive = useAppSelector(
        s => s.auth.config.isGuestUserActive,
    )
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleLogout = () => {
        handleCloseUserMenu()
        dispatch(logoutYatri())
    }

    const handleOpenCareGiver = () => {
        navigate(coreRoutesEnum.CARE_GIVER)
    }

    const handleSwitchToMyDashboard = useCallback(() => {
        dispatch(setFullPageLoader(true))
        dispatch(switchToMainUser())
    }, [dispatch])

    useEffect(() => {
        if (appBarRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                const newHeight = Math.ceil(
                    entries?.[0]?.contentRect?.height || 0,
                )
                if (
                    typeof newHeight === 'number' &&
                    appBarPreviousHeightRef.current !== newHeight
                ) {
                    appBarPreviousHeightRef.current = newHeight
                    onHeightChanged && onHeightChanged(newHeight)
                }
            })
            resizeObserver.observe(appBarRef.current)
            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [onHeightChanged])

    return (
        <AppBarMUI position="fixed" sx={{ bgcolor: 'white' }} ref={appBarRef}>
            <Container maxWidth={false}>
                <Toolbar
                    disableGutters
                    sx={
                        isSmallDisplay
                            ? { justifyContent: 'space-between', gap: '10px' }
                            : { gap: '10px' }
                    }
                >
                    {isSmallDisplay && (
                        <IconButton
                            aria-label="open drawer"
                            onClick={toggleDrawer(true)}
                            edge="start"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            gap: '11px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={UttarakhandGovtLogo1}
                            alt="Uttrakhand Simply Heaven!"
                            width={55}
                        />

                        <Divider
                            orientation="vertical"
                            variant="fullWidth"
                            flexItem
                        />
                        <img
                            src={NhmLogo1}
                            alt="Uttrakhand Simply Heaven!"
                            width={55}
                        />
                    </div>

                    <Box
                        sx={{
                            flexGrow: 0,
                            ml: isSmallDisplay ? '' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {!isSmallDisplay && isGuestUserActive && (
                            <SwitchToMyDashboardButton
                                className="button-switch-profile"
                                onClick={handleSwitchToMyDashboard}
                            >
                                Switch to my dashboard
                            </SwitchToMyDashboardButton>
                        )}
                        {!isSmallDisplay && (
                            <Tooltip title={'Open Care giver'}>
                                <IconButton onClick={handleOpenCareGiver}>
                                    <Avatar
                                        alt="open care giver"
                                        src={careGiver}
                                        sx={{ width: 34, height: 34 }}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 1 }}
                            >
                                <Avatar
                                    alt="Manage account"
                                    src={ManageAccountsSvg}
                                    sx={{ width: 24, height: 24 }}
                                />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutOutlinedIcon fontSize="medium" />
                                </ListItemIcon>
                                <Typography textAlign="center">
                                    {'Logout'}
                                </Typography>
                            </MenuItem>
                        </Menu>
                        <Typography
                            variant="h6"
                            component="span"
                            sx={{ flexGrow: 1, color: 'rgba(32, 32, 32, 1)' }}
                        >
                            Yatri
                        </Typography>
                    </Box>
                </Toolbar>
            </Container>
            {isSmallDisplay && isGuestUserActive && (
                <SwitchToMyDashboardButtonWrapperMobile>
                    <SwitchToMyDashboardButton
                        className="button-switch-profile"
                        onClick={handleSwitchToMyDashboard}
                    >
                        Switch to my dashboard
                    </SwitchToMyDashboardButton>
                </SwitchToMyDashboardButtonWrapperMobile>
            )}
        </AppBarMUI>
    )
}
export default AppBar
