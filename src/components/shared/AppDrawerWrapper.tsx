import { useCallback, useState } from 'react'
import { Drawer, Toolbar, useMediaQuery } from '@mui/material'
import { AppDrawerWrapperPropTypes } from '../../interface/appDrawerWrapper/appDrawerWrapper'
import AppBar from './AppBar'
import DrawerMenu from './DrawerMenu'

const AppDrawerWrapper = ({ children }: AppDrawerWrapperPropTypes) => {
    const isSmallDisplay = useMediaQuery('(max-width:1024px)')
    const [dummyToolbarHeight, setDummyToolbarHeight] = useState(100)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleDrawer = useCallback(
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return
            }
            setIsDrawerOpen(open)
        },
        [],
    )

    const onHeightChanged = useCallback((newHeight: number) => {
        setDummyToolbarHeight(newHeight)
    }, [])

    return (
        <section
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AppBar
                toggleDrawer={toggleDrawer}
                isSmallDisplay={isSmallDisplay}
                onHeightChanged={onHeightChanged}
            />
            <Drawer
                anchor={'left'}
                open={isSmallDisplay && isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <DrawerMenu toggleDrawer={toggleDrawer} />
            </Drawer>
            <Toolbar style={{ height: `${dummyToolbarHeight}px` }} />
            <section style={{ overflow: 'auto', flexGrow: 1 }}>
                {children}
            </section>
        </section>
    )
}

export default AppDrawerWrapper
