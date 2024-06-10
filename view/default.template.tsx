/*
@author LxingA
@version 1.0.0
@project SocASF
@description Plantilla Predeterminada de la Aplicación
@date 09/06/24 12:00AM
*/
import {Fragment} from 'react';
import ComponentHeader from '../components/header.component';
import ComponentFooter from '../components/footer.component';
import GlobalContext from '../context/global.context';
import type {ReactNode} from 'react';

/** Plantilla Predeterminada de la Aplicación */
export default function Template({children}:{
    /** Referencia al Hijo DOM para el Renderizado en la Plantilla */
    children: ReactNode
}){
    return (
        <GlobalContext>
            <Fragment>
                <div className="container">
                    <ComponentHeader />
                    {children}
                    <ComponentFooter />
                </div>
            </Fragment>
        </GlobalContext>
    );
};