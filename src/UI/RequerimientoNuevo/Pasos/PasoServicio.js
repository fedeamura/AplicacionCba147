import React from "react";
import {
    View
} from "react-native";
import {
    Button,
    Text,
    ListItem
} from "native-base";

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";
import CardCirculo from "@Utils/CardCirculo";
import MiItemDetalle from "@Utils/MiItemDetalle";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import _ from 'lodash';
import autobind from 'autobind-decorator'

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
            servicio: undefined,
            motivo: undefined,
            mostrarServicio: true,
            mostrarMotivo: false,
            mostrarResultado: false,
            height: 0
        };
    }

    static defaultProps = {
        ...React.Component.defaultProps,
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
            Rules_Motivo.get(servicio.Id)
                .then(function (data) {
                    data = _.orderBy(data, 'Nombre');
                    this.setState({ servicio: servicio, motivos: data, mostrarServicio: false },
                        function () {
                            setTimeout(function () {
                                this.setState({ cargando: false, mostrarMotivo: true });
                            }.bind(this), 300);
                        });
                }.bind(this));
        });
    }

    @autobind
    cancelarServicio() {
        this.setState({ mostrarMotivo: false }, function () {
            setTimeout(function () {
                this.setState({ servicio: undefined, motivos: undefined, mostrarServicio: true });
            }.bind(this), 300);
        })
    }

    @autobind
    seleccionarMotivo(motivo) {
        this.setState({
            motivo: motivo,
            mostrarMotivo: false
        }, function () {
            this.informar();

            setTimeout(function () {
                this.setState({ mostrarResultado: true });
            }.bind(this), 300);
        }.bind(this));
    }

    @autobind
    seleccionarServicioMotivo(servicio, motivo) {
        this.setState({
            servicio: servicio,
            motivo: motivo,
            mostrarServicio: false,
            mostrarMotivo: false
        }, function () {
            this.informar();

            setTimeout(function () {
                this.setState({ mostrarResultado: true });
            }.bind(this), 300);
        });
    }

    @autobind
    cancelarMotivo() {
        this.setState({ mostrarResultado: false, mostrarMotivo: false }, function () {
            setTimeout(function () {
                this.setState({ motivo: undefined, servicio: undefined, mostrarServicio: true }, function () {
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
            cumpleBusqueda: function (item, texto) {
                return item.Nombre.toLowerCase().indexOf(texto.toLowerCase()) != -1;
            },
            data: this.state.servicios,
            title: function (item) { return item.Nombre },
            onPress: this.seleccionarServicio
        })
    }

    @autobind
    verTodosLosMotivos() {
        App.navegar('PickerListado', {
            busqueda: true,
            backgroundColor: initData.backgroundColor,
            placeholderBusqueda: 'Buscar motivo...',
            cumpleBusqueda: function (item, texto) {
                return item.Nombre.toLowerCase().indexOf(texto.toLowerCase()) != -1;
            },
            data: this.state.motivos,
            title: function (item) { return item.Nombre },
            onPress: this.seleccionarMotivo
        });
    }

    @autobind
    buscar() {
        this.setState({ cargando: true }, function () {
            Rules_Motivo.getParaBuscar()
                .then(function (data) {
                    this.setState({ cargando: false });

                    App.navegar('PickerListado', {
                        busqueda: true,
                        backgroundColor: initData.backgroundColor,
                        placeholderBusqueda: 'Buscar motivo...',
                        cumpleBusqueda: function (item, texto) {
                            return item.Nombre.toLowerCase().indexOf(texto.toLowerCase()) != -1;
                        },
                        data: data,
                        renderItem: function (item) {
                            return <View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 8 }}>Servicio:</Text>
                                    <Text>{item.ServicioNombre}</Text>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 8 }}>Motivo:</Text>
                                    <Text>{item.Nombre}</Text>
                                </View>
                            </View>
                        },
                        onPress: function (item) {
                            let servicio = {
                                Id: 1,
                                Nombre: 'Test'
                            };
                            let motivo = {
                                Id: 1,
                                Nombre: 'Test'
                            };

                            this.seleccionarServicioMotivo(servicio, motivo);
                        }.bind(this)
                    });
                }.bind(this));

        })
    }

    @autobind
    informar() {
        if (this.props.onMotivo == undefined) return;
        this.props.onMotivo(this.state.servicio, this.state.motivo);
    }

    @autobind
    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady(this.state.servicio, this.state.motivo);
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
            if (servicio.Principal == true && serviciosPrincipales.length <= 5) {
                serviciosPrincipales.push(servicio);
            }
        }

        //Creo las view principales
        const viewPrincipales = serviciosPrincipales.map((servicio) => {
            let backgroundColor = servicio.Color || cardColorFondo;
            let iconColor = iconoColor;

            return (

                <View style={{ width: wCirculo }}>
                    <CardCirculo
                        key={servicio.Id}
                        onPress={this.seleccionarServicio.bind(this, servicio)}
                        icono={servicio.Icono || 'flash'}
                        texto={servicio.Nombre || 'Sin datos'}
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
        const nombreServicio = this.state.servicio == undefined ? '' : this.state.servicio.Nombre;
        const motivos = this.state.motivos == undefined ? [] : this.state.motivos.slice(0, 3);

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
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <MiItemDetalle
                            style={{ flex: 1 }}
                            titulo="Categoria seleccionada"
                            subtitulo={nombreServicio} />

                        <Button
                            transparent
                            onPress={this.cancelarServicio}
                        >
                            <Icon name="close" style={{ fontSize: 24 }} />
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
                            <Text>{item.Nombre}</Text>
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
        const nombreServicio = this.state.servicio == undefined ? '' : this.state.servicio.Nombre;
        const nombreMotivo = this.state.motivo == undefined ? '' : this.state.motivo.Nombre;

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
                            bordered
                            small
                            style={{ alignSelf: 'center', borderColor: '#D32F2F' }}>

                            <Text style={{ color: '#D32F2F' }}>Cancelar seleccion</Text>
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
                            disabled={this.state.servicio == undefined || this.state.motivo == undefined}
                            style={{
                                alignSelf: 'flex-end',
                                borderColor: this.state.servicio == undefined || this.state.motivo == undefined ? 'rgba(150,150,150,1)' : 'green'
                            }}><Text
                                style={{
                                    color: this.state.servicio == undefined || this.state.motivo == undefined ? 'rgba(150,150,150,1)' : 'green'
                                }}
                            >Siguiente</Text></Button>
                    </View>
                </View>

            </MiView>
        );
    }
}