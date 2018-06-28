import React from "react";
import {
    View,
    Animated,
    Alert,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Button,
    Text,
} from "native-base";
import { FAB } from 'react-native-paper';
import WebImage from 'react-native-web-image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//Mis componentes
import App from "@UI/App";
import MiListado from "@Utils/MiListado";
import ItemRequerimiento from "@Utils/Requerimiento/CardItem";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Requerimiento from "@Rules/Rules_Requerimiento";

const url_Imagen_Error = "https://res.cloudinary.com/dtwwgntjc/image/upload/v1526679157/0_plpdmd.png"
const texto_Error_Consultado = 'Oops... Algo salió mal al consultar sus requerimientos';
const texto_Boton_Reintentar = 'Reintentar';
const url_Imagen_Empty = "https://res.cloudinary.com/dtwwgntjc/image/upload/v1526679157/0_plpdmd.png";
const texto_Empty = "No registraste ningún requerimiento aún..."
const texto_Boton_Empty = 'Registrar uno';

export default class PaginaInicio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertaUsuarioNoValidadoVisible: false,
            cargando: true,
            error: undefined,
            requerimientos: []
        };

        this.animBoton = new Animated.Value(0);
        this.animAlertaUsuarioNoValidado = new Animated.Value(0);
    }

    componentDidMount() {

        // BackHandler.addEventListener('hardwareBackPress', () => {
        //   if (this.state.cargando == true) return true;
        // });
    }

    mostrarBotonNuevo = () => {
        Animated.timing(this.animBoton, {
            toValue: 1,
            duration: 300
        }).start();
    }

    ocultarBotonNuevo = () => {
        Animated.timing(this.animBoton, {
            toValue: 0,
            duration: 300
        }).start();
    }

    buscarRequerimientos = () => {
        this.setState({
            cargando: true
        }, () => {
            this.ocultarBotonNuevo();

            Rules_Requerimiento.get()
                .then((requerimientos) => {

                    this.setState({
                        cargando: false,
                        error: undefined,
                        requerimientos: requerimientos
                    }, () => {
                        if (requerimientos.length == 0) {
                            this.ocultarBotonNuevo();
                        } else {
                            this.mostrarBotonNuevo();
                        }
                    });

                    this.consultarUsuarioValidadoRenaper();

                }).catch((error) => {

                    this.setState({
                        cargando: false,
                        requerimientos: [],
                        error: error
                    }, () => {
                        this.ocultarBotonNuevo();
                    });
                })
        });
    }

    consultarUsuarioValidadoRenaper = () => {
        Rules_Usuario.esUsuarioValidadoRenaper().then((validado) => {
            if (!validado) {
                this.mostrarAlertaUsuarioNoValidadoRenaper();
            } else {
                this.ocultarAlertaUsuarioNoValidadoRenaper();
            }
        }).catch((error) => {
            this.ocultarAlertaUsuarioNoValidadoRenaper();
        });
    }

    mostrarAlertaUsuarioNoValidadoRenaper = () => {
        this.setState({ alertaUsuarioNoValidadoVisible: true });
        Animated.timing(this.animAlertaUsuarioNoValidado, { toValue: 1, duration: 500 }).start();
    }

    ocultarAlertaUsuarioNoValidadoRenaper = () => {
        this.setState({ alertaUsuarioNoValidadoVisible: false });
        Animated.timin(this.animAlertaUsuarioNoValidado, { toValue: 0, duration: 500 }).start();
    }

    abrirNuevoRequerimiento = () => {
        App.navegar('RequerimientoNuevo', {
            callback: () => {
                this.buscarRequerimientos();
            },
            verDetalleRequerimiento: (id) => {
                this.buscarRequerimientos();

                this.verDetalleRequerimiento(id);
            }
        });
    }

    verDetalleRequerimiento = (id) => {
        App.navegar('RequerimientoDetalle', { id: id });
    }

    abrirValidarRenaper = () => {

    }

    render() {
        const initData = global.initData;

        return (
            <View
                onLayout={this.buscarRequerimientos}
                style={[styles.contenedor]}>

                {/* ALerta usuario no validado */}
                <TouchableOpacity onPress={this.abrirValidarRenaper}>
                    <Animated.View style={{
                        overflow: 'hidden',
                        backgroundColor: '#E53935',
                        opacity: this.animAlertaUsuarioNoValidado,
                        maxHeight: this.animAlertaUsuarioNoValidado.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 100]
                        })
                    }}>
                        <View style={{
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'row',
                            paddingLeft: 27,
                            paddingRight: 27
                        }}>
                            <View>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Su usuario no se encuentra validado por el registro nacional de las personas.</Text>
                                <Text style={{ color: 'white', fontSize: 16 }}>Haga click aquí para validarlo</Text>
                            </View>

                        </View>

                    </Animated.View>
                </TouchableOpacity>

                <MiListado
                    backgroundColor={initData.backgroundColor}
                    style={[styles.listado]}
                    keyExtractor={(item) => { return item.id }}
                    onRefresh={this.buscarRequerimientos}
                    refreshing={this.state.cargando}
                    error={this.state.cargando == false && this.state.error != undefined}
                    data={this.state.requerimientos}
                    //Item
                    renderItem={(item) => {
                        return <ItemRequerimiento
                            onPress={this.verDetalleRequerimiento}
                            numero={item.item.numero}
                            año={item.item.año}
                            estadoColor={item.item.estadoColor}
                            estadoNombre={item.item.estadoNombre}
                            fechaAlta={item.item.fechaAlta}
                        />;
                    }}
                    // Empty
                    renderEmpty={() => {
                        return <View style={styles.contenedor_Empty} >
                            <WebImage
                                resizeMode="cover"
                                style={styles.imagen_Empty}
                                source={{ uri: url_Imagen_Empty }}
                            />

                            <Text style={styles.texto_Empty}>{texto_Empty}</Text>

                            <Button
                                rounded={true}
                                style={styles.boton_Empty}
                                onPress={this.abrirNuevoRequerimiento}>
                                <Text style={styles.boton_EmptyTexto}>{texto_Boton_Empty}
                                </Text>
                            </Button>
                        </View>
                    }}
                    // Error
                    renderError={() => {
                        return <View style={styles.contenedor_Error} >
                            <WebImage
                                resizeMode="cover"
                                style={styles.imagen_Error}
                                source={{ uri: url_Imagen_Error }}
                            />

                            <Text style={styles.texto_Error}>{texto_Error_Consultado}</Text>
                            <Text style={styles.texto_ErrorDetalle}>{this.state.error}</Text>

                            <Button
                                rounded={true}
                                style={styles.boton_Error}
                                onPress={this.buscarRequerimientos}>
                                <Text style={styles.boton_ErrorTexto}>{texto_Boton_Reintentar}</Text>
                            </Button>
                        </View>
                    }}

                />

                {/* Boton nuevo requerimiento */}
                <Animated.View
                    pointerEvents={this.state.cargando == true || this.state.error != undefined || this.state.requerimientos == undefined || this.state.requerimientos.length == 0 ? 'none' : 'auto'}
                    style={{
                        position: 'absolute',
                        right: 0,
                        padding: 24,
                        bottom: 0,
                        opacity: this.animBoton.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1]
                        }),
                        transform: [
                            {
                                scale: this.animBoton
                            }
                        ]
                    }}
                >

                    <FAB
                        icon="add"
                        style={{ backgroundColor: 'green' }}
                        color="white"
                        onPress={this.abrirNuevoRequerimiento} />



                </Animated.View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    contenedor: {
        width: '100%',
        height: '100%'
    },
    listado: {
        padding: 16,
        paddingBottom: 104
    },
    btnNuevo: {
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        backgroundColor: "green",
        shadowColor: 'green',
        shadowRadius: 5,
        shadowOpacity: 0.4,
        backgroundColor: 'green',
        shadowOffset: { width: 0, height: 7 }
    },
    botoNuevoTexto: {
        color: 'white'
    },
    //Error
    contenedor_Error: {
        position: "absolute",
        backgroundColor: "rgba(230,230,230,1)",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    imagen_Error: {
        backgroundColor: "transparent",
        width: 250,
        height: 250
    },
    texto_Error: {
        maxWidth: 300,
        fontSize: 20,
        color: "black",
        textAlign: "center",
        marginTop: 16,
        marginLeft: 0,
        marginRight: 0
    },
    texto_ErrorDetalle: {
        maxWidth: 300,
        fontSize: 16,
        color: "black",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0
    },
    boton_Error: {
        backgroundColor: "green",
        alignSelf: "center",
        shadowColor: 'green',
        shadowRadius: 5,
        shadowOpacity: 0.4,
        backgroundColor: 'green',
        shadowOffset: { width: 0, height: 7 }
    },
    boton_ErrorTexto: {
        color: 'white'
    },
    //Empty
    contenedor_Empty: {
        position: "absolute",
        backgroundColor: "rgba(230,230,230,1)",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    imagen_Empty: {
        backgroundColor: "transparent",
        width: 250,
        height: 250
    },
    texto_Empty: {
        maxWidth: 300,
        fontSize: 20,
        color: "black",
        textAlign: "center",
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0
    },
    boton_Empty: {
        backgroundColor: "green",
        alignSelf: "center",
        shadowColor: 'green',
        shadowRadius: 5,
        shadowOpacity: 0.4,
        backgroundColor: 'green',
        shadowOffset: { width: 0, height: 7 }
    },
    boton_Empty_Texto: {
        color: 'white'
    },
})