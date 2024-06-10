/*
@author LxingA
@version 1.0.0
@project SocASF
@description Prototipo para el Objeto del SEO para la Aplicación
@date 09/06/24 12:00AM
*/

/** Definición del Objeto con la Información para el SEO de la Aplicación */
interface SEO {
    /** Definición del Titulo para el Navegador de la Aplicación */
    title?: string,
    /** Palabras Claves para Describir Mejor la Aplicación */
    keyword?: string[],
    /** Definición de la Descripción de la Aplicación */
    description?: string
};

export default SEO;