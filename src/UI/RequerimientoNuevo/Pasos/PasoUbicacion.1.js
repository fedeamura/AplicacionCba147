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
    Content
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_PasoUbicacion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posicion: {
                latitude: -31.420011,
                longitude: -64.188738,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
        };

    }

    componentDidMount() {
    }

    onRegionChange(region) {
        this.setState({ posicion: region });
    }

    informarSeleccion(posicion) {
        if (this.props.onUbicacion == undefined) return;
        this.props.onUbicacion({});
    }
    
    render() {

        // const initData = global.initData.requerimientoNuevo.pasos.servicio;

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    showsUserLocation={true}
                    onPress={(e) => {
                        this.informarSeleccion();
                    }}
                    region={this.state.posicion}
                    onRegionChange={(region) => { this.onRegionChange(region) }}
                >
                    {this.state.marcador != undefined && (
                        <Marker draggable
                            onDragEnd={(e) => {
                                this.onMapaClick(e.nativeEvent.coordinate);
                            }}
                            coordinate={this.state.marcador}
                            title="Ubicacion seleccionada"
                        />
                    )}
                </MapView>
            </View >
        );
    }
}