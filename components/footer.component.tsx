/*
@author LxingA
@version 1.0.0
@project SocASF
@description Componentes Esenciales para el Píe de Página de la Aplicación
@date 09/06/24 09:00PM
*/
import {AddonFooterSocialContainer,AddonFooterInformationContainer,AddonFooterCopyrightContainer} from './footer.addon';

/** Componente con el Píe de Página Predeterminado de la Aplicación */
export default function Footer(){
    return (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
            <AddonFooterSocialContainer />
            <AddonFooterInformationContainer />
            <AddonFooterCopyrightContainer />
        </footer>
    );
};