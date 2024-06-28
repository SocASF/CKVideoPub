/*
@author LxingA
@version 1.0.0
@project SocASF
@description Vista para Mostrar el Reproductor del Vídeo Actual para la Aplicación
@date 13/06/24 05:00PM
*/
import {Navigate} from 'react-router-dom';
import {Context as GlobalContext} from '../context/global.context';
import {Context as WatchContext} from '../context/watch.context';
import {useContext,useState,useEffect,useRef} from 'react';
import {useQuery,useMutation} from '@apollo/client';
import {useTranslation} from 'react-i18next';
import {GraphQLVideoInfo,GraphQLVideoSuggest,GraphQLMutatedVideoLiked,GraphQLMutatedCommentAdded,GraphQLCommentsListener} from '../util/graphql';
import {Texted,Random} from '../util/element';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {Stream} from '@cloudflare/stream-react';
import Storage,{Provider} from '../util/storage';
import Loader,{SkeletonTheme} from 'react-loading-skeleton';
import Moment from 'react-moment';
import SEO from '../view/seo.template';
import Template from '../view/default.template';
import type {ReactNode,CSSProperties,MouseEvent,SetStateAction,Dispatch} from 'react';
import type Application from '../types/global';

/** Objeto con la Información Esencial del Personaje para la Vista */
type WatchCharacter = {
    /** Nombre del Personaje Original para la Vista */
    label: string,
    /** Descripción Acerca del Personaje para la Vista */
    description?: string,
    /** Contenedor con las Ilustracciones del Personaje para la Vista */
    illustration: {
        /** Nombre Corto Identificable de la Ilustración */
        name: string,
        /** Identificador Único (UUID) de la Ilustración */
        key: string
    }[],
    /** Identificador Único (UUID) del Personaje en la Base de Datos para la Vista */
    key: string
};

/** Prototipo para la Definición del Objeto para el Enlace de la Pestaña del Contenedor de las Sugerencias */
type WatchTabLink = {
    /** Nombre de la Etiqueta a Mostrar */
    label: string,
    /** Nombre del Icono a Mostrar */
    icon: string,
    /** Identificador de la Pestaña para Definir */
    key: string
};

/** Prototipo para la Definición del Objeto del Comentario en el Vídeo */
type ProtoAddonComment = {
    /** Identificador Único del Avatar Random Asociada al Comentario */
    image?: string,
    /** Indicador sí se Establece en Modo Edición para el Comentario */
    editor: boolean,
    /** Nombre del Usuario que Publicó el Comentario en la Aplicación */
    name?: string,
    /** Comentario Definido por el Usuario que lo Publicó para la Aplicación */
    message?: string,
    /** Fecha de Creación del Comentario en Formato ISO para la Aplicación */
    createAt?: string
};

/** Complemento Esencial para Mostrar el Contenedor para Algún Error de la Aplicación */
const AddonContainerError = ({message,style,callback}:{
    /** Mensaje a Mostrar en el Contenedor del Error */
    message: string,
    /** Definición del Objeto con los Atributos CSS para el Contenedor */
    style?: CSSProperties,
    /** Callback de Referencia para la Ejecución de Cualquier Acción */
    callback?: Function
}) => {
    const {t} = (useTranslation());
    return (
        <div {...{style}}>
            <i className="fas fa-circle-exclamation fa-2xl"></i>
            <p className="mt-3">
                {message}
            </p>
            {callback && (
                <button type="button" className="btn btn-primary" data-mdb-ripple-init onClick={() => callback()}>
                    {t("f1e2c4831")}
                </button>
            )}
        </div>
    );
};

/** Definición del Objeto para la Instancia de la Entrada en la Vista */
type ProtoCommentShowEditor = {
    /** Instancia de Visor del Nombre */
    name:boolean,
    /** Instancia de Visor del Comentario */
    message:boolean
};

/** Definición del Objeto para los Valores Predeterminados de las Entradas de la Vista */
type ProtoCommentValue = {
    /** Valor Inicial para la Entrada del Nombre */
    name:string | null,
    /** Valor Inicial para la Entrada del Comentario */
    message:string | null
};

/** Complemento Esencial para la Definición de la Entrada para la Mutación de los Textos de la Vista */
const AddonCommentInputTXT = ({attribute,placeholder,ctxEditor,ctxValue,initialValueFromOrigin}:{
    /** Definición del Tipo de Atributo a Establecer en la Vista */
    attribute: "message" | "name",
    /** Texto a Mostrar en la Descripción de la Entrada */
    placeholder: string,
    /** Referencia a la Función para la Mutación del Visor de la Entrada */
    ctxEditor: Dispatch<SetStateAction<ProtoCommentShowEditor>>,
    /** Referencia a la Función para la Mutación del Valor Actual para la Vista */
    ctxValue: Dispatch<SetStateAction<ProtoCommentValue>>,
    /** Objeto con los Valores Actuales de las Entradas para la Vista */
    initialValueFromOrigin: ProtoCommentValue
}) => {
    const input = (useRef<HTMLTextAreaElement>(null));
    const handler = (event:any) => ((input["current"] && !(input["current"]["contains"](event["target"]))) && ctxEditor(older => ({...older,[attribute]:false})));
    useEffect(() => {
        document["addEventListener"]("click",handler,true);
        return (() => document["removeEventListener"]("click",handler,true));
    },[input]);
    return (
        <textarea ref={input} rows={1} autoCapitalize="none" autoComplete="off" style={{
            position: "relative",
            width: 350,
            resize: "none",
            background: "transparent",
            border: "0 none",
            outline: "none",
            overflow: "hidden",
            height: (attribute == "message" ? 100 : undefined),
            whiteSpace: "normal",
            textAlign: "justify",
            textAlignLast: "center"
        }} defaultValue={initialValueFromOrigin[attribute] ?? ""} maxLength={attribute == "message" ? 150 : 40} minLength={4} {...{placeholder}} onChange={event => {
            event["preventDefault"]();
            ctxValue(older => {
                let __: any = older;
                if(event["target"]["value"]["length"] == 0) __[attribute] = null;
                else if(event["target"]["value"]["length"] > event["target"]["maxLength"]) __[attribute] = null;
                else if(event["target"]["value"]["length"] < event["target"]["minLength"]) __[attribute] = null;
                else __[attribute] = (event["target"]["value"]);
                return {...__};
            });
        }}/>
    );
};

/** Complemento Esencial para Mostrar el Contenedor de los Comentarios del Vídeo */
const AddonCommentContainer = ({image,editor,createAt,message,name}:ProtoAddonComment) => {
    const [avatar,setAvatar] = (useState<{path:string,data:Blob}>());
    const [showEditor,setShowEditor] = (useState<ProtoCommentShowEditor>({
        name: false,
        message: false
    }));
    const [content,setContent] = (useState<ProtoCommentValue>({
        name: null,
        message: null
    }));
    const [available,setAvailable] = (useState<boolean>(true));
    const {mutate} = (useContext(WatchContext));
    const {videoID} = (useContext(GlobalContext));
    const {i18n:{language},t} = (useTranslation());
    const [addComment,{error}] = (useMutation(GraphQLMutatedCommentAdded,{
        ignoreResults: true
    }));
    useEffect(() => {
        const _local_ = (async() => {
            const _fetcher_ = (await fetch("https://anime.kirwako.com/api/avatar?gender=female&name=%id%"["replace"]("%id%",(Random()))));
            const _random_ = (await (await fetch("https://randomuser.me/api/?results=1&inc=name"))["json"]())["results"][0]["name"];
            const _blob_ = (await _fetcher_["blob"]());
            setContent({
                name: `${_random_["first"]} ${_random_["last"]}`,
                message: null
            });
            setAvatar({
                path: (URL["createObjectURL"](_blob_)),
                data: (_blob_)
            });
        });
        if(editor && !avatar) _local_();
        return (() => {
            if(editor && avatar) URL["revokeObjectURL"](avatar["path"]);
        });
    },[]);
    const handlerMutateTXT = (attribute:"name" | "message",event:MouseEvent<HTMLSpanElement>) => {
        event["preventDefault"]();
        setShowEditor(last => {
            let _ = last;
            _[attribute] = (true);
            return {...last};
        });
    };
    if(error) return (
        <AddonContainerError message={t("f1e2c4832")} callback={() => (mutate!({
            action: "AC_ADDCOMMENT_SHOW",
            payload: false
        }))}/>
    );return (
            <div className="d-flex flex-start mb-3">
                <div className="card" style={{
                    width: "100%"
                }}>
                    <div className="row g-0">
                        <div className="col-md-4 d-flex align-items-center justify-content-center">
                            <LazyLoadImage width={128} className="img-thumbnail" effect="blur" src={image ? Provider({
                                identified: image,
                                parameter: {
                                    format: "webp"
                                }
                            }) : (avatar ? (
                                avatar["path"]
                            ) : (
                                Provider({
                                    identified: "bc52182d-be94-4769-9fea-1460c171c444.webp",
                                    external: true
                                })
                            ))}/>
                        </div>
                        <div className="col-md-8">
                            <div className="card-header">
                                <h6 className="fw-bold mb-1">
                                    {avatar ? (
                                        <span>
                                            {showEditor["name"] ? (
                                                <AddonCommentInputTXT initialValueFromOrigin={content} ctxEditor={setShowEditor} ctxValue={setContent} placeholder={t("f1e2c4833a")} attribute="name"/>
                                            ) : (
                                                editor ? (
                                                    <span style={{
                                                        cursor: "pointer"
                                                    }} onClick={event => handlerMutateTXT("name",event)}>
                                                        {content["name"] ?? t("f1e2c4833b")}
                                                    </span>
                                                ) : (
                                                    name
                                                )
                                            )}
                                        </span>
                                    ) : (
                                        <span>
                                            {name ?? t("f1e2c4839")}
                                        </span>
                                    )}
                                </h6>
                            </div>
                            <div className="card-body">
                                <p className="mb-0">
                                    <span>
                                        {showEditor["message"] ? (
                                            <AddonCommentInputTXT initialValueFromOrigin={content} ctxEditor={setShowEditor} ctxValue={setContent} placeholder={t("f1e2c4834a")} attribute="message"/>
                                        ) : (
                                            editor ? (
                                                <span style={{
                                                    cursor: "pointer"
                                                }} onClick={event => handlerMutateTXT("message",event)}>
                                                    {content["message"] ?? t("f1e2c4834b")}
                                                </span>
                                            ) : (
                                                message
                                            )
                                        )}
                                    </span>
                                </p>
                            </div>
                            <div className="card-footer">
                                {editor ? (
                                    <div className="row">
                                        <div className="col">
                                            <button type="button" className="btn btn-danger" data-mdb-ripple-init onClick={event => {
                                                event["preventDefault"]();
                                                mutate!({
                                                    action: "AC_ADDCOMMENT_SHOW",
                                                    payload: false
                                                });
                                            }} disabled={!available}>
                                                {t("f1e2c4835")}
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button type="button" className="btn btn-success" data-mdb-ripple-init disabled={!available || typeof(content["name"]) != "string" || typeof(content["message"]) != "string"} onClick={async event => {
                                                event["preventDefault"]();
                                                setAvailable(false);
                                                const body = (new FormData());
                                                body["append"]("handler","fb6a78d58");
                                                body["append"]("avatar",(avatar!["data"]));
                                                const _fetchAvatar_ = (await (await fetch(`${import.meta.env.SCVideoParamKeyAPIEndPointURI}/application?id=${(Storage["get"]("global") as Application)["identified"]}`,{
                                                    method: "post",
                                                    headers: {
                                                        "X-CKeyApp-H": (import.meta.env.SCVideoParamKeyAPIKeyAccess),
                                                        "X-CLangApp-H": (language)
                                                    },
                                                    body
                                                }))["json"]());
                                                addComment({
                                                    variables: {
                                                        a6fef6098: videoID,
                                                        aac96a198: content,
                                                        a0a662d02: (_fetchAvatar_["rs"]["newAvatarIDContext"])
                                                    },
                                                    context: {
                                                        language
                                                    },
                                                    refetchQueries: ["e0c4f52f6"]
                                                });
                                                mutate!({
                                                    action: "AC_ADDCOMMENT_SHOW",
                                                    payload: false
                                                });
                                            }}>
                                                {(!available) ? t("165ae9841") : t("165ae9842")}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p title={(new Date(Date["parse"](createAt ?? "")))["toLocaleString"]()} className="mb-0">
                                        {t("9c524118")}
                                        <Moment fromNow>
                                            {createAt}
                                        </Moment>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

/** Componente con el Contenedor de los Comentarios para la Vista */
const WatchCommentsContainer = () => {
    const _loader_: ReactNode[] = [];
    const [perPage] = (useState<number>(6));
    const [page,setPage] = (useState<number>(1));
    const {addCommentContext} = (useContext(WatchContext));
    const {videoID} = (useContext(GlobalContext));
    const {i18n:{language},t} = (useTranslation());
    const {loading,data} = (useQuery(GraphQLCommentsListener,{
        notifyOnNetworkStatusChange: false,
        variables: {
            a76ebfc3f: videoID,
            a6507516: {
                ab456473a: perPage,
                a2db3c45a: page
            }
        },
        context: {
            language
        }
    }));
    const ContainerCore = ({title,children}:{
        /** Título a Definir en el Contenedor */
        title: string,
        /** Referencia al Hijo DOM a Renderizar en el Contenedor */
        children: ReactNode
    }) => {
        return (
            <div className="border rounded-5 overflow-auto mb-3">
                <div className="row d-flex justify-content-center" style={{
                    maxHeight: 432,
                    minHeight: 180
                }}>
                    <div className="col">
                        <div className="card text-body">
                            <div className="card-body p-4 text-center">
                                <h4 className="mb-4">
                                    {title}
                                </h4>
                                <div className="container">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };if(loading){
        for(let z = 0; z <= (perPage - 1); z++) _loader_["push"](
            <div className="d-flex flex-start mb-3" key={z}>
                <div className="card" style={{
                    width: "100%"
                }}>
                    <div className="row g-0">
                        <div className="col-md-4 d-flex align-items-center justify-content-center">
                            <LazyLoadImage width={128} className="rounded-circle img-fluid" effect="blur" src={Provider({
                                identified: "d7708af7-76fd-4755-8b90-2897f4e9fd89.webp",
                                external: true
                            })}/>
                        </div>
                        <div className="col-md-8">
                            <SkeletonTheme baseColor="#424242">
                                <div className="card-header">
                                    <h6 className="fw-bold mb-1">
                                        <Loader count={1}/>
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <p className="mb-0">
                                        <Loader count={4}/>
                                    </p>
                                </div>
                                <div className="card-footer">
                                    <p className="mb-0">
                                        <Loader count={1}/>
                                    </p>
                                </div>
                            </SkeletonTheme>
                        </div>
                    </div>
                </div>
            </div>
        );
        return (
            <ContainerCore title="....">
                <div className="container">
                    {_loader_}
                </div>
            </ContainerCore>
        );
    };return (
        addCommentContext ? (
            <ContainerCore title={t("f1e2c4836a")}>
                <>
                    <small style={{
                        position: "relative",
                        bottom: 19
                    }}>
                        {t("f1e2c4836b")}
                    </small>
                    <AddonCommentContainer editor/>
                </>
            </ContainerCore>
        ) : (
            <ContainerCore title={t("f1e2c4837a")}>
                {((data["fb48e8d58"]["rs"]["ob"] as any[])["length"] == 0) ? (
                    <AddonContainerError message={t("f1e2c4837b")} style={{
                        position: "relative",
                        top: 3
                    }}/>
                ) : (
                    <div className="container">
                        {((data["fb48e8d58"]["rs"]["ob"] as any[])["map"]((d,k) => (
                            <AddonCommentContainer key={k} {...d} editor={false}/>
                        )))}
                        {(data && data["fb48e8d58"]["rs"]["pp"] > 1) && (
                            <nav className="pt-2">
                                <ul className="pagination d-flex justify-content-center">
                                    <li className="page-item" style={{
                                        position: "relative",
                                        marginRight: 4
                                    }}>
                                        <button type="button" className="page-link btn btn-secondary" data-mdb-ripple-init disabled={page <= 1} onClick={event => {
                                            event["preventDefault"]();
                                            setPage(1);
                                        }}>
                                            <i className="fas fa-angles-left"></i>
                                        </button>
                                    </li>
                                    <li className="page-item" style={{
                                        position: "relative",
                                        marginRight: 4
                                    }}>
                                        <button type="button" className="page-link btn btn-secondary" data-mdb-ripple-init disabled={page <= 1} onClick={event => {
                                            event["preventDefault"]();
                                            setPage(page - 1);
                                        }}>
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    <li className="page-item" style={{
                                        position: "relative",
                                        marginRight: 4
                                    }}>
                                        <button type="button" className="page-link btn btn-secondary" data-mdb-ripple-init disabled={page >= data["fb48e8d58"]["rs"]["pp"]} onClick={event => {
                                            event["preventDefault"]();
                                            setPage(page + 1);
                                        }}>
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                    <li className="page-item">
                                        <button type="button" className="page-link btn btn-secondary" data-mdb-ripple-init disabled={page >= data["fb48e8d58"]["rs"]["pp"]} onClick={event => {
                                            event["preventDefault"]();
                                            setPage(data["fb48e8d58"]["rs"]["pp"]);
                                        }}>
                                            <i className="fas fa-angles-right"></i>
                                        </button>
                                    </li>
                                </ul>
                                <p className="pb-3" dangerouslySetInnerHTML={{
                                    __html: (Texted((data["fb48e8d58"]["rs"]["tt"] == 1 ? t("f1e2c4838b") : t("f1e2c4838a")),{
                                        count: ((page >= data["fb48e8d58"]["rs"]["pp"]) ? data["fb48e8d58"]["rs"]["tt"] : (perPage * page)),
                                        total: (data["fb48e8d58"]["rs"]["tt"])
                                    }))
                                }}/>
                            </nav>
                        )}
                    </div>
                )}
            </ContainerCore>
        )
    );
};

/** Componente con el Contenedor para dar Me Gusta al Vídeo para la Vista */
const WatchLikeContainer = ({currentLiked,videoID}:{
    /** Número de Me Gusta Actual del Vídeo para la Vista */
    currentLiked: number,
    /** Identificador Único del Vídeo en el Contexto Actual */
    videoID: string
}) => {
    const [liked,setLiked] = (useState<boolean>(false));
    const [mutate,{error,data}] = (useMutation(GraphQLMutatedVideoLiked));
    const {t,i18n:{language}} = (useTranslation());
    const {mutate:contextMutated,addCommentContext,fullScreen} = (useContext(WatchContext));
    const {mobile} = (useContext(GlobalContext));
    useEffect(() => {
        if(error && liked) setLiked(false);
        if(data && !data["fd38f7f3e"]["status"]) setLiked(false);
    },[]);
    return (
        <div className="btn-group shadow-0" style={{
            position: "relative",
            width: "100%"
        }}>
            <button title={t("f85488a83")} className="btn btn-outline-secondary text-center" data-mdb-color="dark" data-mdb-ripple-init disabled={mobile} onClick={event => {
                event["preventDefault"]();
                contextMutated!({
                    action: "AC_CHGFSCREEN_SET",
                    payload: (!fullScreen)
                });
            }}>
                <i className={`fas fa-${fullScreen ? "down-left-and-up-right-to-center" : "up-right-and-down-left-from-center"}`}></i>
            </button>
            <button title={t("f85488a82")} className="btn btn-outline-secondary" data-mdb-color="dark" data-mdb-ripple-init disabled={addCommentContext} onClick={event => {
                event["preventDefault"]();
                contextMutated!({
                    action: "AC_ADDCOMMENT_SHOW",
                    payload: true
                });
            }}>
                <i className="fas fa-comment-medical"></i>
            </button>
            <button title={t("f85488a81")} className="btn btn-outline-secondary text-center" data-mdb-color="dark" data-mdb-ripple-init disabled={liked} onClick={event => {
                event["preventDefault"]();
                setLiked(true);
                mutate({
                    variables: {
                        a7fa34be8: videoID,
                        a081fe4a4: currentLiked,
                        acd480dd9: "like"
                    },
                    context: {
                        language
                    }
                });
            }}>
                <i className="far fa-thumbs-up"></i>
            </button>
        </div>
    );
};

/** Componente con el Contenedor del Listado de los Vídeos Relacionados para la Vista */
const WatchListSuggestContainer = ({character}:{
    character?: WatchCharacter
}) => {
    const _loader_: ReactNode[] = [];
    const [perPage] = (useState<number>(8));
    const {gameContext,videoID,mutate,mobile} = (useContext(GlobalContext));
    const {i18n:{language},t} = (useTranslation());
    const {loading,data} = (useQuery(GraphQLVideoSuggest,{
        notifyOnNetworkStatusChange: false,
        context: {
            language
        },
        variables: {
            a6ab0ea58: gameContext?.identified,
            a6fed3051: videoID,
            ac122a135: character?.key,
            a0296b5fb: {
                a3f53e411: perPage,
                af0afffd2: 1
            },
            af28f7203: true
        }
    }));
    if(loading){
        for(let y = 0; y <= (perPage - 1); y++) _loader_["push"](
            <div key={y} className="col mb-2">
                <div className="card h-100">
                    <LazyLoadImage effect="blur" className="card-img-top" src={Provider({
                        identified: "884f520d-9fe5-4631-8e97-fdb2e80a3a2e.webp",
                        external: true
                    })}/>
                    <SkeletonTheme baseColor="#424242">
                        <div className="card-body">
                            <small className="card-title">
                                <strong>
                                    <Loader count={1} height={20}/>
                                </strong>
                            </small>
                            <p className="card-text">
                                <Loader count={2} height={10}/>
                            </p>
                        </div>
                        <div className="card-footer">
                            <small className="text-muted">
                                <Loader count={1} height={10}/>
                            </small>
                        </div>
                    </SkeletonTheme>
                </div>
            </div>
        );
        return (
            <div className="row row-cols-1">
                {_loader_}
            </div>
        );
    }else{
        const _dt_: any[] = (data["fbd45e939"])["rs"]["ob"];
        return (_dt_["length"] == 0 ? (
            <AddonContainerError message={t("6d49b11e")} style={{
                position: "relative",
                top: (mobile ? 8 : 15)
            }}/>
        ) : (
            <div className="row row-cols-1" style={{marginBottom:-30}}>
                {_dt_["map"]((d,i) => (
                    <div key={i} className={(i == (_dt_["length"] - 1)) ? "col" : "col mb-3"}>
                        <div className="card h-100" style={{cursor:"pointer"}} onClick={event => {
                            event["preventDefault"]();
                            mutate!({
                                action: "AC_VIDEOCTX_SET",
                                payload: d["key"]
                            });
                        }}>
                            <div>
                                <LazyLoadImage effect="blur" className="card-img-top" src={Provider({
                                    identified: (d["thumbnail"]),
                                    parameter: {
                                        format: "webp",
                                        quality: 40
                                    }
                                })}/>
                                <span style={{
                                    position: "absolute",
                                    right: 3,
                                    top: 4,
                                    background: "rgba(0,0,0,0.6)",
                                    padding: "0px 6px",
                                    borderRadius: 6,
                                    fontWeight: "bold"
                                }}>
                                    {(new Date(1000 * d["duration"])["toISOString"]())["substring"](11,19)}
                                </span>
                            </div>
                            <div className="card-body">
                                <small className="card-title" style={{position:"relative",top:-6}}>
                                    <strong>
                                        {Texted(d["title"],{
                                            hero: String(character?.label),
                                            game: String(gameContext?.name)
                                        })}
                                    </strong>
                                </small>
                                {d["description"] && (
                                    <p className="card-text" style={{fontSize:12,position:"relative",top:4}}>
                                        {Texted(d["description"],{
                                            hero: String(character?.label),
                                            game: String(gameContext?.name)
                                        })["substring"](0,60)}...
                                    </p>
                                )}
                            </div>
                            <div className="card-footer">
                                <div className="row">
                                    <div className="col">
                                        <i className="far fa-thumbs-up" style={{
                                            position: "relative",
                                            marginRight: 6
                                        }}></i>
                                        <span>
                                            {d["populate"]}
                                        </span>
                                    </div>
                                    <div className="col">
                                        <Moment fromNow>
                                            {d["createAt"]}
                                        </Moment>
                                    </div>
                                    <div className="col">
                                        <i className="far fa-eye" style={{
                                            position: "relative",
                                            marginRight: 6
                                        }}></i>
                                        <span>
                                            {d["view"]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ))
    }
};

/** Componente con el Contenedor de Sugeción y Entre más Información para el Vídeo en la Vista */
const WatchSuggestContainer = ({character}:{
    /** Objeto con la Información del Personaje Asociado al Vídeo */
    character?: WatchCharacter
}) => {
    const [current,setCurrent] = (useState<string>("740c291d"));
    const {gameContext,mobile} = (useContext(GlobalContext));
    const {addCommentContext,fullScreen} = (useContext(WatchContext));
    const {t} = (useTranslation());
    let _container_: ReactNode = null;
    switch(current){
        case "740c291d":
            _container_ = (
                <WatchListSuggestContainer {...{
                    character
                }}/>
            );
        break;
        case "0791b44f":
            _container_ = (
                <div className="card" style={{
                    marginBottom: -30
                }}>
                    <div className="card-body">
                        <h5 className="card-title">
                            {character?.label}
                        </h5>
                        <p className="card-text">
                            {Texted(String(character?.description),{
                                game: String(gameContext?.name),
                                label: String(character?.label)
                            })}
                        </p>
                    </div>
                    <LazyLoadImage effect="blur" className="card-img-top" src={Provider({
                        identified: character!?.illustration["filter"](({name}) => (name == "cover"))[0]["key"],
                        parameter: {
                            format: "webp"
                        }
                    })}/>
                </div>
            );
        break;
    }return (
        <section className="pb-4">
            <div className={mobile ? "border rounded-5" : "border rounded-5 overflow-auto"} style={{
                maxHeight: ((addCommentContext && !fullScreen) ? "54.5rem" : "45.6rem")
            }}>
                <section className="pb-4">
                    <ul className="nav nav-pills mt-2 mb-3 d-flex justify-content-center">
                        {([
                            {
                                label: t("f440e0a41"),
                                icon: "film",
                                key: "740c291d"
                            },
                            {
                                label: t("f440e0a42"),
                                icon: "street-view",
                                key: "0791b44f"
                            }
                        ] as WatchTabLink[])["map"](({label,icon,key},i) => (
                            <li key={i} className="nav-item">
                                <button data-mdb-pill-init className={`nav-link${(key == current) ? " active" : ""}`} disabled={(key == current) || (key == "0791b44f" && character == null)} onClick={event => {
                                    event["preventDefault"]();
                                    setCurrent(key);
                                }}>
                                    <i className={`fas fa-${icon} fa-fw me-2`}></i>
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="tab-content text-center">
                        {_container_}
                    </div>
                </section>
            </div>
        </section>
    );
};

/** Componente con el Contenedor del Reproductor para la Vista */
const WatchPlayerContainer = ({uri,videoID,view}:{
    /** Ruta Absoluta HTTP del Punto Final del Incrustado para Mostrar el Video */
    uri: string,
    /** Identificador Único (UUID) del Vídeo Actual */
    videoID: string,
    /** Vistas Actuales del Vídeo Currente */
    view: number
}) => {
    const {i18n:{language}} = (useTranslation());
    const [one,setOne] = (useState<boolean>(false));
    const [mutate] = (useMutation(GraphQLMutatedVideoLiked,{
        ignoreResults: true
    }));
    return (
        <Stream responsive className="mt-3 mb-2" controls src={uri} onPlay={event => {
            event["preventDefault"]();
            if(!one){
                setOne(true);
                mutate({
                    context: {
                        language
                    },
                    variables: {
                        a7fa34be8: videoID,
                        a081fe4a4: view,
                        acd480dd9: "view"
                    }
                });
            };
        }} onPause={event => {
            console.log(event["timeStamp"]);
        }}/>
    );
};

/** Componente con el Contenedor con la Información del Vídeo para la Vista */
const WatchInformationContainer = ({title,description,views,uploadAt}:{
    /** Titulo a Mostrar en el Contenedor del Vídeo */
    title: string,
    /** Descripción Acerca del Propósito del Vídeo en la Aplicación */
    description?: string,
    /** Total de Visitas del Vídeo en la Aplicación */
    views: number,
    /** Fecha de Publicación del Vídeo en el Proyecto para la Aplicación */
    uploadAt: string
}) => {
    const [active,setActive] = (useState<boolean>(false));
    const {mobile} = (useContext(GlobalContext));
    const {t} = (useTranslation());
    return (
        <div className="accordion accordion-borderless mb-2" id="WatchAcordionMoreInformation">
            <div className="accordion-item">
                <h2 className="accordion-header" id="WatchAcordionMoreInformationH2">
                    <button aria-expanded aria-controls="WatchAcordionMoreInformationCTX" data-mdb-collapse-init data-mdb-target="#WatchAcordionMoreInformationCTX" data-mdb-toggle="collapse" className={`accordion-button${active ? " collapsed" : ""}`} type="button" onClick={event => {
                        event["preventDefault"]();
                        setActive(!active);
                    }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <small style={{
                                        fontSize: 12.1,
                                        position: "relative",
                                        top: -2
                                    }}>
                                        <strong>
                                            {(mobile ? title : (active ? title : title["substring"](0,40) + "..."))}
                                        </strong>
                                    </small>
                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <strong>
                                        {Texted(t((views == 1) ? "c8ad0a141" : "c8ad0a142"),{
                                            count: String(views)
                                        })} | <Moment fromNow>
                                            {uploadAt}
                                        </Moment>
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </button>
                </h2>
                <div className={`accordion-collapse collapse${active ? " show" : ""}`} aria-labelledby="WatchAcordionMoreInformationH2" data-mdb-parent="#WatchAcordionMoreInformation" id="WatchAcordionMoreInformationCTX">
                    <div className="accordion-body">
                        {description ?? t("8347d032")}
                    </div>
                </div>
            </div>
        </div>
    );
};

/** Página para Mostrar la Vista del Reproductor del Vídeo Actual para la Aplicación */
export default function Watch(){
    const {videoID,gameContext,mobile} = (useContext(GlobalContext));
    if(!videoID) return (
        <Navigate to="/"/>
    );
    const {i18n:{language}} = (useTranslation());
    const {fullScreen} = (useContext(WatchContext));
    const {loading,data} = (useQuery(GraphQLVideoInfo,{
        notifyOnNetworkStatusChange: false,
        context: {
            language
        },
        variables: {
            a4fbcc125: (gameContext?.identified),
            a0f2179a5: videoID
        }
    }));
    if(loading){
        return (
            <Template>
                <SkeletonTheme baseColor="#303030">
                    <div className="container">
                        <div className={mobile ? undefined : "row"}>
                            <div className={mobile ? undefined : "col-8"}>
                                <Loader className="mt-3 mb-2" count={1} height={400}/>
                                <Loader className="mb-2" count={1} height={60}/>
                                <Loader className="mb-2" count={1} height={348}/>
                            </div>
                            <div className={mobile ? undefined : "col-4 mt-3"}>
                                <Loader className="mb-3" count={1} height={833}/>
                            </div>
                        </div>
                    </div>
                </SkeletonTheme>
            </Template>
        );
    }else{
        const _dt_: any = ((data["fbd45e939"])["rs"]["ob"][0]);
        return (
            <Template>
                <SEO strategy={{
                    title: (Texted(_dt_["title"],{
                        hero: _dt_["character"]?.label,
                        game: String(gameContext?.name)
                    })),
                    description: (Texted(_dt_["description"],{
                        hero: _dt_["character"]?.label,
                        game: String(gameContext?.name)
                    }))
                }}>
                    <div>
                        <div className="container">
                            <div className={mobile ? undefined : "row"}>
                                <div className={mobile ? undefined : (fullScreen ? "col-12" : "col-8")}>
                                    <WatchPlayerContainer uri={_dt_["endpoint"]} view={_dt_["view"]} {...{videoID}}/>
                                    <div className={(fullScreen && !mobile) ? "row" : undefined}>
                                        <div className={(fullScreen && !mobile) ? "col-8" : undefined}>
                                            <div className="row d-flex align-items-center">
                                                <div className={mobile ? undefined : "col-9"}>
                                                    <WatchInformationContainer {...{
                                                        title: Texted(_dt_["title"],{
                                                            hero: _dt_["character"]?.label,
                                                            game: String(gameContext?.name)
                                                        }),
                                                        description: Texted(_dt_["description"],{
                                                            hero: _dt_["character"]?.label,
                                                            game: String(gameContext?.name)
                                                        }),
                                                        views: _dt_["view"],
                                                        uploadAt: _dt_["createAt"]
                                                    }}/>
                                                </div>
                                                {!mobile && (
                                                    <div className="col-3 mb-2">
                                                        <WatchLikeContainer currentLiked={_dt_["populate"]} {...{videoID}}/>
                                                    </div>
                                                )}
                                            </div>
                                            {!mobile && (
                                                <WatchCommentsContainer />
                                            )}
                                        </div>
                                        {(fullScreen && !mobile) && (
                                            <div className={fullScreen ? "col-4" : undefined}>
                                                <WatchSuggestContainer character={_dt_["character"]}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!fullScreen && (
                                    <div className={mobile ? undefined : "col-4 mt-3"}>
                                        <WatchSuggestContainer character={_dt_["character"]}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </SEO>
            </Template>
        );
    }
};