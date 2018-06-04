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
import { Card, CardContent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_PasoUbicacion extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            ubicacion: undefined
        };
    }

    informarUbicacion() {
        if (this.props.onUbicacion != undefined) {
            this.props.onUbicacion(this.state.ubicacion);
        }
    }

    informarReady() {
        if (this.props.onReady != undefined) {
            this.props.onReady();
        }
    }

    render() {
        return (

            <View>
                {this.state.ubicacion == undefined && (
                    <Button
                        onPress={() => {
                            App.navegar('PickerUbicacion', {
                                onUbicacionSeleccionada: (data) => {
                                    this.setState({ ubicacion: data }, () => {
                                        this.informarUbicacion();
                                    });
                                }
                            });
                        }}
                        style={{ alignSelf: 'center', margin: 32 }}><Text>Seleccionar ubicacion</Text></Button>
                )}

                {this.state.ubicacion != undefined && (
                    <View>
                        <Card style={{ alignSelf: 'center', height: 256, width: '100%', padding: 0, marginTop: 32 }}>
                            <WebImage
                                resizeMode='cover'
                                style={{
                                    width: '100%', height: '100%'
                                }}
                                source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=cordoba+argentina&zoom=13&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7Ccordoba+argentina' }}></WebImage>

                            <View style={{ position: 'absolute', backgroundColor: 'transparent', bottom: 0, left: 0, right: 0 }}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.8)','rgba(255,255,255,0.8)']}
                                    style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}></LinearGradient>
                                <View style={{ padding: 8 }}>

                                    <Text>Direccion: 27 de Abril 464, Córdoba, Argentina</Text>
                                    <Text>Descripcioón: 13º B</Text>
                                    <Text>CPC: Nº 10 - Central</Text>
                                    <Text>Barrio: Nueva córdoba</Text>
                                </View>

                            </View>
                        </Card>
                        <Button
                            small
                            danger
                            onPress={() => {
                                this.setState({
                                    ubicacion: undefined
                                }, () => {
                                    this.informarUbicacion();
                                });
                            }}
                            style={{alignSelf:'center', marginTop:8}}>
                            <Text style={{ color: 'white' }}>Cancelar ubicacion</Text>
                        </Button>



                        <Button
                            onPress={() => {
                                this.informarReady();
                            }}
                            rounded
                            disabled={this.state.ubicacion == undefined}
                            style={{
                                alignSelf: 'flex-end',
                                marginTop: 32
                            }}
                        ><Text>Siguiente</Text></Button>
                    </View>

                )}

            </View >
        );
    }
}