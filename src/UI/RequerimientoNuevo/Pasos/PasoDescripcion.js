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
    Label
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

export default class RequerimientoNuevo_PasoDescripcion extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            descripcion: ''
        };

        this.animScrollY = new Animated.Value(0);
    }

    componentDidMount() {
    }

    informarListo() {
        if (this.props.onDescripcionLista != undefined) {
            this.props.onDescripcionLista(this.state.descripcion);
        }
    }

    render() {
        const opacitySombra = this.animScrollY.interpolate({
            inputRange: [0, 20],
            outputRange: [0, 1]
        });

        // const initData = global.initData.requerimientoNuevo.pasos.servicio;

        return (
            <View style={{ flex: 1 }}>


                <View style={{ flex: 1 }}>
                    <ScrollView
                        scrollEventThrottle={1}
                        contentContainerStyle={{ padding: 16 }}
                    >

                        <Text style={{ fontSize: 32, marginTop: 16, marginBottom: 16 }}>Ingresá una descripcion de tu inconveniente</Text>
                        <Input
                            onChangeText={(text) => {
                                this.setState({ descripcion: text });
                            }}
                            multiline={true}
                            placeholder="Contanos que esta pasando..." style={{ fontSize: 24 }} />
                    </ScrollView>


                    <Button
                        onPress={() => {
                            this.informarListo();
                        }}
                        disabled={this.state.descripcion == ""}
                        style={{ position: 'absolute', right: 16, bottom: 16 }}>
                        <Text>Siguiente</Text>
                    </Button>
                </View>
            </View >
        );
    }
}