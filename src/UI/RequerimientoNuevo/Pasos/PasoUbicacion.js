import React from "react";
import {
    View
} from "react-native";
import {
    Button,
    Text,
} from "native-base";
import WebImage from 'react-native-web-image'
import LinearGradient from 'react-native-linear-gradient';
import autobind from 'autobind-decorator'

//Mis componentes
import App from "@UI/App";
import MiView from "@Utils/MiView";

export default class RequerimientoNuevo_PasoUbicacion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ubicacion: undefined,
            viewSeleccionarVisible: true,
            viewSeleccionadoVisible: false
        };
    }

    static defaultProps = {
        ...React.Component.defaultProps,
        onReady: function () { },
        onUbicacion: function () { }
    }

    @autobind
    onUbicacion(ubicacion) {
        this.setState({ ubicacion: ubicacion, viewSeleccionarVisible: false },
            function () {
                this.informarUbicacion();

                setTimeout(function () {
                    this.setState({ viewSeleccionadoVisible: true });
                }.bind(this), 300);
            });
    }

    @autobind
    cancelarUbicacion() {
        this.setState({ ubicacion: undefined, viewSeleccionadoVisible: false },
            function () {
                this.informarUbicacion();

                setTimeout(function () {
                    this.setState({ viewSeleccionarVisible: true });
                }.bind(this), 300);
            });
    }

    @autobind
    seleccionarUbicacion() {
        App.navegar('PickerUbicacion', {
            onUbicacionSeleccionada: this.onUbicacion
        });
    }

    @autobind
    informarUbicacion() {
        this.props.onUbicacion(this.state.ubicacion);
    }

    @autobind
    informarReady() {
        this.props.onReady();
    }

    render() {
        return (
            <View style={{ minHeight: 100 }}>
                {this.renderViewSeleccionar()}
                {this.renderViewSeleccionado()}
            </View >
        );
    }

    renderViewSeleccionar() {
        return <MiView visible={this.state.viewSeleccionarVisible}>
            <Button
                bordered
                small
                onPress={this.seleccionarUbicacion}
                style={{
                    borderColor: 'green',
                    alignSelf: 'center',
                    margin: 32
                }}>
                <Text style={{ color: 'green' }}>Seleccionar ubicacion</Text>
            </Button>
        </MiView>;
    }

    renderViewSeleccionado() {
        return <MiView visible={this.state.viewSeleccionadoVisible}>
            <View>
                <View>
                    <WebImage
                        resizeMode='cover'
                        style={{
                            width: '100%', height: 256
                        }}
                        source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=cordoba+argentina&zoom=13&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7Ccordoba+argentina' }}></WebImage>

                    <View style={{ position: 'absolute', backgroundColor: 'transparent', bottom: 0, left: 0, right: 0 }}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)']}
                            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}></LinearGradient>
                        <View style={{ padding: 16 }}>
                            <Text>27 de Abril 464, Córdoba, Argentina</Text>
                            <Text>13º B</Text>
                            <Text>CPC: Nº 10 - Central</Text>
                            <Text>Barrio: Nueva córdoba</Text>
                        </View>

                    </View>

                </View>

                <View style={{ height: 16 }} />

                <Button
                    small
                    bordered
                    onPress={this.cancelarUbicacion}
                    style={{ alignSelf: 'center', borderColor: '#D32F2F' }}>
                    <Text style={{ color: '#D32F2F' }}>Cancelar ubicacion</Text>
                </Button>
            </View>

            <View style={{ height: 16 }} />
            <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }} />

            <View style={{ padding: 16 }}>
                <Button
                    small
                    onPress={this.informarReady}
                    rounded
                    bordered
                    style={{
                        alignSelf: 'flex-end',
                        borderColor: 'green'
                    }}><Text
                        style={{
                            color: 'green'
                        }}
                    >Siguiente</Text></Button>
            </View>

        </MiView>;
    }
}