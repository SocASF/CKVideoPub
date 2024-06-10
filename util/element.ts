/*
@author LxingA
@version 1.0.0
@project SocASF
@description Utilidad Esencial para la Creación de Elementos DOM en la Aplicación
@date 08/06/24 08:00PM
*/

/** Utilidad Esencial para la Mutación del Texto mediante un Objeto */
export const Texted = (base:string,args:Record<string,string> = {}): string => {
    (Object["keys"](args)["forEach"]((k,i) => {
        base = (base["replace"]((new RegExp("\%" + k + "\%","gi")),(Object["values"](args)[i])));
    }));
    return (base);
};

/** Creación de Elementos DOM en la Aplicación */
export default function DOM({type,target = "head",attribute}:{
    /** Tipo de Elemento DOM a Crear */
    type: (keyof HTMLElementTagNameMap),
    /** Destino a Inyectar el DOM Creado */
    target?: "head" | "body",
    /** Objeto con los Atributos Esenciales para la Creación del DOM */
    attribute: Record<string,any>
}): void {
    if(!document["getElementById"](attribute["id"])){
        let _element_ = (document["createElement"](type));
        (Object["keys"](attribute)["forEach"]((k,i) => {
            (_element_ as any)[k] = (Object["values"](attribute)[i]);
        }));
        document[target]["appendChild"](_element_);
    }
};