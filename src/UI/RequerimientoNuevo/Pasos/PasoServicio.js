import React from "react";
import {
    View,
    Alert
} from "react-native";
import {
    Button,
    Text,
    ListItem
} from "native-base";
import _ from 'lodash';
import autobind from 'autobind-decorator'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";
import CardCirculo from "@Utils/CardCirculo";
import MiItemDetalle from "@Utils/MiItemDetalle";
import { toTitleCase, quitarAcentos } from "@Utils/Helpers";

//Rules
import Rules_Motivo from "@Rules/Rules_Motivo";

export default class RequerimientoNuevo_PasoServicio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            servicios: props.servicios,
            motivos: undefined,
            cargando: false,
            error: undefined,
            anims: undefined,
            servicioNombre: undefined,
            motivoNombre: undefined,
            motivoId: undefined,
            mostrarServicio: true,
            mostrarMotivo: false,
            mostrarResultado: false,
            height: 0
        };
    }

    static defaultProps = {
        ...React.Component.defaultProps,
        servicios: [],
        onCargando: function () { }
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state.cargando != prevState.cargando) {
            this.props.onCargando(prevState.cargando);
        }
    }

    @autobind
    seleccionarServicio(servicio) {
        this.setState({ cargando: true }, function () {
            Rules_Motivo.get(servicio.id)
                .then(function (data) {
                    data = _.orderBy(data, 'nombre');
                    this.setState({
                        servicioNombre: servicio.nombre,
                        motivos: data,
                        mostrarServicio: false
                    },
                        function () {
                            setTimeout(function () {
                                this.setState({
                                    cargando: false,
                                    mostrarMotivo: true
                                });
                            }.bind(this), 300);
                        });
                }.bind(this))
                .catch(function (error) {
                    this.setState({
                        cargando: false
                    });
                    Alert.alert('', error || 'Error procesando la solicitud');
                }.bind(this));
        });
    }

    @autobind
    cancelarServicio() {
        this.setState({ mostrarMotivo: false }, function () {
            setTimeout(function () {
                this.setState({
                    servicioNombre: undefined,
                    motivos: undefined,
                    mostrarServicio: true
                });
            }.bind(this), 300);
        })
    }

    @autobind
    seleccionarMotivo(motivo) {
        this.setState({
            motivoNombre: motivo.nombre,
            motivoId: motivo.id,
            mostrarMotivo: false
        }, function () {
            this.informar();
            setTimeout(function () {
                this.setState({ mostrarResultado: true });
            }.bind(this), 300);
        }.bind(this));
    }

    @autobind
    seleccionarServicioMotivo(entity) {
        // this.setState({
        //     servicio: servicio,
        //     motivo: motivo,
        //     mostrarServicio: false,
        //     mostrarMotivo: false
        // }, function () {
        //     this.informar();

        //     setTimeout(function () {
        //         this.setState({ mostrarResultado: true });
        //     }.bind(this), 300);
        // });
    }

    @autobind
    cancelarMotivo() {
        this.setState({
            mostrarResultado: false,
            mostrarMotivo: false
        }, function () {
            setTimeout(function () {
                this.setState({
                    motivoNombre: undefined,
                    servicioNombre: undefined,
                    motivoId: undefined,
                    mostrarServicio: true
                }, () => {
                    this.informar();
                });
            }.bind(this), 300);
        });
    }

    @autobind
    verTodosLosServicios() {
        App.navegar('PickerListado', {
            busqueda: true,
            backgroundColor: initData.backgroundColor,
            placeholderBusqueda: 'Buscar categoría...',
            textoEmpty: 'Categoría no encontrada',
            cumpleBusqueda: function (item, texto) {
                let campo = quitarAcentos(item.nombre.trim()).toLowerCase();
                let filtro = quitarAcentos(texto.trim()).toLowerCase();
                return campo.indexOf(filtro) != -1;
            },
            keyExtractor: function (data) {
                return data.id;
            },
            data: this.state.servicios,
            title: function (item) { return toTitleCase(item.nombre) },
            onPress: this.seleccionarServicio
        })
    }

    @autobind
    verTodosLosMotivos() {
        App.navegar('PickerListado', {
            busqueda: true,
            backgroundColor: initData.backgroundColor,
            placeholderBusqueda: 'Buscar motivo...',
            textoEmpty: 'Motivo no encontrado',
            keyExtractor: function (data) {
                return data.id;
            },
            cumpleBusqueda: function (item, texto) {
                let campoNombre = quitarAcentos(item.nombre.trim()).toLowerCase();
                let campoKeywords = quitarAcentos(item.keywords || '').trim().toLowerCase().split(' ');
                let filtro = quitarAcentos(texto.trim()).toLowerCase();

                let cumpleNombre = campoNombre.indexOf(filtro) != -1;
                let cumpleKeyword = false;
                for (let i = 0; i < campoKeywords.length; i++) {
                    let cumple = campoKeywords[i].indexOf(filtro) != -1;
                    if (cumple) {
                        cumpleKeyword = true;
                    }
                }

                return cumpleNombre == true || cumpleKeyword == true;
            },
            data: this.state.motivos,
            title: function (item) { return toTitleCase(item.nombre).trim() },
            onPress: this.seleccionarMotivo
        });
    }


    @autobind
    buscar() {
        this.setState({ cargando: true }, function () {
            Rules_Motivo.getParaBuscar()
                .then(function (data) {
                    this.setState({ cargando: false });

                    data = _.orderBy(data, 'motivoNombre');
                    App.navegar('PickerListado', {
                        busqueda: true,
                        backgroundColor: initData.backgroundColor,
                        placeholderBusqueda: 'Buscar motivo...',
                        cumpleBusqueda: function (item, texto) {
                            let campoNombre = quitarAcentos(item.motivoNombre.toLowerCase().trim());
                            let campoServicio = quitarAcentos(item.servicioNombre.toLowerCase().trim());
                            let campoKeywords = quitarAcentos(item.motivoKeywords || '').trim().toLowerCase().split(' ');

                            let filtro = quitarAcentos(texto.toLowerCase().trim());

                            let cumpleNombre = campoNombre.indexOf(filtro) != -1;
                            let cumpleServicio = campoServicio.indexOf(filtro) != -1;
                            let cumpleKeyword = false;
                            for (let i = 0; i < campoKeywords.length; i++) {
                                let cumple = campoKeywords[i].indexOf(filtro) != -1;
                                if (cumple) {
                                    cumpleKeyword = true;
                                }
                            }

                            return cumpleNombre == true || cumpleKeyword == true || cumpleServicio == true;
                        },
                        data: data,
                        keyExtractor: function (data) {
                            return data.motivoId;
                        },
                        renderItem: function (item) {
                            return <View style={{ width: '100%' }}>
                                <View style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'flex-start' }}>Categoría:</Text>
                                    <Text style={{ flex: 1, alignSelf: 'flex-start' }}>{toTitleCase(item.servicioNombre).trim()}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 8 }}>
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'flex-start' }}>Motivo:</Text>
                                    <Text style={{ flex: 1, alignSelf: 'flex-start' }}>{toTitleCase(item.motivoNombre).trim()}</Text>
                                </View>
                            </View>
                        },
                        onPress: this.seleccionarServicioMotivo
                    });
                }.bind(this));
        })
    }

    @autobind
    informar() {
        if (this.props.onMotivo == undefined) return;
        this.props.onMotivo({ servicioNombre: this.state.servicioNombre, motivoNombre: this.state.motivoNombre, motivoId: this.state.motivoId });
    }

    @autobind
    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady({ servicioNombre: this.state.servicioNombre, motivoNombre: this.state.motivoNombre, motivoId: this.state.motivoId });
    }

    render() {
        if (this.state.servicios == undefined) return null;

        return (
            <View style={{ minHeight: 250, opacity: this.state.height == 0 ? 0 : 1 }}>
                {this.renderViewServiciosPrincipales()}
                {this.renderViewSeleccionarMotivo()}
                {this.renderViewMotivoSeleccionado()}
            </View>
        );
    }

    @autobind
    onLayout(event) {
        var { width, height } = event.nativeEvent.layout;
        this.setState({ height: height, width: (width - 32) });
    }

    renderViewServiciosPrincipales() {
        const wCirculo = (this.state.width || 0) / 3;
        const iconoFontSize = 24;
        const textoFontSize = 12;
        const cardColorFondo = 'rgba(230,230,230,1)';
        const iconoColor = 'white';

        const serviciosPrincipales = [];
        for (let i = 0; i < this.state.servicios.length; i++) {
            let servicio = this.state.servicios[i];
            if (servicio.principal == true && serviciosPrincipales.length <= 5) {
                serviciosPrincipales.push(servicio);
            }
        }

        //Creo las view principales
        const viewPrincipales = serviciosPrincipales.map((servicio) => {
            let backgroundColor = servicio.color || cardColorFondo;
            let iconColor = iconoColor;

            return (

                <View style={{ width: wCirculo }}>
                    <CardCirculo
                        key={servicio.Id}
                        onPress={this.seleccionarServicio.bind(this, servicio)}
                        icono={servicio.icono || 'flash'}
                        texto={toTitleCase(servicio.nombre || 'Sin datos')}
                        textoLines={2}
                        iconoStyle={{ fontSize: iconoFontSize, color: iconColor }}
                        cardColor={backgroundColor}
                        cardStyle={{ width: wCirculo * 0.6, height: wCirculo * 0.6, marginBottom: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: textoFontSize, maxWidth: wCirculo * 0.8, minWidth: wCirculo * 0.8 }}
                    />
                </View>

            );

        });

        return (
            <MiView visible={this.state.mostrarServicio}>
                <View
                    style={{ padding: 16 }}
                    onLayout={this.onLayout}>

                    {/* Buscar */}
                    <View>
                        <Button
                            small
                            bordered
                            onPress={this.buscar}
                            style={{ alignSelf: 'flex-end', borderColor: 'rgba(130,130,130,1)' }}
                        >
                            <Icon name="magnify" style={{ fontSize: 18, marginLeft: 4 }} />
                            <Text style={{ color: 'rgba(130,130,130,1)' }}>Buscar</Text>
                        </Button>

                        <View style={{ height: 16 }} />
                    </View>

                    {/* <Text style={{ alignSelf: 'center', fontSize: 22, marginBottom: 8 }}>Categorias principales</Text> */}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        marginBottom: 16,
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>

                        {viewPrincipales}
                    </View>

                    {/* Boton ver todas  */}
                    <Button
                        bordered
                        small
                        onPress={this.verTodosLosServicios}
                        style={{
                            alignSelf: 'center',
                            borderColor: 'green'
                        }}>
                        <Text style={{ color: 'green' }}>Ver todos las categorias</Text>
                    </Button>
                </View>

            </MiView>
        );

    }

    renderViewSeleccionarMotivo() {
        const nombreServicio = this.state.servicioNombre == undefined ? '' : toTitleCase(this.state.servicioNombre);
        const motivos = [];
        if (this.state.motivos != undefined) {
            for (var i = 0; i < this.state.motivos.length; i++) {
                let motivo = this.state.motivos[i];
                if (motivo && motivo.principal == true) {
                    motivos.push(motivo);
                }
            }
        }

        return (
            <MiView visible={this.state.mostrarMotivo}>

                <View style={{ padding: 16 }}>
                    {/* Buscar */}
                    <View>
                        <Button
                            small
                            onPress={this.buscar}
                            bordered
                            style={{ alignSelf: 'flex-end', borderColor: 'rgba(130,130,130,1)' }}
                        >
                            <Icon name="magnify" style={{ fontSize: 18, marginLeft: 4 }} />
                            <Text style={{ color: 'rgba(130,130,130,1)' }}>Buscar</Text>
                        </Button>

                        <View style={{ height: 16 }} />
                    </View>

                    {/* Categoria seleccionada */}
                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <MiItemDetalle
                            titulo="Categoria seleccionada"
                            subtitulo={nombreServicio} />

                        <Button
                            transparent
                            small
                            onPress={this.cancelarServicio}
                        >
                            <Text style={{ color: colorCancelar, marginLeft: -16, textDecorationLine: 'underline' }}>Cancelar categoría</Text>
                        </Button>
                    </View>

                    {/* Listado de motivos principales */}
                    <View style={{ height: 32 }} />
                    <Text style={{ fontWeight: 'bold' }}>Ahora seleccione un motivo:</Text>
                    <View style={{ height: 8 }} />
                    {motivos.map((item) => {
                        return <ListItem
                            onPress={this.seleccionarMotivo.bind(this, item)}
                            style={{ marginLeft: 0 }}>
                            <Text>{toTitleCase(item.nombre).trim()}</Text>
                        </ListItem>;
                    })}
                    <View style={{ height: 16 }} />

                    {/* Boton ver todos los motivos */}
                    <Button
                        onPress={this.verTodosLosMotivos}
                        bordered
                        small
                        style={{ alignSelf: 'center', borderColor: 'green' }}>
                        <Text style={{ color: 'green' }}>Ver todos los motivos</Text>
                    </Button>
                </View>

            </MiView>
        );
    }

    renderViewMotivoSeleccionado() {
        const nombreServicio = toTitleCase(this.state.servicioNombre || 'Sin datos').trim();
        const nombreMotivo = toTitleCase(this.state.motivoNombre || 'Sin datos').trim();

        return (
            <MiView padding={false} visible={this.state.mostrarResultado}>
                <View style={{ display: 'flex', flexDirection: 'column', minHeight: 250 }}>
                    <View style={{ padding: 16, flex: 1 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

                            <View style={{ flex: 1 }}>

                                <MiItemDetalle titulo="Categoría seleccionada" subtitulo={nombreServicio} />
                                <View style={{ height: 8 }} />

                                <MiItemDetalle titulo="Motivo seleccionado" subtitulo={nombreMotivo} />
                                <View style={{ height: 8 }} />
                            </View>
                        </View>

                        <View style={{ height: 16 }} />
                        <Button
                            small
                            onPress={this.cancelarMotivo}
                            transparent
                            style={{}}>

                            <Text style={{ color: colorCancelar, textDecorationLine: 'underline', marginLeft: -16 }}>Cancelar selección</Text>
                        </Button>
                    </View>

                    <View style={{ height: 16 }} />
                    <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} />

                    {/* Boton siguiente  */}
                    <View style={{ padding: 16 }}>
                        <Button
                            small
                            onPress={this.informarReady}
                            rounded
                            bordered
                            disabled={this.state.motivoId == undefined}
                            style={{
                                alignSelf: 'flex-end',
                                borderColor: this.state.motivoId == undefined ? 'rgba(150,150,150,1)' : 'green'
                            }}><Text
                                style={{
                                    color: this.state.motivoId == undefined ? 'rgba(150,150,150,1)' : 'green'
                                }}
                            >Siguiente</Text></Button>
                    </View>
                </View>

            </MiView>
        );
    }
}

const colorCancelar = '#E53935';