/*
@author LxingA
@version 1.0.0
@project SocASF
@description Complementos para el Píe de Página de la Aplicación
@date 09/06/24 09:00PM
*/
import {Texted} from '../util/element';
import {useTranslation} from 'react-i18next';
import Storage from '../util/storage';
import type Application from '../types/global';

/** Traducción de los Iconos de FA para las Redes Sociales */
export const socialIcon: Record<string,({
    /** Nombre del Icono Identificador para la Red Social */
    icon: string,
    /** Nombre de la Etiqueta a Titular en la Red Social */
    label: string
})> = {
    fb: {
        icon: "facebook",
        label: "Facebook"
    },
    tt: {
        icon: "twitter",
        label: "Twitter"
    },
    fm: {
        icon: "github",
        label: "GitHub"
    }
};

/** Complemento con el Contenedor de las Redes Sociales para el Píe de Página de la Aplicación */
export const AddonFooterSocialContainer = () => {
    const {project,social}: Application = (Storage["get"]("global"));
    const {t} = (useTranslation());
    return (
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
            <div className="me-5 d-none d-lg-block">
                <span dangerouslySetInnerHTML={{
                    __html: (Texted((t("7531e42d")),{
                        project
                    }))
                }}/>
            </div>
            <div>
                {social?.map(({name,url},iterator) => (
                    <a title={socialIcon[name]["label"]} className="me-4 text-reset" key={iterator} href={url} target="_blank">
                        <i className={`fab fa-${socialIcon[name]["icon"]}`}></i>
                    </a>
                ))}
            </div>
        </section>
    );
};

/** Complemento con el Contenedor de Información para el Píe de Página de la Aplicación */
export const AddonFooterInformationContainer = () => {
    const {alternative,description,name,project,email,telephone,endpoint}: Application = (Storage["get"]("global"));
    const {t} = (useTranslation());
    const shortener = (endpoint["filter"](({name}) => (name == "shortener"))[0]["path"]);
    return (
        <section>
            <div className="container text-center text-md-start mt-5">
                <div className="row mt-3">
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            <i className="fas fa-gem me-3"></i>
                            {alternative![0]} {name}
                        </h6>
                        <p dangerouslySetInnerHTML={{
                            __html: (Texted((description!),{
                                author: project
                            }))
                        }}/>
                    </div>
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            {t("ec38b597")}
                        </h6>
                        <p>
                            <a className="text-reset" href={`${shortener}/4zpq4`} target="_blank">
                                {t("9b3f8501")}
                            </a>
                        </p>
                    </div>
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            {t("055b10a2")}
                        </h6>
                        <p>
                            <i className="fas fa-envelope me-3"></i>
                            {email}
                        </p>
                        <p>
                            <i className="fas fa-phone me-3"></i>
                            +52 ({String(telephone)["substring"](0,2)}) {String(telephone)["substring"](2,6)} {String(telephone)["substring"](6,10)}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

/** Complemento con el Contenedor de los Derechos Reservados para el Píe de Página de la Aplicación */
export const AddonFooterCopyrightContainer = () => {
    const {alternative,project,version}: Application = (Storage["get"]("global"));
    const {t} = (useTranslation());
    return (
        <div className="text-center p-4" style={{backgroundColor:"rgba(0,0,0,0.05)"}} dangerouslySetInnerHTML={{
            __html: `&copy; 2012 ~ ${(new Date())["getFullYear"]()} | ${Texted(t("725c2034"),{
                original: alternative![0],
                fullname: alternative![2],
                group: alternative![1],
                author: project
            })} [${version}]`
        }}/>
    );
};