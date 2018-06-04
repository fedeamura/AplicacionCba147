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

                <View style={{ padding: 32 }}>
                    <Text>Detalle del rq</Text>
                </View>

                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    style={{ alignSelf: 'flex-end' }}>
                    <Text>Registrar</Text>
                </Button>

            </View >
        );
    }
}