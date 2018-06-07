import React, { Component } from "react";
import {
    Platform,
    View,
    UIManager,
    Alert,
    Animated,
    StatusBar,
    FlatList,
    ScrollView,
    Keyboard,
    Dimensions
} from "react-native";
import {
    Container,
    Button,
    Text,
    Input,
    ListItem,
    Content,
    CardItem,
    Spinner
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

//Mis componentes
import App from "@UI/App";
import CardCirculo from "@Utils/CardCirculo";
import MiListado from "@Utils/MiListado";

import Rules_Servicio from "@Rules/Rules_Servicio";

export default class RequerimientoNuevo_PasoServicio extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            cargando: true,
            error: undefined,
            servicios: undefined,
            anims: undefined,
            animServicioNoPrincipal: new Animated.Value(0),
            seleccionado: undefined
        };

    }

    componentDidMount() {
        this.setState({
            cargando: true,
            error: undefined,
            servicios: undefined
        }, () => {
            Rules_Servicio.get().then((servicios) => {
                let anims = {};
                for (let i = 0; i < servicios.length; i++) {
                    anims[servicios[i].id] = new Animated.Value(0);
                }

                this.setState({
                    cargando: false,
                    servicios: servicios,
                    anims: anims
                })
            });

        });
    }
    seleccionar(servicio) {
        this.setState({
            seleccionado: servicio
        }, () => {
            //Animo el seleccionado entre los principales
            let anims = [];
            for (var id in this.state.anims) {
                if (this.state.anims.hasOwnProperty(id)) {
                    anims.push(Animated.timing(this.state.anims[id], {
                        toValue: id != servicio.id ? 0 : 1,
                        duration: 300,
                        useNativeDriver: true
                    }))
                }
            }

            //Anim no principal
            anims.push(Animated.timing(this.state.animServicioNoPrincipal, {
                toValue: servicio.principal ? 0 : 1,
                duration: 300
            }));

            Animated.parallel(anims).start();

            //Informo
            this.informarServicio();
        });
    }

    deseleccionar() {
        this.setState({
            seleccionado: undefined
        }, () => {
            //Animo
            let anims = [];
            for (var id in this.state.anims) {
                if (this.state.anims.hasOwnProperty(id)) {
                    anims.push(Animated.timing(this.state.anims[id], {
                        toValue: id != servicio.id ? 1 : 0,
                        duration: 300,
                        useNativeDriver: true
                    }))
                }
            }
            //Anim no principal
            anims.push(Animated.timing(this.state.animServicioNoPrincipal, {
                toValue: 0,
                duration: 300
            }));


            Animated.parallel(anims).start();

            //Informo
            this.informarServicio();
        });
    }

    informarServicio() {
        if (this.props.onServicio == undefined) return;
        this.props.onServicio(this.state.seleccionado);
    }

    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady(this.state.seleccionado);
    }

    render() {
        if (this.state.cargando) {
            return <Spinner color="green"></Spinner>;
        }
        if (this.state.servicios == undefined) return null;

        const wCirculo = 48;
        const wTexto = 80;
        const iconoFontSize = 24;
        const textoFontSize = 16;
        const cardColorFondo = 'rgba(230,230,230,1)';
        const cardColorFondoSeleccionado = 'green';
        const iconoColor = 'black';
        const iconoColorSeleccionado = 'white';

        //Busco los servicios principales
        const serviciosPrincipales = [];
        let hayMasServicios = false;
        for (let i = 0; i < this.state.servicios.length; i++) {
            let servicio = this.state.servicios[i];
            if (servicio.principal) {
                serviciosPrincipales.push(servicio);
            } else {
                hayMasServicios = true;
            }
        }

        //Creo las view principales
        const viewPrincipales = serviciosPrincipales.map((servicio) => {
            let seleccionado = this.state.seleccionado != undefined && this.state.seleccionado.id == servicio.id;
            let backgroundColor = seleccionado ? cardColorFondoSeleccionado : cardColorFondo;
            let iconColor = seleccionado ? iconoColorSeleccionado : iconoColor;
            let anim = this.state.anims[servicio.id];

            return (
                <Animated.View style={{
                    margin: 8,
                    transform: [
                        {
                            scale: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.2]
                            })
                        }
                    ]
                }}>
                    <CardCirculo
                        key={servicio.id}
                        onPress={() => {
                            this.seleccionar(servicio);
                        }}
                        icono={servicio.icono || 'flash'}
                        texto={servicio.nombre}
                        textoLines={1}
                        iconoStyle={{ fontSize: iconoFontSize, color: iconColor }}
                        cardColor={backgroundColor}
                        cardStyle={{ width: wCirculo, height: wCirculo, marginBottom: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: textoFontSize, maxWidth: wTexto, minWidth: wTexto }}
                    />
                </Animated.View>
            );

        });

        return (
            <View style={{ marginTop: 32 }}>
                <Animated.View
                    style={{
                        overflow: 'hidden',
                        transform: [
                            {
                                scale: 1.2
                            }
                        ],
                        opacity: this.state.animServicioNoPrincipal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        }),
                        maxHeight: this.state.animServicioNoPrincipal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1000]
                        })
                    }}
                >
                    <CardCirculo
                        key={this.state.seleccionado == undefined ? -1 : this.state.seleccionado.id}
                        icono={this.state.seleccionado == undefined ? '' : this.state.seleccionado.icono || 'flash'}
                        texto={this.state.seleccionado == undefined ? '' : this.state.seleccionado.nombre}
                        textoLines={1}
                        iconoStyle={{ fontSize: textoFontSize, color: iconoColorSeleccionado }}
                        cardColor={cardColorFondoSeleccionado}
                        cardStyle={{ width: wCirculo, height: wCirculo, marginBottom: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: textoFontSize, maxWidth: wTexto, minWidth: wTexto, minHeight: 40, maxHeight: 40 }}
                    />
                </Animated.View>

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: 32,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>

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

                    {hayMasServicios && (
                        <Button
                            bordered
                            onPress={() => {
                                App.navegar('PickerListado', {
                                    busqueda: true,
                                    placeholderBusqueda: 'Buscar servicio...',
                                    cumpleBusqueda: (item, texto) => {
                                        return item.nombre.toLowerCase().indexOf(texto.toLowerCase()) != -1;
                                    },
                                    data: this.state.servicios,
                                    title: (item) => { return item.nombre },
                                    onPress: (item) => {
                                        this.seleccionar(item);
                                    }
                                })
                            }}
                            style={{
                                alignSelf: 'center',
                                borderColor: 'green'
                            }}>
                            <Text style={{ color: 'green' }}>Ver todos los servicios</Text>
                        </Button>
                    )}
                </View>
                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    disabled={this.state.seleccionado == undefined}
                    style={{
                        alignSelf: 'flex-end',
                        backgroundColor: this.state.seleccionado == undefined ? 'rgba(150,150,150,1)' : 'green'
                    }}><Text>Siguiente</Text></Button>

            </View >
        );
    }
}