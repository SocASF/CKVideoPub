/*
@author LxingA
@version 1.0.0
@project SocASF
@description Página Principal de la Aplicación
@date 09/06/24 12:00AM
*/
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Storage,{Provider} from '../util/storage';
import Template from '../view/default.template';
import SEO from '../view/seo.template';
import type Application from '../types/global';

/** Página Principal de la Aplicación */
export default function Home(){
    const {alternative,name,slogan}: Application = (Storage["get"]("global"));
    const {t} = (useTranslation());
    return (
        <Template>
            <SEO strategy={{}}>
                <header>
                    <div className="p-5 text-center bg-image" style={{
                        backgroundImage: `url(${Provider({
                            identified: "593fb7dd-9f32-46c0-9fb3-be581681af6d.webp",
                            external: true
                        })})`,
                        height: 700
                    }}>
                        <div className="mask" style={{
                            backgroundColor: "rgba(0,0,0,0.6)"
                        }}>
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <div className="text-white">
                                    <h1 className="mb-3">
                                        {alternative![0]} {name}
                                    </h1>
                                    <h4 className="mb-3">
                                        {slogan}
                                    </h4>
                                    <Link role="button" className="btn btn-outline-light btn-lg" data-mdb-ripple-init to="/">
                                        {t("eb55718e")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </SEO>
        </Template>
    );
};