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
    Item,
    Input,
    Textarea,
    Label,
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

export default class RequerimientoNuevo_PasoDescripcion extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            descripcion: ""
        };
    }

    informarSeleccion() {
        if (this.props.onReady != undefined) {
            this.props.onReady(this.state.descripcion);
        }
    }

    render() {
        return (

            <View>

                <View style={{ margin: 32 }}>
                    <Textarea
                        onChangeText={(text) => { this.setState({ descripcion: text }) }}
                        style={{ fontSize: 22 }} rowSpan={5} placeholder="Contanos que está pasando..." />

                </View>

                <Button
                    onPress={() => {
                        this.informarSeleccion();
                    }}
                    rounded
                    disabled={this.state.descripcion == undefined || this.state.descripcion.trim() == ""} style={{ alignSelf: 'flex-end', marginRight: 32 }}><Text>Siguiente</Text></Button>

            </View >
        );
    }
}