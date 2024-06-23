/*
@author LxingA
@version 1.0.0
@project SocASF
@description Definición de los Documentos GraphQL para la Consulta a la API
@date 11/06/24 04:30AM
*/
import {gql} from '@apollo/client';

/** Esquema GraphQL para la Obtención de Información de los Juegos en Modo Listado para la Aplicación */
export const GraphQLGameListener = (gql`
    query c4a720fd($a2a2f7516:f544e1445I,$a4dec699b:String) {
        f544e1445(ac10fa519:$a2a2f7516,a7fc45f1d:$a4dec699b) {
            rs {
                tt
                pp
                ob {
                    ...fc159039b
                    illustration {
                        type
                        key
                        name
                    }
                    createAt
                    available
                    populate
                    videos
                    category {
                        name
                        value
                    }
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de Información de los Vídeos en Modo Listado para la Aplicación */
export const GraphQLVideoListener = (gql`
    query d1f9097b($a4fbcc125:String!,$a5a9293de:fbd45e939I,$a564ec1b3:String,$aa2330ddd:String) {
        fbd45e939(ad73b976c:$a4fbcc125,ac10fa519:$a5a9293de,a7fc45f1d:$a564ec1b3,a0e95a8b1:$aa2330ddd) {
            rs {
                tt
                pp
                ob {
                    ...d1f9097bb
                    thumbnail
                    character {
                        label
                        illustration {
                            name
                            key
                        },
                        key
                    }
                    view
                    key
                    createAt
                    duration
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de Información del Vídeo en el Contexto Actual de la Aplicación */
export const GraphQLVideoInfo = (gql`
    query a9eec98d($a4fbcc125:String!,$a0f2179a5:String!) {
        fbd45e939(ad73b976c:$a4fbcc125,a4ee44f99:$a0f2179a5) {
            rs {
                ob {
                    ...d1f9097bb
                    endpoint
                    character {
                        label
                        description
                        illustration {
                            name
                            key
                        }
                        key
                    }
                    view
                    createAt
                    populate
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de los Vídeos Sugeridos para el Contexto Actual de la Aplicación */
export const GraphQLVideoSuggest = (gql`
    query e3e5f2fd($a6ab0ea58:String!,$a6fed3051:String,$ac122a135:String,$a0296b5fb:fbd45e939I,$af28f7203:Boolean) {
        fbd45e939(ad73b976c:$a6ab0ea58,a4ee44f99:$a6fed3051,a0e95a8b1:$ac122a135,ac10fa519:$a0296b5fb,e10794ae:$af28f7203) {
            rs {
                ob {
                    ...d1f9097bb
                    thumbnail
                    createAt
                    view
                    populate
                    duration
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Obtención de los Comentarios Públicos Asociados a un Vídeo de la Aplicación */
export const GraphQLCommentsListener = (gql`
    query e0c4f52f6($a76ebfc3f:String!,$a6507516:fb48e8d58I!) {
        fb48e8d58(a7fa34be8:$a76ebfc3f,abbe88fb2:$a6507516) {
            rs {
                tt
                pp
                ob {
                    image
                    createAt
                    name
                    message
                }
            }
        }
    }
`);

/** Esquema GraphQL para la Mutación de los Me Gusta de algún Vídeo de la Aplicación */
export const GraphQLMutatedVideoLiked = (gql`
    mutation e80589ce7($a7fa34be8:String!,$a081fe4a4:Int!) {
        fd38f7f3e(a4ee44f99:$a7fa34be8,a994efdc3:$a081fe4a4) {
            ...d4d44e9c8
        }
    }
`);

/** Esquema GraphQL para la Creación de Comentarios en Algún Vídeo de la Aplicación */
export const GraphQLMutatedCommentAdded = (gql`
    mutation eb0a52bf5($a6fef6098:String!,$aac96a198:fd613979cI_Value!,$a0a662d02:String) {
        fd613979c(a7fa34be8:$a6fef6098,ae08f6691:$aac96a198,c55b1270:$a0a662d02) {
            ...d4d44e9c8
        }
    }
`);