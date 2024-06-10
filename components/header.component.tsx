/*
@author LxingA
@version 1.0.0
@project SocASF
@description Componentes Esenciales para la Cabecera de la Aplicación
@date 09/06/24 12:00AM
*/
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {AddonHeaderContainerActions} from './header.addon';
import {Link} from 'react-router-dom';
import Storage,{Provider} from '../util/storage';
import type Application from '../types/global';

/** Componente con la Cabecera Predeterminada para la Aplicación */
export default function Header(){
    const {resource,alternative,name,project}: Application = (Storage["get"]("global")); 
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
            <div className="container">
                <Link className="navbar-brand me-2" to="/">
                    <LazyLoadImage src={Provider({
                        parameter: {
                            format: "webp",
                            height: 48
                        },
                        identified: (resource["filter"](({name}) => (name == "logo.png"))[0]["key"])
                    })} effect="blur" loading="lazy" alt={`${project} ${name}`}/>
                    <span>
                        {alternative![0]} {name}
                    </span>
                </Link>
                <AddonHeaderContainerActions />
            </div>
        </nav>
    );
};