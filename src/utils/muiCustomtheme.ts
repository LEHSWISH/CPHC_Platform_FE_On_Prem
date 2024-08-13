/**
 * MUI Custom Theme Configuration
 * 
 * This file defines the custom theme for the Material-UI (MUI) components in the application.
 * It customizes the color palette, component styles, and overrides default styles to maintain
 * a consistent look and feel across the application.
 */


import { createTheme } from '@mui/material'

const muiCustomtheme = createTheme({
    palette: {
        primary: {
            main: 'rgba(51, 24, 159, 1)',
            light: 'rgba(51, 24, 159, 0.05)', // primary blue 5%
            dark: 'rgba(0, 0, 0, 0.5)', // grey 50%
        },
        text: {
            primary: 'rgba(32, 32, 32, 1)',
            secondary: 'rgba(108, 105, 105, 1)', // placeholder default
            disabled: 'rgba(158, 158, 158, 1)', // grey
        },
        error: {
            main: 'rgba(199, 65, 58, 1)',
        },
        background: {
            paper: 'rgba(255, 255, 255, 1)',
        },
    },
    components: {
        MuiInput: {
            styleOverrides: {
                root: ({ theme }) => {
                    return {
                        paddingLeft: '0.8rem',
                        borderBottomColor: 'rgba(32, 32, 32, 0.5)',
                        '&:hover': {
                            background: theme.palette.primary.light,
                            borderBottomColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused': {
                            borderBottomColor: theme.palette.primary.main,
                        },
                        '&.Mui-active': {
                            borderBottomColor: theme.palette.primary.dark,
                        },
                        '&.Mui-error': {
                            borderBottomColor: theme.palette.error.main,
                        },
                    }
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => {
                    return {
                        left: '0.8rem',
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        '&:hover': {
                            color: theme.palette.text.primary,
                        },
                        '&.Mui-focused': {
                            color: theme.palette.primary.main,
                        },
                        '&.Mui-active': {
                            color: theme.palette.primary.dark,
                            fontWeight: 400,
                        },
                        '&.Mui-error': {
                            color: theme.palette.text.primary,
                        },
                    }
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    marginLeft: '0.8rem',
                    marginRight: '0.8rem',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    border: '1px solid rgba(51, 24, 159, 0.2)',
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em',
                    height: '2.5em',
                    borderRadius: '1.25em',
                    '&.selected': {
                        backgroundColor: 'rgba(51, 24, 159, 0.12)',
                        border: '1px solid rgba(51, 24, 159, 0.8)',
                    },
                    '&:hover.selected': {
                        backgroundColor: 'rgba(51, 24, 159, 0.2)',
                    },
                },
                label: {
                    color: 'rgba(32, 32, 32, 1)',
                    fontSize: '1rem',
                    fontWeight: 'normal',
                },
                deleteIcon: {
                    color: 'rgba(32, 32, 32, 1)',
                    '&:hover': {
                        color: 'rgba(32, 32, 32, 0.4)',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'rgba(32, 32, 32, 1)',
                    textTransform: 'initial',
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: () => {
                    return {
                        '&:hover': {
                            background: 'rgba(51, 24, 159, 0.04)',
                        },
                    }
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: () => {
                    return {
                        textTransform: 'none',
                        '&:hover': {
                            background: 'none',
                        },
                    }
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: () => {
                    return {
                        textTransform: 'none',
                    }
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    padding: '20px',
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                    fontSize: '14px',
                    color: '#202020',
                    backgroundColor: '#FFF',
                    borderRadius: '8px',
                    boxShadow: '-2px 2px 12px 0px rgba(38, 38, 38, 0.15',
                },
            },
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    position: 'absolute',
                    bottom: '5rem',
                    right: '1rem',
                    color: '#fff',
                    backgroundColor: 'rgba(51, 24, 159, 1)',
                    '&:hover': {
                        backgroundColor: 'rgba(51, 24, 159, 1)',
                    }
                }
            }
        }
    },
})

export default muiCustomtheme
