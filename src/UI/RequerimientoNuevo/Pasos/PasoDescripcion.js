import React, { Component } from "react";
import {
    View,
} from "react-native";
import {
    Button,
    Text,
    Textarea,
} from "native-base";
import autobind from 'autobind-decorator'


export default class RequerimientoNuevo_PasoDescripcion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            descripcion: ""
        };
    }

    @autobind
    onDescripcionChange(text) {
        this.setState({ descripcion: text }, function () {
            this.informarDescripcion();
        });
    }

    @autobind
    informarDescripcion() {
        if (this.props.onDescripcion == undefined) return;
        this.props.onDescripcion(this.state.descripcion);
    }

    @autobind
    informarReady() {
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