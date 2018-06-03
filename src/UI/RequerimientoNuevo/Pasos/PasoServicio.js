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

import Rules_Servicio from "@Rules/Rules_Servicio";


const MAX_FONT_SIZE = 40;
const MIN_FONT_SIZE = 10;

export default class RequerimientoNuevo_PasoServicio extends React.Component {


    constructor(props) {
        super(props);

        let anims = {};
        for (let i = 0; i < props.servicios.length; i++) {
            anims[props.servicios[i].id] = new Animated.Value(0);
        }

        this.state = {
            servicios: props.servicios,
            seleccionado: undefined,
            anims: anims
        };
    }

    seleccionar(servicio) {
        this.setState({
            seleccionado: servicio
        }, () => {
            let anims = [];
            for (var id in this.state.anims) {
                if (this.state.anims.hasOwnProperty(id)) {
                    anims.push(Animated.timing(this.state.anims[id], { toValue: id != servicio.id ? 0 : 1, duration: 300 }))
                }
            }
            Animated.parallel(anims).start();
        });
    }

    deseleccionar() {
        this.setState({
            seleccionado: undefined
        }, () => {
            let anims = [];
            for (var id in this.state.anims) {
                if (this.state.anims.hasOwnProperty(id)) {
                    anims.push(Animated.timing(this.state.anims[id], { toValue: id != servicio.id ? 1 : 0, duration: 300 }))
                }
            }
            Animated.parallel(anims).start();
        });
    }

    informarSeleccion() {
        if (this.props.onSeleccion != undefined) {
            this.props.onSeleccion(this.state.seleccionado);
        }
    }
    render() {
        if (this.state.servicios == undefined) return null;

        const viewPrincipales = this.state.servicios.map((servicio) => {
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


        let seleccionadoEnPrincipales = false;
        if (this.state.seleccionado != undefined) {
            for (let i = 0; i < this.state.servicios.length; i++) {
                let s = this.state.servicios[i];
                if (s.id == this.state.seleccionado.id) {
                    seleccionadoEnPrincipales = true;
                }
            }
        }
        return (

            <View>


                {this.state.seleccionado != undefined && seleccionadoEnPrincipales == false && (
                    <CardServicio
                        key={this.state.seleccionado.id}
                        onPress={() => {
                            this.deseleccionar();
                        }}
                        icono={"flash"}
                        texto={this.state.seleccionado.nombre}
                        textoLines={2}
                        style={{ marginBottom: 16 }}
                        iconoStyle={{ fontSize: 48 }}
                        cardStyle={{ width: 72, height: 72, margin: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                    />
                )}


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
                <Button
                    onPress={() => {
                        this.informarSeleccion();
                    }}
                    rounded
                    disabled={this.state.seleccionado == undefined} style={{ alignSelf: 'flex-end', marginRight: 32 }}><Text>Siguiente</Text></Button>

            </View >
        );
    }
}