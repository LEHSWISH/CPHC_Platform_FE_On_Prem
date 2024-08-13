export interface DrawerMenuPropTypes {
    toggleDrawer: (
        open: boolean,
    ) => (event: React.KeyboardEvent | React.MouseEvent) => void
}

export interface AppDrawerWrapperPropTypes {
    children: React.ReactNode
}

export interface AppBarPropsType {
    toggleDrawer: (
        open: boolean,
    ) => (event: React.KeyboardEvent | React.MouseEvent) => void
    isSmallDisplay: boolean
    onHeightChanged?: (height: number) => void
}