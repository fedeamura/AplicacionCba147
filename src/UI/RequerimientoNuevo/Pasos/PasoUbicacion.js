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

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_PasoUbicacion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    componentDidMount() {
    }

    render() {

        // const initData = global.initData.requerimientoNuevo.pasos.servicio;

        return (
            <View style={{ flex: 1 }}>
                <Text>Ubicacion</Text>
                <Button
                    onPress={() => {
                        this.props.onSiguiente();
                    }}
                ><Text>Siguiente</Text></Button>
            </View >
        );
    }
}