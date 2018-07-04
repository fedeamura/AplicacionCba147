import React from "react";
import {
    View,
    Image,
    Alert,
    TouchableOpacity
} from "react-native";
import {
    Button,
    Text,
    Spinner
} from "native-base";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";

export default class RequerimientoNuevo_PasoFoto extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cargando: false,
            foto: undefined,
            viewSeleccionarVisible: true,
            viewSeleccionadoVisible: false
        };
    }

    static defaultProps = {
        ...React.Component.defaultProps,
        onReady: () => { },
        onFoto: () => { },
        onCargando: () => { }
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state.cargando != prevState.cargando) {
            this.props.onCargando(prevState.cargando);
        }
    }

    agregarFoto = () => {
        Alert.alert('', 'Agregar foto', [
            { text: 'Galeria', onPress: this.agregarFotoDesdeGaleria },
            { text: 'Cámara', onPress: this.agregarFotoDesdeCamara }
        ]);
    }

    agregarFotoDesdeCamara = () => {
        var options = {
            title: 'Elegir foto'
        };

        this.setState({
            cargando: true
        }, () => {
            // Mando a buscar la foto
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    this.setState({
                        cargando: false
                    });
                    return;
                }
                else if (response.error) {
                    this.setState({
                        cargando: false,
                        foto: undefined
                    });

                    Alert.alert('', 'Error procesando la solicitud. Error: ' + response.error);
                    return
                }


                this.procesarImagen(response.uri);
            });

        });
    }



    agregarFotoDesdeGaleria = () => {
        var options = {
            title: 'Elegir foto'
        };

        this.setState({
            cargando: true
        }, () => {
            // Mando a buscar la foto
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
                        foto: undefined
                    });

                    Alert.alert('', 'Error procesando la solicitud');
                    return
                }

                this.procesarImagen(response.uri);
            });

        });

    }

    procesarImagen = (img) => {
        // Achico la imagen
        ImageResizer.createResizedImage(img, 1000, 1000, 'JPEG', 80)
            .then((response2) => {
                // Convierto la imagen a base64
                RNFS.readFile(response2.uri, 'base64')
                    .then(base64 => {
                        let foto = 'data:image/jpeg;base64,' + base64;
                        this.setState({
                            cargando: false,
                            foto: foto
                        }, this.informarFoto);
                    }).catch(() => {
                        Alert.alert('', 'Error procesando la solicitud');
                        this.setState({
                            cargando: false,
                            foto: undefined
                        });
                    });
            })
            .catch((err) => {
                Alert.alert('', 'Error procesando la solicitud');
                this.setState({
                    cargando: false,
                    foto: undefined
                });
            });
    }


    cancelarFoto = () => {
        this.setState({ viewSeleccionadoVisible: false }, () => {
            setTimeout(() => {
                this.setState({ foto: undefined, viewSeleccionarVisible: true }, () => {
                    this.props.onFoto(undefined);
                });
            }, 300);
        })
    }

    informarFoto = () => {
        this.setState({ viewSeleccionarVisible: false }, () => {
            setTimeout(() => {
                this.setState({ viewSeleccionadoVisible: true });
            }, 300);
        });

        this.props.onFoto(this.state.foto);
    }

    informarReady = () => {
        this.props.onReady();
    }

    abrirImagen = () => {
        App.navegar('VisorFoto', {
            source: { uri: this.state.foto }
        });
    }

    render() {
        return (
            <View>

                <View style={{ minHeight: 100 }}>
                    {this.renderViewSeleccionar()}
                    {this.renderViewSeleccionado()}
                </View>

                <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} />

                <View style={{ padding: 16 }}>
                    <Button
                        onPress={this.informarReady}
                        rounded
                        small
                        bordered
                        style={{
                            alignSelf: 'flex-end',
                            borderColor: 'green'
                        }}>
                        <Text style={{ color: 'green' }}>Siguiente</Text>
                    </Button>
                </View>

            </View >
        );
    }

    renderViewSeleccionar() {
        return <MiView visible={this.state.viewSeleccionarVisible}>
            <View style={{ padding: 16 }}>
                <Button
                    bordered
                    small
                    onPress={this.agregarFoto}
                    style={{
                        alignSelf: 'center',
                        borderColor: 'green'
                    }}>
                    <Text style={{ color: 'green' }}>Agregar foto</Text>
                </Button>
            </View>

        </MiView>;
    }

    renderViewSeleccionado() {
        return <MiView visible={this.state.viewSeleccionadoVisible}>
            <View style={{ padding: 16 }}>

                <View style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <TouchableOpacity onPress={this.abrirImagen}>
                        <Image
                            resizeMode="cover"
                            style={{ width: 156, height: 156, alignSelf: 'center', borderRadius: 16, overflow: 'hidden' }}
                            source={{ uri: this.state.foto }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 16 }} />

                <Button
                    bordered
                    small
                    style={{ alignSelf: 'center', borderColor: '#D32F2F' }}
                    onPress={this.cancelarFoto}>
                    <Text style={{ color: '#D32F2F' }}>Cancelar foto</Text>
                </Button>
            </View>

        </MiView >;
    }
}