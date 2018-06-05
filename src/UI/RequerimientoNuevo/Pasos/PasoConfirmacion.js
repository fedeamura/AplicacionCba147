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

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_PasoConfirmacion extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

        };
    }

    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady();
    }

    render() {

        return (

            <View>

                <View style={{ marginTop: 16, marginBottom: 32 }}>
                    {this.props.servicio != undefined && (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ flex: 1, textAlign: 'right', marginRight: 8, fontWeight: 'bold' }}>Servicio</Text>
                            <Text style={{ flex: 2 }}>{this.props.servicio.nombre}</Text>
                        </View>
                    )}
                    {this.props.motivo != undefined && (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ flex: 1, textAlign: 'right', marginRight: 8, fontWeight: 'bold' }}>Motivo</Text>
                            <Text style={{ flex: 2 }}>{this.props.motivo.nombre}</Text>
                        </View>
                    )}
                    {this.props.descripcion != undefined && (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ flex: 1, textAlign: 'right', marginRight: 8, fontWeight: 'bold' }}>Descripción</Text>
                            <Text style={{ flex: 2 }}>{this.props.descripcion}</Text>
                        </View>
                    )}
                    {this.props.ubicacion != undefined && (
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ flex: 1, textAlign: 'right', marginRight: 8, fontWeight: 'bold' }}>Ubicación</Text>
                            <View style={{ flex: 2 }}>
                                <Text>Independencia 710</Text>
                                <Text>Piso 13 depto B</Text>
                                <Text>CPC Nº 10 - Central</Text>
                                <Text>Barrio Nueva Cordoba</Text>
                            </View>
                        </View>
                    )}


                </View>

                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    style={{ alignSelf: 'flex-end', backgroundColor: 'green' }}>
                    <Text>Registrar</Text>
                </Button>

            </View >
        );
    }
}