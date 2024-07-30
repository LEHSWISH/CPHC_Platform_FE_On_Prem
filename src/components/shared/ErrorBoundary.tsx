import React, { Component, ErrorInfo } from 'react'
import { t } from 'i18next'

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo)
        this.setState({ hasError: true })
    }

    render() {
        if (this.state.hasError) {
            return <h1>{t('common_error_messages.something_went_wrong')}</h1> // TODO: error needs to be done dynamic so a user can provide its own error or a common page
        }

        return this.props.children
    }
}

export default ErrorBoundary
