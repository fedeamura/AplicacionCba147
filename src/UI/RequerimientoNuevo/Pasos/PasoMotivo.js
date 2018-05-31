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
    CardItem
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

import Rules_Motivo from "@Rules/Rules_Motivo";


const MAX_FONT_SIZE = 40;
const MIN_FONT_SIZE = 10;

export default class RequerimientoNuevo_PasoMotivo extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            cargando: false,
            motivos: undefined,
            viendoRestantes: false
        };

        this.animScrollY = new Animated.Value(0);
    }

    componentDidMount() {
        this.actualizar();
    }

    actualizar() {
        this.setState({
            viendoRestantes: false,
            cargando: true,
            motivos: undefined
        }, () => {
            Rules_Motivo.get().then((motivos) => {
                this.setState({
                    cargando: false,
                    motivos: motivos
                });
            });

        })
    }

    verRestantes() {
        this.setState({
            viendoRestantes: true
        });
    }

    informarSeleccion(motivo) {
        if (this.props.onSeleccion != undefined) {
            this.props.onSeleccion(motivo);
        }
    }

    render() {

        const opacitySombra = this.animScrollY.interpolate({
            inputRange: [0, 20],
            outputRange: [0, 1]
        });

        // const initData = global.initData.requerimientoNuevo.pasos.servicio;

        let viewPrincipales = undefined;
        let viewRestantes = undefined;

        if (this.state.motivos != undefined) {
            let principales = [];
            let restantes = [];
            for (let i = 0; i < this.state.motivos.length; i++) {
                let s = this.state.motivos[i];
                if (s.principal == true) {
                    principales.push(s);
                } else {
                    restantes.push(s);
                }
            }

            viewPrincipales = principales.map((motivo) => {
                return <CardServicio
                    key={motivo.id}
                    onPress={() => {
                        this.informarSeleccion(motivo);
                    }}
                    icono={motivo.icono || "flash"}
                    texto={motivo.nombre}
                    textoLines={2}
                    style={{ marginBottom: 16 }}
                    iconoStyle={{ fontSize: 48 }}
                    cardStyle={{ width: 72, height: 72, margin: 8, borderRadius: 200 }}
                    textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                />;
            });

            viewRestantes = restantes.map((motivo) => {
                return <ListItem
                    noBorder
                    key={motivo.id}
                    onPress={() => {
                        this.informarSeleccion(motivo);
                    }}>
                    <Text>{motivo.nombre}</Text>
                </ListItem>;
            });
        }

        return (
            <View style={{ flex: 1 }}>
                <View
                    style={
                        {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:'center',
                            justifyContent: 'center',
                            padding: 16,
                            paddingTop: 20 + 16
                        }}>
                    <Text>Servicio: {this.props.servicioNombre}</Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 32
                        }}>Seleccione un motivo</Text>
                </View>


                <View style={{ flex: 1 }}>
                    <ScrollView
                        scrollEventThrottle={1}
                        onScroll={
                            Animated.event(
                                [{ nativeEvent: { contentOffset: { y: this.animScrollY } } }]
                            )}
                    >
                        <View
                            style={{
                                padding: 16,
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                justifyContent: 'center'
                            }}>
                            {viewPrincipales}
                        </View>

                        {this.state.viendoRestantes == false && !this.state.cargando && (
                            <Button
                                transparent={true}
                                onPress={() => {
                                    this.verRestantes();
                                }}
                                style={{ alignSelf: 'center' }}><Text style={{ color: 'black' }}>Ver mas</Text></Button>
                        )}

                        {this.state.viendoRestantes == true && !this.state.cargando && (
                            <View style={{ marginTop: 32 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 16, paddingBottom: 8 }}>Todos los motivos</Text>
                                {viewRestantes}
                            </View>

                        )}
                    </ScrollView>

                    <Animated.View
                        style={{
                            position: 'absolute',
                            opacity: opacitySombra,
                            height: 16,
                            width: '100%'
                        }}>

                        <LinearGradient
                            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
                            backgroundColor="transparent"
                            style={{ left: 0, top: 0, right: 0, bottom: 0, position: 'absolute' }}
                            pointerEvents="none" />

                    </Animated.View>
                </View>



                {/* {
                    this.state.cargando == false && (
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>

                            <Button
                                style={{ position: 'absolute', left: 16, bottom: 16 }}
                                onPress={() => {
                                    this.actualizar();
                                }}
                            ><Text>Actualizar</Text></Button>

                            <Button
                                style={{ position: 'absolute', right: 16, bottom: 16 }}
                                onPress={() => {
                                    this.props.onSiguiente();
                                }}
                            ><Text>Siguiente</Text></Button>
                        </View>

                    )
                } */}
            </View >
        );
    }
}