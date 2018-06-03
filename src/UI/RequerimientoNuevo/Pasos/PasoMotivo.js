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

//Anims
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

//Mis componentes
import App from "@UI/App";
import CardServicio from "@Utils/Servicio/CardItem";
import MiListado from "@Utils/MiListado";

import Rules_Motivo from "@Rules/Rules_Motivo";

export default class RequerimientoNuevo_PasoMotivo extends React.Component {


    constructor(props) {
        super(props);



        this.state = {
            cargando: false,
            error: undefined,
            servicio: props.servicio,
            motivos: undefined,
            seleccionado: undefined
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.servicio == undefined) {
            this.setState({
                servicio: undefined,
                seleccionado: undefined,
                motivos: undefined,
                cargando: false
            });
        } else {
            if (this.state.servicio == undefined || (this.state.servicio.id != nextProps.servicio.id))
                this.setState({
                    motivo: undefined,
                    seleccionado: undefined,
                    cargando: false,
                    servicio: nextProps.servicio
                }, () => {
                    this.buscarMotivos();
                });
        }
    }


    buscarMotivos() {
        this.setState({
            motivos: undefined,
            cargando: true,
            error: undefined
        }, () => {
            Rules_Motivo.get(this.state.servicio.id)
                .then((motivos) => {

                    let anims = {};
                    for (let i = 0; i < motivos.length; i++) {
                        anims[motivos[i].id] = new Animated.Value(0);
                    }
                    this.setState({
                        anims: anims,
                        cargando: false,
                        error: undefined,
                        motivos: motivos
                    });

                }).catch((error) => {
                    this.setState({
                        error: error,
                        motivos: undefined
                    });
                });
        })
    }

    seleccionar(motivo) {
        this.setState({
            seleccionado: motivo
        }, () => {
            if (this.state.anims != undefined && this.state.anims.length != 0) {
                let anims = [];
                for (var id in this.state.anims) {
                    if (this.state.anims.hasOwnProperty(id)) {
                        anims.push(Animated.timing(this.state.anims[id], { toValue: id != motivo.id ? 0 : 1, duration: 300 }))
                    }
                }
                Animated.parallel(anims).start();
            }
        });
    }

    deseleccionar() {
        this.setState({
            seleccionado: undefined
        }, () => {
            if (this.state.anims != undefined && this.state.anims.length != 0) {
                let anims = [];
                for (var id in this.state.anims) {
                    if (this.state.anims.hasOwnProperty(id)) {
                        anims.push(Animated.timing(this.state.anims[id], { toValue: 0, duration: 300 }))
                    }
                }
                Animated.parallel(anims).start();
            }
        });
    }

    informarSeleccion() {
        if (this.props.onSeleccion != undefined) {
            this.props.onSeleccion(this.state.seleccionado);
        }
    }
    render() {
        if (this.state.servicio == undefined) return null;
        if (this.state.cargando || this.state.motivos == undefined) {
            return <Text>Cargando motivos...</Text>;
        }


        const viewPrincipales = this.state.motivos.map((motivo) => {
            let seleccionado = this.state.seleccionado != undefined && this.state.seleccionado.id == motivo.id;
            let backgroundColor = seleccionado ? 'green' : 'white';
            let iconColor = seleccionado ? 'white' : 'black';
            let w = 72;
            let margin = 8;

            let anim = this.state.anims[motivo.id];

            return (
                <Animated.View style={{
                    transform: [
                        {
                            scale: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.2]
                            })
                        }
                    ]
                }}>
                    <CardServicio
                        key={motivo.id}
                        onPress={() => {
                            this.seleccionar(motivo);
                        }}
                        icono={"flash"}
                        texto={motivo.nombre}
                        textoLines={2}
                        style={{ marginBottom: 16 }}
                        iconoStyle={{ fontSize: 48, color: iconColor }}
                        cardColor={backgroundColor}
                        cardStyle={{ width: w, height: w, margin: margin, borderRadius: 200 }}
                        textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                    />
                </Animated.View>
            );

        });


        let seleccionadoEnPrincipales = false;
        if (this.state.seleccionado != undefined) {
            for (let i = 0; i < this.state.motivos.length; i++) {
                let motivo = this.state.motivos[i];
                if (motivo.principal && motivo.id == this.state.seleccionado.id) {
                    seleccionadoEnPrincipales = true;
                }
            }
        }
        return (

            <View>

                {this.state.seleccionado != undefined && seleccionadoEnPrincipales == false && (
                    <CardServicio
                        key={this.state.seleccionado.id}
                        icono={this.state.seleccionado.icono || 'flash'}
                        texto={this.state.seleccionado.nombre}
                        textoLines={2}
                        style={{ marginBottom: 16 }}
                        iconoStyle={{ fontSize: 48 }}
                        cardStyle={{ width: 72, height: 72, margin: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                    />
                )}


                <View
                    style={{
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>


                    {viewPrincipales}


                </View>
                <Button
                    onPress={() => {
                        this.informarSeleccion();
                    }}
                    rounded
                    disabled={this.state.seleccionado == undefined} style={{ alignSelf: 'flex-end', marginRight: 32 }}><Text>Siguiente</Text></Button>

            </View >
        );
    }
}