import React, { Component } from "react";
import {
    Platform,
    View,
    UIManager,
    Alert,
    Animated,
    StatusBar,
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

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";
import CardServicio from "@Utils/Servicio/CardItem";
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
                    anims.push(Animated.timing(this.state.anims[id], { toValue: id != servicio.id ? 0 : 1, duration: 300 }))
                }
            }

            //Anim no principal
            anims.push(Animated.timing(this.state.animServicioNoPrincipal, { toValue: servicio.principal ? 0 : 1, duration: 300 }));

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
                    anims.push(Animated.timing(this.state.anims[id], { toValue: id != servicio.id ? 1 : 0, duration: 300 }))
                }
            }
            //Anim no principal
            anims.push(Animated.timing(this.state.animServicioNoPrincipal, { toValue: 0, duration: 300 }));

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

        const viewPrincipales = serviciosPrincipales.map((servicio) => {
            let seleccionado = this.state.seleccionado != undefined && this.state.seleccionado.id == servicio.id;
            let backgroundColor = seleccionado ? 'green' : 'white';
            let iconColor = seleccionado ? 'white' : 'black';
            let w = 72;
            let margin = 8;

            let anim = this.state.anims[servicio.id];

            return (
                <Animated.View style={{
                    transform: [
                        {
                            scale: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.2]
                            })
                        }
                    ]
                }}>
                    <CardServicio
                        key={servicio.id}
                        onPress={() => {
                            this.seleccionar(servicio);
                        }}
                        icono={"flash"}
                        texto={servicio.nombre}
                        textoLines={2}
                        style={{ marginBottom: 16 }}
                        iconoStyle={{ fontSize: 48, color: iconColor }}
                        cardColor={backgroundColor}
                        cardStyle={{ width: w, height: w, margin: margin, borderRadius: 200 }}
                        textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                    />
                </Animated.View>
            );

        });



        return (

            <View style={{ marginTop: 32 }}>

                <Animated.View
                    style={{
                        overflow: 'hidden',
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
                    <CardServicio
                        key={this.state.seleccionado == undefined ? -1 : this.state.seleccionado.id}
                        icono={"flash"}
                        texto={this.state.seleccionado == undefined ? '' : this.state.seleccionado.nombre}
                        textoLines={2}
                        style={{ marginBottom: 16 }}
                        iconoStyle={{ fontSize: 48, color: 'white' }}
                        cardColor={'green'}
                        cardStyle={{ width: 72, height: 72, margin: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                    />
                </Animated.View>



                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>
                    {viewPrincipales}

                    {hayMasServicios && (
                        <Button
                            onPress={() => {
                                App.navegar('PickerListado', {
                                    busqueda: true,
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
                            style={{ marginBottom: 32 }}>
                            <Text>Ver todos los servicios</Text>
                        </Button>
                    )}
                </View>
                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    disabled={this.state.seleccionado == undefined} style={{ alignSelf: 'flex-end' }}><Text>Siguiente</Text></Button>

            </View >
        );
    }
}