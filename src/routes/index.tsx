/**
 * Application Routes
 * 
 * This file defines all the routes for the application. It maps paths to components,
 * sets up nested routes, and configures any route-specific settings or guards.
 * The routing configuration helps in navigating different parts of the application.
 */


import {
    Navigate,
    Outlet,
    Route,
    RouteObject,
    createRoutesFromElements,
} from 'react-router-dom'
import {
    DefaultAuthenticatedRedirectRoute,
    coreRoutesEnum,
    homeNestedRoutesEnum,
    nestedRoutePathsEnum,
} from '../enums/routingEnums'
import ProtectedRoute from './guards/ProtectedRoute'
import UnAuthorizedRoute from './guards/UnAuthorizedRoute'
import Signup from '../components/pages/Signup'
import ResetPassword from '../components/pages/ResetPassword'
import Home from '../components/pages/Home/Index'
import YatriDetails from '../components/pages/Home/YatriDetails/YatriDetails'
import CardBackdrop from '../components/shared/CardBackdrop/CardBackdrop'
import FillYatriDetailsV2 from '../components/pages/Home/Modals/FillYatriDetailV2/FillYatriDetailV2'
import CreateAbha from '../components/pages/CreateAbhaV2'
import AppDrawerWrapper from '../components/shared/AppDrawerWrapper'
import LinkAbha from '../components/pages/CreateAbhaV2/Modals/LinkAbha'
import RecoverAbhaForm from '../components/pages/CreateAbhaV2/Modals/RecoverAbhaModal/RecoverAbhaForm'
import Caregiver from '../components/pages/Caregiver'
import MedicalRecordsEntryPoint from '../components/pages/medicalRecordsEntryPointV2/MedicalRecordsEntryPoint'
import LocateMedicalCheckUpFacility from '../components/pages/locateRhfV2/LocateMedicalCheckUpFacility'
import Vitals from '../components/pages/Vitals'
import SigninV2 from '../components/pages/SigninV2'
import WelcomePage from '../components/pages/WelcomePage/WelcomePage'
import HospitalDetails from '../components/pages/uploadCertificateM3/MedicalRecordsData/HospitalCards/HospitalDetails/HospitalDetails'
import MyRequest from '../components/pages/uploadCertificateM3/MyRequest/MyRequest'

import AddTourismID from '../components/modals/AddTourismID'
import CreateAbhaViaTourismId from '../components/modals/CreateAbhaViaTourismId'
import ViewTripDetailsV2 from '../components/modals/ViewTripDetailsV2/ViewTripDetailsV2'
import MedicalDeclarationWrapper from '../components/modals/MedicalDeclarationModal/MedicalDeclarationWrapper'
import ContactPage from '../components/modals/ContactUs/ContactPage'

const routes: RouteObject[] = createRoutesFromElements(
    <Route>
        <Route element={<UnAuthorizedRoute />}>
            <Route path={coreRoutesEnum.LOG_IN} Component={SigninV2} />
            <Route path={coreRoutesEnum.SIGN_UP} Component={Signup} />
            <Route
                path={coreRoutesEnum.RESET_PASSWORD}
                Component={ResetPassword}
            />
            <Route path={coreRoutesEnum.CONTACT_US} Component={ContactPage} />
        </Route>
        <Route element={<ProtectedRoute />}>
            <Route
                Component={() => {
                    return (
                        <AppDrawerWrapper>
                            <Outlet />
                        </AppDrawerWrapper>
                    )
                }}
            >
                <Route path={coreRoutesEnum.HOME} Component={Home}>
                    <Route
                        path={homeNestedRoutesEnum.YATRI_PROFILE}
                        element={
                            <CardBackdrop isOpenedByNavigation>
                                <YatriDetails />
                            </CardBackdrop>
                        }
                    />
                    <Route
                        path={homeNestedRoutesEnum.MEDICAL_DECLARATION}
                        element={<MedicalDeclarationWrapper />}
                    />
                    <Route
                        path={homeNestedRoutesEnum.YATRA_DETAILS}
                        element={
                            <CardBackdrop isOpenedByNavigation>
                                <FillYatriDetailsV2 />
                            </CardBackdrop>
                        }
                    />
                    <Route
                        path={homeNestedRoutesEnum.VIEW_YATRA_DETAILS}
                        Component={ViewTripDetailsV2}
                    />
                    <Route
                        path={nestedRoutePathsEnum.CREATE_ABHA_WITH_TP_ID}
                        Component={AddTourismID}
                    />
                </Route>
                <Route
                    path={coreRoutesEnum.CREATE_ABHA}
                    Component={CreateAbha}
                />
                <Route
                    path={coreRoutesEnum.RECOVER_ABHA}
                    Component={RecoverAbhaForm}
                />
                <Route path={coreRoutesEnum.CREATE_ABHA} Component={CreateAbha}>
                    <Route
                        path={nestedRoutePathsEnum.CREATE_ABHA_WITH_TP_ID}
                        Component={CreateAbhaViaTourismId}
                    />
                </Route>
                <Route path={coreRoutesEnum.LINK_ABHA} Component={LinkAbha} />
                <Route path={coreRoutesEnum.CARE_GIVER} Component={Caregiver} />
                <Route
                    path={coreRoutesEnum.MEDICAL_RECORDS}
                    Component={MedicalRecordsEntryPoint}
                >
                    <Route
                        path={nestedRoutePathsEnum.HOSPITAL_CARD_DETAILS}
                        Component={HospitalDetails}
                    />
                    <Route
                        path={nestedRoutePathsEnum.MY_REQUESTS}
                        Component={MyRequest}
                    />
                </Route>

                <Route
                    path={coreRoutesEnum.LOCATE_MEDICAL_FACILITY}
                    Component={LocateMedicalCheckUpFacility}
                />
                <Route path={coreRoutesEnum.VITALS} Component={Vitals} />
            </Route>

            {/* <Route path={coreRoutesEnum.ABHA} Component={AbhaStep} />
            <Route path={coreRoutesEnum.YATRA_DETAIL} Component={TourismStep} /> */}
            <Route path={coreRoutesEnum.WELCOME} Component={WelcomePage} />
        </Route>
        <Route
            path="*"
            element={
                <Navigate to={DefaultAuthenticatedRedirectRoute} replace />
            }
        />
    </Route>,
)

export default routes
