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

    onDescripcionChange = (text) => {
        this.setState({ descripcion: text }, () => {
            this.informarDescripcion();
        });
    }

    informarDescripcion = () => {
        if (this.props.onDescripcion == undefined) return;
        this.props.onDescripcion(this.state.descripcion);
    }

    informarReady = () => {
        if (this.props.onReady == undefined) return;
        this.props.onReady();
    }

    render() {
        const botonSiguienteDeshabilitado = this.state.descripcion == undefined || this.state.descripcion.trim() == "";

        return (
            <View>
                <View style={{
                    padding: 16
                }}>
                    <Textarea
                        onChangeText={this.onDescripcionChange}
                        style={{ fontSize: 18 }}
                        rowSpan={5}
                        placeholder="Contanos que está pasando..." />
                </View>

                <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} />

                {/* Boton siguiente  */}
                <View style={{ padding: 16 }}>
                    <Button
                        small
                        onPress={this.informarReady}
                        rounded
                        bordered
                        disabled={botonSiguienteDeshabilitado}
                        style={{
                            alignSelf: 'flex-end',
                            borderColor: botonSiguienteDeshabilitado ? 'rgba(150,150,150,1)' : 'green'
                        }}>
                        <Text
                            style={{
                                color: botonSiguienteDeshabilitado ? 'rgba(150,150,150,1)' : 'green'
                            }}
                        >Siguiente</Text>
                    </Button>
                </View>

            </View >
        );
    }
}