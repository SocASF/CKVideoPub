/*
@author LxingA
@version 1.0.0
@project SocASF
@description Plantilla para la Definición del SEO para la Aplicación
@date 09/06/24 12:00AM
*/
import {Fragment} from 'react';
import HTML from 'react-helmet';
import Storage from '../util/storage';
import type {ReactNode} from 'react';
import type Application from '../types/global';
import type SEOPrototype from '../types/seo';

/** Definición del SEO para la Aplicación */
export default function SEO({children,strategy}:{
    /** Referencia al Hijo DOM para el Renderizado en el Componente del SEO */
    children: ReactNode,
    /** Objeto con la Información para Establecer el SEO en la Plantilla */
    strategy: SEOPrototype
}){
    const {name,project,slogan,description,keywords}: Application = (Storage["get"]("global"));
    const keyword: string[] = (strategy["keyword"] ?? keywords)!;
    let _kw_: string = "";
    for(let y = 0; y <= (keyword["length"] - 1); y++) _kw_ += (keyword[y]) + ",";
    return (
        <Fragment>
            <HTML>
                <title>
                    {strategy["title"] ?? slogan} - {name} [{project}]
                </title>
                <meta name="description" content={strategy["description"] ?? description}/>
                <meta name="keywords" content={_kw_["substring"](0,(_kw_["length"] - 1))}/>
            </HTML>
            {children}
        </Fragment>
    );
};