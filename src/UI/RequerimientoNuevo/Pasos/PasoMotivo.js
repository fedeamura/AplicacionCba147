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
    Spinner
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import color from "color";

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
            seleccionado: undefined,
            anims: undefined,
            animMotivoNoPrincipal: new Animated.Value(0)
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
            //Animo
            if (this.state.anims != undefined && this.state.anims.length != 0) {
                let anims = [];
                for (var id in this.state.anims) {
                    if (this.state.anims.hasOwnProperty(id)) {
                        anims.push(Animated.timing(this.state.anims[id], { toValue: id != motivo.id ? 0 : 1, duration: 300 }))
                    }
                }

                //Anim no principal
                anims.push(Animated.timing(this.state.animMotivoNoPrincipal, { toValue: motivo.principal ? 0 : 1, duration: 300 }));

                Animated.parallel(anims).start();
            }

            //Informo
            this.informarMotivo();
        });
    }

    deseleccionar() {
        this.setState({
            seleccionado: undefined
        }, () => {
            //Animo
            if (this.state.anims != undefined && this.state.anims.length != 0) {
                let anims = [];
                for (var id in this.state.anims) {
                    if (this.state.anims.hasOwnProperty(id)) {
                        anims.push(Animated.timing(this.state.anims[id], { toValue: 0, duration: 300 }))
                    }
                }

                //Anim no principal
                anims.push(Animated.timing(this.state.animMotivoNoPrincipal, { toValue: 0, duration: 300 }));

                Animated.parallel(anims).start();
            }

            //Informo
            this.informarMotivo();
        });
    }

    informarMotivo() {
        if (this.props.onMotivo == undefined) return;
        this.props.onMotivo(this.state.seleccionado);
    }

    informarReady() {
        if (this.props.onReady == undefined) return;
        this.props.onReady();
    }

    render() {
        if (this.state.servicio == undefined) return null;
        if (this.state.cargando || this.state.motivos == undefined) {
            return <Spinner color="green"></Spinner>;
        }

        const motivosPrincipales = [];
        let hayMasMotivos = false;
        for (let i = 0; i < this.state.motivos.length; i++) {
            let motivo = this.state.motivos[i];
            if (motivo.principal) {
                motivosPrincipales.push(motivo);
            } else {
                hayMasMotivos = true;
            }
        }

        const viewPrincipales = motivosPrincipales.map((motivo) => {
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
                        icono={motivo.icono || 'flash'}
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


        return (

            <View style={{ marginTop: 32 }}>

                <Animated.View
                    style={{
                        overflow: 'hidden',
                        opacity: this.state.seleccionado == undefined ? 0 : this.state.animMotivoNoPrincipal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        }),
                        maxHeight: this.state.seleccionado == undefined ? 0 : this.state.animMotivoNoPrincipal.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1000]
                        })
                    }}
                >
                    <CardServicio
                        key={this.state.seleccionado == undefined ? -1 : this.state.seleccionado.id}
                        icono={this.state.seleccionado == undefined ? '' : (this.state.seleccionado.icono || 'flash')}
                        texto={this.state.seleccionado == undefined ? '' : this.state.seleccionado.nombre}
                        textoLines={2}
                        style={{ marginBottom: 16 }}
                        iconoStyle={{ fontSize: 48, color: 'white' }}
                        cardColor={'green'}
                        cardStyle={{ width: 72, height: 72, margin: 8, borderRadius: 200 }}
                        textoStyle={{ fontSize: 16, maxWidth: 100, minWidth: 100, minHeight: 40, maxHeight: 40 }}
                    />
                </Animated.View>

                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 32,
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>

                    {viewPrincipales}

                    {hayMasMotivos && (
                        <Button
                            bordered
                            onPress={() => {
                                App.navegar('PickerListado', {
                                    busqueda: true,
                                    cumpleBusqueda: (item, texto) => {
                                        return item.nombre.toLowerCase().indexOf(texto.toLowerCase()) != -1;
                                    },
                                    data: this.state.motivos,
                                    title: (item) => { return item.nombre },
                                    onPress: (item) => {
                                        this.seleccionar(item);
                                    }
                                })
                            }}
                            style={{
                                borderColor: 'green'
                            }}>
                            <Text style={{ color: 'green' }}>Ver todos los motivos</Text>
                        </Button>
                    )}
                </View>
                <Button
                    onPress={() => {
                        this.informarReady();
                    }}
                    rounded
                    disabled={this.state.seleccionado == undefined}
                    style={{
                        alignSelf: 'flex-end',
                        backgroundColor: this.state.seleccionado == undefined ? 'rgba(150,150,150,1)' : 'green'
                    }}>
                    <Text>Siguiente</Text>
                </Button>

            </View >
        );
    }
}