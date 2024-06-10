/*
@author LxingA
@version 1.0.0
@project SocASF
@description Configuración Inicial de la Aplicación
@date 08/06/24 03:00AM
*/
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Storage,{Provider} from './util/storage';
import API from './util/fetcher';
import Application from './app';
import DOM from './util/element';

/** Definición de las Relaciones de los Elementos DOM para la Aplicación */
export const relsheaper = {
    "text/css": "stylesheet",
    "image/x-icon": "icon"
};

/** Inicialización de la Configuración Inicial de la Aplicación */
API()["then"](response => {
    if(typeof(response) == "string") (console["warn"](response));
    else{
        Storage["set"]("global",response);
        document["documentElement"]["setAttribute"]("version",(response["version"]));
        const _file_: string[] = ["style.css","script.js","favicon.ico"];
        response["resource"]["filter"](({name}) => (_file_["includes"](name)))["forEach"](({name,mime,key},i) => {
            const _conditional_ = name["endsWith"]("js");
            const id: string = "sck-" + (name["split"](".")[0]);
            DOM({
                type: ((_conditional_) ? "script" : "link"),
                target: ((_conditional_) ? "body" : "head"),
                attribute: ((_conditional_) ? {
                    async: true,
                    type: mime,
                    src: (Provider({
                        identified: key
                    })),
                    id
                } : {
                    rel: (relsheaper as any)[mime],
                    href: (Provider({
                        identified: key
                    })),
                    type: mime,
                    id
                })
            });
            if(i == (_file_["length"] - 1)) createRoot(document["getElementById"]("root") as HTMLElement)["render"](
                <StrictMode>
                    <Application />
                </StrictMode>
            );
        });
    }
})["catch"](error => (console["error"](error)));