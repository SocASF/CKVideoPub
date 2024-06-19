/*
@author LxingA
@version 1.0.0
@project SocASF
@description Vista para Mostrar el Reproductor del Vídeo Actual para la Aplicación
@date 13/06/24 05:00PM
*/
import {Navigate} from 'react-router-dom';
import {Context as GlobalContext} from '../context/global.context';
import {useContext,useState} from 'react';
import {useQuery} from '@apollo/client';
import {useTranslation} from 'react-i18next';
import {GraphQLVideoInfo,GraphQLVideoSuggest} from '../util/graphql';
import {Texted} from '../util/element';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {Provider} from '../util/storage';
import Loader,{SkeletonTheme} from 'react-loading-skeleton';
import Moment from 'react-moment';
import SEO from '../view/seo.template';
import Template from '../view/default.template';
import type {ReactNode} from 'react';

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

/** Componente con el Contenedor del Listado de los Vídeos Relacionados para la Vista */
const WatchListSuggestContainer = ({character}:{
    character?: WatchCharacter
}) => {
    const _loader_: ReactNode[] = [];
    const ContainerError = ({message}:{
        message: string
    }) => {
        return (
            <div style={{position:"relative",top:8}}>
                <i className="fas fa-circle-exclamation fa-2xl"></i>
                <p className="mt-3">
                    {message}
                </p>
            </div>
        );
    };
    const [perPage] = (useState<number>(4));
    const {gameContext,videoID,mutate} = (useContext(GlobalContext));
    const {i18n:{language},t} = (useTranslation());
    const {loading,data} = (useQuery(GraphQLVideoSuggest,{
        fetchPolicy: "cache-and-network",
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
            <ContainerError message={t("6d49b11e")}/>
        ) : (
            <div className="row row-cols-1" style={{marginBottom:-30}}>
                {_dt_["map"]((d,i) => (
                    <div key={i} className="col mb-2">
                        <div className="card h-100" style={{cursor:"pointer"}} onClick={event => {
                            event["preventDefault"]();
                            mutate!({
                                action: "AC_VIDEOCTX_SET",
                                payload: d["key"]
                            });
                        }}>
                            <LazyLoadImage effect="blur" className="card-img-top" src={Provider({
                                identified: (d["thumbnail"]),
                                parameter: {
                                    format: "webp",
                                    quality: 40
                                }
                            })}/>
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
                                        <Moment fromNow>
                                            {d["createAt"]}
                                        </Moment>
                                    </div>
                                    <div className="col">
                                        {Texted(t("c8ad0a14"),{
                                            count: d["view"]
                                        })}
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
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">
                            {character?.label}
                        </h5>
                        <p className="card-text">
                            {Texted(String(character?.description),{
                                game: String(gameContext?.name)
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
        <section className="pb-4 mt-3">
            <div className={mobile ? "border rounded-5" : "border rounded-5 overflow-auto"} style={mobile ? undefined : {maxHeight:450}}>
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
const WatchPlayerContainer = ({uri}:{
    /** Ruta Absoluta HTTP del Punto Final del Incrustado para Mostrar el Video */
    uri: string
}) => {
    return (
        <div className="mt-3 mb-2" style={{
            position: "relative",
            paddingTop: "45.0%",
            backgroundColor: "#303030"
        }}>
            <iframe src={uri} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" loading="lazy" allowFullScreen style={{
                border: 0,
                position: "absolute",
                top: 0,
                height: "100%",
                width: "100%"
            }}/>
        </div>
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
                                    <small>
                                        <strong>
                                            {title}
                                        </strong>
                                    </small>
                                </div>
                                <div className="col-6 d-flex justify-content-end">
                                    <strong>
                                        {Texted(t("c8ad0a14"),{
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
                    <div className="row">
                        <div className="col-8">
                            <Loader className="mt-2 mb-2" count={1} height={350}/>
                            <Loader className="mb-2" count={1} height={80}/>
                        </div>
                        <div className="col-4">
                            <Loader className="mt-2 mb-2" count={1} height={442}/>
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
                        hero: _dt_["character"]?.label
                    })),
                    description: (Texted(_dt_["description"],{
                        hero: _dt_["character"]?.label
                    }))
                }}>
                    <div className={mobile ? "container" : "row"}>
                        <div className={mobile ? undefined : "col-8"}>
                            <WatchPlayerContainer uri={_dt_["endpoint"]}/>
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
                        <div className={mobile ? undefined : "col-4"}>
                            <WatchSuggestContainer character={_dt_["character"]}/>
                        </div>
                    </div>
                </SEO>
            </Template>
        );
    }
};