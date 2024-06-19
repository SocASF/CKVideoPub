/*
@author LxingA
@version 1.0.0
@project SocASF
@description Página Principal de la Aplicación
@date 09/06/24 12:00AM
*/
import {useTranslation} from 'react-i18next';
import {useState,Fragment,useContext} from 'react';
import {useQuery} from '@apollo/client';
import {GraphQLGameListener} from '../util/graphql';
import {Texted} from '../util/element';
import {Context as GlobalContext} from '../context/global.context';
import {useNavigate} from 'react-router-dom';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {GlobalFilterContainer} from '../components/util.component';
import Loader,{SkeletonTheme} from 'react-loading-skeleton';
import Storage,{Provider} from '../util/storage';
import Moment from 'react-moment';
import Template from '../view/default.template';
import SEO from '../view/seo.template';
import type {ReactNode,Dispatch,SetStateAction} from 'react';
import type Application from '../types/global';

/** Componente Esencial para el Mostrado del Contenedor con la Calificación del Juego en la Aplicación */
const IndexStarContainer = ({count}:{
    /** Contador de Estrellas a Mostrar en el Contenedor */
    count: number
}) => {
    let _container_: ReactNode[] = [];
    for(let o = 0; o <= (4); o++){
        _container_["push"](
            <i className="far fa-star" key={o}></i>
        );
        if(o >= 4) for(let y = 0; y <= (count - 1); y++) _container_[y] = (<i key={y} className="fas fa-star"></i>);
    };
    return (
        <div style={{position:"relative",marginBottom:8}}>
            {_container_}
        </div>
    );
};

/** Componente Esencial para el Mostrado del Contenedor con el Paginador de la Vista para la Aplicación */
const IndexPaginationContainer = ({currentPage,perPage,callback,total,pages,loader}:{
    /** Página Actual en la Aplicación */
    currentPage: number,
    /** Total de Elementos a Mostrar en la Aplicación */
    perPage: number,
    /** Callback para la Mutación de la Página Actual de la Aplicación */
    callback: Dispatch<SetStateAction<number>>,
    /** Total de Elementos Obtenidos en la Base de Datos de la Aplicación */
    total: number,
    /** Número Total de Páginas en Base de los Elementos Obtenidos en la Base de Datos de la Aplicación */
    pages: number,
    /** Indicar sí está en Modo Cargando */
    loader: boolean
}) => {
    const {t} = (useTranslation());
    return (
        <nav className="text-center">
            <ul className="pagination d-flex justify-content-center">
                <li className="page-item">
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage <= 1 || loader} onClick={event => {
                        event["preventDefault"]();
                        callback(1);
                    }}>
                        <i className="fas fa-angles-left"></i>
                    </button>
                </li>
                <li className="page-item" style={{position:"relative",marginLeft:4}}>
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage <= 1 || loader} onClick={event => {
                        event["preventDefault"]();
                        callback(currentPage - 1);
                    }}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                </li>
                <li className="page-item" style={{position:"relative",marginLeft:4}}>
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage == pages || loader} onClick={event => {
                        event["preventDefault"]();
                        callback(currentPage + 1);
                    }}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </li>
                <li className="page-item" style={{position:"relative",marginLeft:4}}>
                    <button data-mdb-ripple-init className="page-link btn btn-primary" disabled={currentPage == pages || loader} onClick={event => {
                        event["preventDefault"]();
                        callback(pages);
                    }}>
                        <i className="fas fa-angles-right"></i>
                    </button>
                </li>
            </ul>
            <p dangerouslySetInnerHTML={{
                __html: (loader ? "..." : (
                    Texted(t("b171b2b0"),{
                        celements: ((currentPage == pages) ? (total) : (perPage * currentPage))["toString"](),
                        telements: total["toString"]()
                    })
                ))
            }} />
        </nav>
    );
};

/** Componente Esencial para Mostrar el Contenedor con la Cabecera de la Vista de los Juegos de la Aplicación */
const IndexHeaderContainer = () => {
    const {t} = (useTranslation());
    return (
        <header>
            <div className="p-5 text-center bg-image" style={{backgroundImage:`url(${Provider({
                identified: "5d015ce6-9da1-475a-802b-2cb40285fd6b.webp",
                external: true
            })})`,height:600}}>
                <div className="mask" style={{backgroundColor:"rgba(0,0,0,0.6)"}}>
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-white">
                            <h1 className="mb-3">
                                {t("0ced5c89T")}
                            </h1>
                            <h4 className="mb-3">
                                {t("0ced5c89D")}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

/** Inicialización del Estado Principal para la Aplicación */
function InitState(){
    const _cd_: ReactNode[] = [];
    const [currentPage,setPage] = (useState<number>(1));
    const [changed,setChanged] = (useState<string>());
    const [perPage,setPerPage] = (useState<number>(4));
    const {i18n:{language},t} = (useTranslation());
    const {mutate,mobile,currentFilter} = (useContext(GlobalContext));
    const {data,loading} = (useQuery(GraphQLGameListener,{
        notifyOnNetworkStatusChange: false,
        variables: {
            a2a2f7516: {
                a3f53e411: perPage,
                af0afffd2: currentPage
            },
            a4dec699b: (currentFilter == "637b9a0e-228b-4606-9ec8-baffcf61f6cd" ? undefined : currentFilter)
        },
        context: {
            language
        }
    }));
    const navigator = (useNavigate());
    if(loading){
        for(let t = 0; t <= (perPage - 1); t++) _cd_["push"](
            <div key={t} className={`col-${mobile ? "12 text-center" : 6} mt-3`}>
                <div className="card">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <LazyLoadImage effect="blur" className="img-fluid rounded-start" src={Provider({
                                identified: "98246e49-8d1d-4532-ae40-09c1bd0e4fe5.webp",
                                external: true
                            })}/>
                        </div>
                        <div className="col-md-8">
                            <div className="card-header" />
                            <div className="card-body">
                                <SkeletonTheme baseColor="#424242" highlightColor="#C0C0C0">
                                    <h5 className="card-title">
                                        <Loader count={1} height={30}/>
                                    </h5>
                                    <IndexStarContainer count={0}/>
                                    <p className="card-text">
                                        <Loader count={5} height={10}/>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <Loader count={1} height={20} width={150}/>
                                        </small>
                                    </p>
                                </SkeletonTheme>
                            </div>
                            <div className="card-footer" />
                        </div>
                    </div>
                </div>
            </div>
        );return (
            <Fragment>
                <IndexHeaderContainer />
                <div className="row mb-3">
                    {_cd_}
                </div>
                <IndexPaginationContainer loader pages={0} total={0} callback={setPage} {...{perPage,currentPage}}/>
            </Fragment>
        );
    }else{
        const _dt_: any = (data["f544e1445"]["rs"]);
        return (
            <div>
                <IndexHeaderContainer />
                {!mobile && (
                    <GlobalFilterContainer currentPerPage={perPage} callback={setPerPage} additionalOption={[
                        {
                            label: (Texted(t("883e7c270"),{
                                label: (t("883e7c274"))
                            })),
                            value: "24f3eb68-f4a1-4c79-87f8-231d6a1b6648"
                        }
                    ]} disabled={currentPage > 1}/>
                )}
                <div className="row mb-3">
                    {(_dt_["ob"] as any[])["map"]((d,i) => {
                        const _buttonText_: string = (t("7bea6c1f1")["split"]("|")[(d["videos"] <= 1 ? 1 : 0)]);
                        return (
                            <div key={i} className={`col-${mobile ? "12 text-center" : 6} mt-3`}>
                                <div className="card">
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <LazyLoadImage effect="blur" className="img-fluid rounded-start" src={Provider({
                                                identified: d["illustration"]["filter"]((o:any) => (o["name"] == "cover"))[0]["key"],
                                                parameter: {
                                                    format: "webp"
                                                }
                                            })}/>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-header" />
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {d["title"]}
                                                </h5>
                                                <IndexStarContainer count={d["populate"]}/>
                                                {d["description"] && (
                                                    <p className="card-text">
                                                        {d["description"]}
                                                    </p>
                                                )}
                                                <p className="card-text" style={{position:"relative",top:-2}}>
                                                    <small title={(new Date(Date["parse"](d["createAt"])))["toLocaleString"]()} className="text-muted">
                                                        {t("9c524118")}
                                                        <Moment fromNow>
                                                            {d["createAt"]}
                                                        </Moment>
                                                    </small>
                                                </p>
                                                <button data-mdb-ripple-init className="btn btn-primary" disabled={!d["available"] || (typeof(changed) == "string")} onClick={event => {
                                                    event["preventDefault"]();
                                                    setChanged(d["key"]);
                                                    mutate!({
                                                        action: "AC_GAMECTX_SET",
                                                        payload: {
                                                            method: "add",
                                                            value: {
                                                                identified: d["key"],
                                                                name: d["title"],
                                                                description: d["description"],
                                                                image: d["illustration"]["filter"]((o:any) => (o["name"] == "background"))[0]["key"]
                                                            }
                                                        }
                                                    });
                                                    setTimeout(() => {
                                                        navigator("/container");
                                                        window["scrollTo"](0,0);
                                                    },1000);
                                                }}>
                                                    {d["available"] ? ((typeof(changed) == "string" && changed == d["key"]) ? t("7bea6c1f3") : Texted(_buttonText_,{
                                                        count: d["videos"]
                                                    })) : t("7bea6c1f2")}
                                                </button>
                                            </div>
                                            <div className="card-footer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <IndexPaginationContainer pages={_dt_["pp"]} total={_dt_["tt"]} callback={setPage} {...{perPage,currentPage}} loader={false}/>
            </div>
        );
    }
}

/** Página Principal de la Aplicación */
export default function Home(){
    const [init,setInit] = (useState<boolean>(false));
    const {alternative,name,slogan}: Application = (Storage["get"]("global"));
    const {t} = (useTranslation());
    return (
        <Template>
            <SEO strategy={{}}>
                {init ? (
                    <InitState />
                ) : (
                    <header>
                        <div className="p-5 text-center bg-image" style={{
                            backgroundImage: `url(${Provider({
                                identified: "593fb7dd-9f32-46c0-9fb3-be581681af6d.webp",
                                external: true
                            })})`,
                            height: 700
                        }}>
                            <div className="mask" style={{
                                backgroundColor: "rgba(0,0,0,0.6)"
                            }}>
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    <div className="text-white">
                                        <h1 className="mb-3">
                                            {alternative![0]} {name}
                                        </h1>
                                        <h4 className="mb-3">
                                            {slogan}
                                        </h4>
                                        <button data-mdb-ripple-init className="btn btn-outline-light btn-lg" onClick={event => {
                                            event["preventDefault"]();
                                            setInit(true);
                                        }}>
                                            {t("eb55718e")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                )}
            </SEO>
        </Template>
    );
};