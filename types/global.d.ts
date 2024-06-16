/*
@author LxingA
@version 1.0.0
@project SocASF
@description Utilidad Esencial para la Definición del Fetcher para la Comunicación con la API
@date 08/06/24 04:30AM
*/

/** Definición de la Interfaz para el Prototipo del Objeto con la Inforamción de la Aplicación en la API */
interface Application {
    /** Clave Secreto para la Autenticación al Punto Final de los Recursos de las Aplicaciones */
    token: string,
    /** Nombre de la Aplicación */
    name: string,
    /** Identificador de la Aplicación en el Proyecto */
    identified: string,
    /** Contenedor con los Recursos Esenciales de la Aplicación */
    resource: {
        /** Nombre del Recurso en la Base de Datos */
        name: string,
        /** Tipo del Recurso (mime) en la Base de Datos */
        mime: string,
        /** Tamaño en Bytes del Recurso en la Base de Datos */
        size: number,
        /** Identificador Único (UUID) del Recurso en la Base de Datos */
        key: string
    }[],
    /** Versión Actual de la Aplicación */
    version: string,
    /** Descripción Acerca del Propósito de la Aplicación */
    description?: string,
    /** Contenedor con las Palabras Claves de la Aplicación */
    keywords?: string[],
    /** Correo Electrónico de Contacto de la Aplicación */
    email: string,
    /** Número de Contacto de la Aplicación */
    telephone: number,
    /** Contenedor con las Redes Sociales de la Aplicación */
    social?: {
        /** Nombre de la Red Social para Identificarlo */
        name: string,
        /** Nombre del Icono a Usar en la Red Social */
        icon: string,
        /** Ruta Relativa de la Red Social */
        url: string
    }[],
    /** Contenedor con los Nombres Alternos de la Aplicación */
    alternative?: string[],
    /** Objeto con la Localidad del Proyecto Asociado a la Aplicación */
    location?: {
        /** Nombre de la Calle en la Dirección del Proyecto */
        street: string,
        /** Número Exterior de la Dirección del Proyecto */
        outside: number,
        /** Nombre de la Colonia en la Dirección del Proyecto */
        colony: string,
        /** Código Postal de la Dirección del Proyecto */
        postal: number,
        /** Nombre de la Ciudad en la Dirección del Proyecto */
        city: string,
        /** Nombre del Estado en la Dirección del Proyecto */
        state: string,
        /** Nombre del País de Residencia del Proyecto */
        country: string
    },
    /** Nombre del Proyecto Asociado a la Aplicación */
    project: string,
    /** Contenedor con los Idiomas Oficiales Habilitados en la Aplicación */
    language: {
        /** Identificador en 2 Dígitos del Idioma Oficial para la Aplicación */
        iso: string,
        /** Nombre Original del Origen del Idioma Oficial para la Aplicación */
        label: string
    }[],
    /** Contenedor con los Puntos Finales Esenciales de la Aplicación */
    endpoint: {
        /** Nombre del Punto Final para su Acceso a la Aplicación */
        name: string,
        /** Ruta Absoluta HTTP del Punto Final para el Acceso a la Aplicación */
        path: string,
        /** Tipo de Carga en el DOM de la Aplicación */
        type?: string
    }[],
    /** Definición de la Frase Típica para la Aplicación */
    slogan?: string,
    /** Correo Electrónico de Soporte Público para una Incidencia en Alguna Aplicación */
    support: string
};

/** Definición del Objeto para el Paginador de la API */
type ResponsePaginator = {
    /** Contenedor con los Elementos Solicitados en la Solicitud de la API */
    ob: any[],
    /** Total de Elementos Obtenidos desde la Base de Datos */
    tt: number,
    /** Total de Elementos a Mostrar por Pagina en la Solicitud de la API */
    pp: number
};

/** Definición del Objeto de la Respuesta de la API */
export type ResponseAPI = {
    /** Identificador Único de Referencia */
    rf?: string,
    /** Mensaje Descriptivo de la Respuesta */
    ms?: string,
    /** Objeto con la Respuesta de la API en Formato Paginador */
    rs?: ResponsePaginator,
    /** Tiempo en MS de la Respuesta de la API en la Solicitud */
    dt: number,
    /** Estado Actual de la Solicitud */
    st: boolean
};

export default Application;