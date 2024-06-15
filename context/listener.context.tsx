/*
@author LxingA
@version 1.0.0
@project SocASF
@description Definición del Contexto del Listado para la Aplicación
@date 12/06/24 04:30PM
*/
import {createContext,useReducer} from 'react';
import type {ReactNode,Dispatch} from 'react';

/** Prototipo con el Objeto con la Información para el Contexto del Listado */
interface ListenerPrototype {
    /** Funcionalidad para la Mutación del Estado en el Contexto */
    mutate?: Dispatch<ListenerAction>
};

/** Prototipo con el Objeto con la Acción del Contexto */
type ListenerAction = {
    /** Nombre del Accionador para la Mutación en el Contexto */
    action: "",
    /** Dato con los Parámetros Esenciales para el Accionador */
    payload: any
};

/** Objeto con el Estado Inicial del Contexto */
export const InitialState: ListenerPrototype = {};

/** Instancia del Contexto para la Aplicación */
export const Context = (createContext<ListenerPrototype>(InitialState));

/** Reducedor Local para la Mutación del Estado en el Contexto */
const Reducer = ((state:ListenerPrototype,{action,payload}:ListenerAction) => {
    switch(action){
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