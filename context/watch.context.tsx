/*
@author LxingA
@version 1.0.0
@project SocASF
@description Definición del Contexto del Reproductor para la Aplicación
@date 13/06/24 05:00PM
*/
import {createContext,useReducer} from 'react';
import type {ReactNode,Dispatch} from 'react';

/** Prototipo con el Objeto con la Información para el Contexto del Reproductor */
interface WatchPrototype {
    /** Funcionalidad para la Mutación del Estado en el Contexto */
    mutate?: Dispatch<WatchAction>,
    /** Creación de un Comentario Nuevo en Algún Vídeo de la Aplicación */
    addCommentContext: boolean
};

/** Prototipo con el Objeto con la Acción del Contexto */
type WatchAction = {
    /** Nombre del Accionador para la Mutación en el Contexto */
    action: "AC_ADDCOMMENT_SHOW",
    /** Dato con los Parámetros Esenciales para el Accionador */
    payload: any
};

/** Objeto con el Estado Inicial del Contexto */
export const InitialState: WatchPrototype = {
    addCommentContext: false
};

/** Instancia del Contexto para la Aplicación */
export const Context = (createContext<WatchPrototype>(InitialState));

/** Reducedor Local para la Mutación del Estado en el Contexto */
const Reducer = ((state:WatchPrototype,{action,payload}:WatchAction) => {
    switch(action){
        /** Mutar el Estado para Mostrar el Contenedor de la Añadición de un Nuevo Comentario en la Vista */
        case "AC_ADDCOMMENT_SHOW":
            state["addCommentContext"] = (payload);
            return {...state};
        default:
            return state;
    }
});

/** Componente con la Referencia del Proveedor del Contexto */
export default function Provider({children}:{
    /** Referencia al Hijo DOM para el Renderizado en el Proveedor */
    children: ReactNode
}){
    const [state,mutate] = (useReducer(Reducer,InitialState));
    return (
        <Context.Provider value={{...state,mutate}}>
            {children}
        </Context.Provider>
    );
};