import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { coreRoutesEnum } from '../../enums/routingEnums';

const useAddToHomeScreenPrompt = () => {
    const location = useLocation();
    const promptRef = useRef<any | null>(null);

    useEffect(() => {
        const beforeInstallPromptHandler = (event: any) => {
            event.preventDefault();
            promptRef.current = event;
        };

        if (location.pathname === `/${coreRoutesEnum.LOG_IN}` || location.pathname === `/${coreRoutesEnum.SIGN_UP}`) {
            window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
        };
    }, [location.pathname]);

    useEffect(() => {
        const userGestureHandler = () => {
            if (promptRef.current) {
                promptRef.current.prompt();
                promptRef.current.userChoice.then(() => {
                    // if (choiceResult.outcome === 'accepted') {
                    //     console.log('The app was added to the home screen');
                    // } else {
                    //     console.log('The app was not added to the home screen');
                    // }
                    promptRef.current = null; // Reset the prompt reference as it can only be used once
                    document.removeEventListener('click', userGestureHandler); // Clean up the event listener
                    document.removeEventListener('touchstart', userGestureHandler); // Clean up the event listener
                });
            }
        };

        if (location.pathname === `/${coreRoutesEnum.LOG_IN}` || location.pathname === `/${coreRoutesEnum.SIGN_UP}`) {
            document.addEventListener('click', userGestureHandler);
            document.addEventListener('touchstart', userGestureHandler);
        }

        return () => {
            document.removeEventListener('click', userGestureHandler);
            document.removeEventListener('touchstart', userGestureHandler);
        };
    }, [location.pathname]);
};

export default useAddToHomeScreenPrompt;
