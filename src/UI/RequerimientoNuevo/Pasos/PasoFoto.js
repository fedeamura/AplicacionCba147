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
    Dimensions,
    Image
} from "react-native";
import {
    Container,
    Button,
    Text,
    Input,
    ListItem,
    Content,
    Spinner,
    CardItem
} from "native-base";
import { Card, CardContent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_PasoFoto extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            error: undefined,
            cargando: false,
            foto: undefined
        };
    }

    agregarFoto() {
        var options = {
            title: 'Elegir foto'
        };

        this.setState({
            cargando: true
        }, () => {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    this.setState({
                        cargando: false
                    });
                    return;
                }
                else if (response.error) {
                    this.setState({
                        cargando: false,
                        foto: undefined,
                        error: response.error
                    });
                    return
                }

                ImageResizer.createResizedImage(response.uri, 1000, 1000, 'JPEG', 80).then((response2) => {
                    RNFS.readFile(response2.uri, 'base64')
                        .then(base64 => {
                            let foto = 'data:image/jpeg;base64,' + base64;
                            this.setState({
                                cargando: false,
                                error: undefined,
                                foto: foto
                            }, () => {
                                this.informarFoto();
                            });
                        });

                }).catch((err) => {
                    this.setState({
                        cargando: false,
                        error: error,
                        foto: undefined
                    });
                });
            });

        });

    }

    informarFoto() {
        if (this.props.onFoto == undefined) return;
        this.props.onFoto(this.state.foto);
    }

    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady();
    }

    render() {

        return (

            <View>
                {this.state.cargando && (
                    <Spinner color="green" />
                )}

                {this.state.error != undefined && (
                    <View>
                        <Text>Error</Text>
                        <Text>{this.state.error}</Text>
                    </View>
                )}

                {this.state.cargando == false && this.state.foto == undefined && (
                    <View style={{ padding: 32 }}>
                        <Button
                            bordered
                            onPress={() => { this.agregarFoto(); }}
                            style={{
                                alignSelf: 'center',
                                borderColor: 'green'
                            }}>
                            <Text style={{ color: 'green' }}>Agregar foto</Text>
                        </Button>
                    </View>
                )}
                {this.state.foto != undefined && (
                    <View>
                        <View style={{ marginTop: 16, marginBottom: 32 }}>

                            <Image
                                resizeMode="cover"
                                style={{ width: 156, height: 156, alignSelf: 'center' }}
                                source={{ uri: this.state.foto }}
                            />


                            <Button
                                danger
                                small
                                style={{ alignSelf: 'center', marginTop: 8 }}
                                onPress={() => {
                                    this.setState({
                                        foto: undefined
                                    }, () => {
                                        this.informarFoto();
                                    });
                                }}>
                                <Text>Cancelar foto</Text>
                            </Button>
                        </View>
                    </View>

                )}
                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    style={{
                        alignSelf: 'flex-end',
                        backgroundColor: 'green'
                    }}>
                    <Text>Siguiente</Text>
                </Button>
            </View >
        );
    }
}