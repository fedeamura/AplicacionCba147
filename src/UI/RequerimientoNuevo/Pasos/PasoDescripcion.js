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

    informarDescripcion() {
        if (this.props.onDescripcion == undefined) return;
        this.props.onDescripcion(this.state.descripcion);
    }

    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady();
    }

    render() {
        return (

            <View>
                <View style={{
                    marginTop: 32, marginBottom: 32
                }}>
                    <Textarea
                        onChangeText={(text) => {
                            this.setState({ descripcion: text }, () => {
                                this.informarDescripcion();
                            });
                        }}
                        style={{ fontSize: 22 }}
                        rowSpan={5}
                        placeholder="Contanos que está pasando..." />
                </View>

                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    disabled={this.state.descripcion == undefined || this.state.descripcion.trim() == ""}
                    style={{
                        alignSelf: 'flex-end',
                        backgroundColor: this.state.descripcion == undefined || this.state.descripcion.trim() == "" ? 'rgba(150,150,150,1)' : 'green'
                    }}>
                    <Text>Siguiente</Text>
                </Button>

            </View >
        );
    }
}