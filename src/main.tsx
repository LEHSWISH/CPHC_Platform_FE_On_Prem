/**
 * Main Entry Point
 * 
 * This file is the main entry point of the React application. It sets up the 
 * root React component and renders it into the DOM. It also wraps the application
 * in the Redux Provider to make the store available to all components.
 * Additionally, it imports global styles..
 */


import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from './services/store/store.ts'
import App from './App.tsx'
import './index.css'
import './services/i18n/config.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)
