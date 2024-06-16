/*
@author LxingA
@version 1.0.0
@project SocASF
@description Instancia de la Aplicación
@date 09/06/24 12:00AM
*/
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'moment-timezone';
import 'moment/locale/es';
import {createBrowserRouter,createRoutesFromElements,Route,RouterProvider as Provider} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import ListenerProvider from './context/listener.context';
import WatchProvider from './context/watch.context';
import GlobalProvider from './context/global.context';
import i18n from './bin/i18n';
import HomePage from './page';
import ListPage from './page/list';
import WatchPage from './page/watch';

/** Inicialización de la Aplicación en el DOM */
export default function App(){
    return (
        <I18nextProvider {...{i18n}}>
            <GlobalProvider>
                <Provider router={createBrowserRouter(createRoutesFromElements([
                    <Route>
                        <Route index element={
                            <HomePage />
                        }/>
                        <Route path="/container" element={
                            <ListenerProvider>
                                <ListPage />
                            </ListenerProvider>
                        }/>
                        <Route path="/watch" element={
                            <WatchProvider>
                                <WatchPage />
                            </WatchProvider>
                        }/>
                    </Route>
                ]))}/>
            </GlobalProvider>
        </I18nextProvider>
    );
};