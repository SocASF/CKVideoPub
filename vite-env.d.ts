/// <reference types="vite/client" />
interface ImportMetaEnv {
    /** Ruta Absoluta HTTP del Punto Final de la API Global del Proyecto (sin / final) */
    SCVideoParamKeyAPIEndPointURI: string,
    /** Identificador Único (UUID) de la Aplicación para el Acceso a la API */
    SCVideoParamKeyAPIKeyAccess: string
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}4