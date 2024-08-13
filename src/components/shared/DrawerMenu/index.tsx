import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Avatar,
    Box,
    Card,
    // Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import './drawer-menu.style.scss'
import { logoutYatri } from '../../../services/store/slices/authSlice'
import profileIconSvg from '../../../assets/icons/profileIcon.svg'
import homeIconSvg from '../../../assets/icons/home-2.svg'
import logoutIconSvg from '../../../assets/icons/logout.svg'
import clipboardIconSvg from '../../../assets/icons/clipboard-list.svg'
import careGiverDrawerMenu from '../../../assets/icons/careGiverDrawerMenu.svg'
import { useAppSelector } from '../../../utils/hooks/useAppSelector'
import { useAppDispatch } from '../../../utils/hooks/useAppDispatch'
import {
    coreRoutesEnum,
    homeNestedRoutesEnum,
} from '../../../enums/routingEnums'
import { DrawerMenuPropTypes } from '../../../interface/appDrawerWrapper/appDrawerWrapper'
import Footer from '../Footer/Footer'

const DrawerMenu = ({ toggleDrawer }: DrawerMenuPropTypes) => {
    const yatriDetails = useAppSelector(s => s.yatri.yatriAllDetails.data)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleOnLogOut = () => dispatch(logoutYatri())

    const handleNavigate = useCallback(
        (route: string) => (ev: React.MouseEvent) => {
            navigate(route)
            toggleDrawer(false)(ev)
        },
        [navigate, toggleDrawer],
    )
    return (
        <Box
            sx={{
                width: 'min(306px, 100vw)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            role="presentation"
            onKeyDown={toggleDrawer(false)}
        >
            <List className="drawer-list">
                <ListItem
                    onClick={handleNavigate(
                        `/${coreRoutesEnum.HOME}/${homeNestedRoutesEnum.YATRI_PROFILE}`,
                    )}
                >
                    <Card className="profile-card">
                        <Avatar
                            alt="Manage account"
                            src={profileIconSvg}
                            sx={{ width: 50, height: 50 }}
                        />
                        <div className="card-info">
                            <div className="primary">
                                Hi{' '}
                                {yatriDetails?.yatriDetails?.fullName || '-'}
                            </div>
                            <div className="secondary">
                                {yatriDetails?.userName || '-'}
                            </div>
                        </div>
                        <ChevronRightIcon className="chevron-right" />
                    </Card>
                </ListItem>
            </List>
            <List
                className="drawer-list-group"
                sx={{ marginX: 2, mb: 2 }}
                disablePadding
            >
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleNavigate(`/${coreRoutesEnum.HOME}`)}
                    >
                        <ListItemIcon>
                            <img src={homeIconSvg} />
                        </ListItemIcon>
                        <ListItemText primary={'eSwasthya Dham'} />
                        <ChevronRightIcon className="chevron-right" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleNavigate(
                            yatriDetails?.yatriDetails
                                ? `/${coreRoutesEnum.HOME}/${homeNestedRoutesEnum.VIEW_YATRA_DETAILS}`
                                : `/${coreRoutesEnum.HOME}/${homeNestedRoutesEnum.YATRA_DETAILS}`,
                        )}
                    >
                        <ListItemIcon>
                            <img src={clipboardIconSvg} />
                        </ListItemIcon>
                        <ListItemText primary={'Yatri Details'} />
                        <ChevronRightIcon className="chevron-right" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleNavigate(
                            `/${coreRoutesEnum.CARE_GIVER}`,
                        )}
                    >
                        <ListItemIcon>
                            <img src={careGiverDrawerMenu} />
                        </ListItemIcon>
                        <ListItemText primary={'Caregiver'} />
                        <ChevronRightIcon className="chevron-right" />
                    </ListItemButton>
                </ListItem>
            </List>
            <List
                className="drawer-list-group"
                sx={{ marginX: 2, mb: 2 }}
                disablePadding
            >
                <ListItem disablePadding>
                    <ListItemButton onClick={handleOnLogOut}>
                        <ListItemIcon>
                            <img src={logoutIconSvg} />
                        </ListItemIcon>
                        <ListItemText primary={'Logout'} />
                        <ChevronRightIcon className="chevron-right" />
                    </ListItemButton>
                </ListItem>
            </List>
            {/* >>> commented for stage 1
            <List className="drawer-footer-links" sx={{ mt: 'auto' }}>
                <a>Terms of Use</a>
                <Divider orientation="vertical" />
                <a>Privacy Policy</a>
            </List>
            */}
            <List className="drawer-footer" sx={{ mt: 'auto' }} disablePadding>
                <div></div>
                <Footer />
            </List>
        </Box>
    )
}

export default DrawerMenu
