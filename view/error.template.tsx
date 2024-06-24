/*
@author LxingA
@version 1.1.3
@project SocASF
@description Plantilla para el Mostrado de Algún Error General de la Aplicación
@date 16/06/24 01:30AM
*/
import {isRouteErrorResponse,useRouteError} from 'react-router-dom';
import {ListHeaderContainer} from '../page/list';
import {useTranslation} from 'react-i18next';
import SEO from './seo.template';
import Template from './default.template';

/** Plantilla Esencial para el Mostradod de los Errores Generales de la Aplicación */
export default function Error(){
    const {t} = (useTranslation());
    const router = (useRouteError());
    let _metadata_: any = {
        title: (t("cc0646f53T")),
        description: (t("cc0646f53M"))
    };if(isRouteErrorResponse(router)) switch(router["status"]){
        case 403:
            _metadata_["title"] = (t("cc0646f51T"));
            _metadata_["description"] = (t("cc0646f51M"));
        break;
        case 404:
            _metadata_["title"] = (t("cc0646f52T"));
            _metadata_["description"] = (t("cc0646f52M"));
        break;
        default:
            _metadata_["title"] = (t("cc0646f50T"));
            _metadata_["description"] = (router["statusText"] ?? t("cc0646f50M"));
        break;
    }return (
        <Template>
            <SEO strategy={{
                title: _metadata_["title"],
                description: _metadata_["description"]
            }}>
                <ListHeaderContainer external {...{
                    title: _metadata_["title"],
                    description: _metadata_["description"],
                    image: "6a0d0f19-f509-409b-a444-196b230876b7.webp"
                }}/>
            </SEO>
        </Template>
    );
};