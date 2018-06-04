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
// import ImagePicker from 'react-native-image-picker';

// import ImagePicker from 'react-native-image-crop-picker';

//Mis componentes
import App from "@UI/App";

export default class RequerimientoNuevo_PasoFoto extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            error: undefined,
            foto: undefined
        };
    }

    agregarFoto() {
        // var options = {
        //     title: 'Select Avatar',
        //     customButtons: [
        //         { name: 'fb', title: 'Choose Photo from Facebook' },
        //     ],
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images'
        //     }
        // };

        // Alert.alert('', 'test');
        // ImagePicker.showImagePicker(options, (response) => {
        //     if (response.didCancel) {
        //         return;
        //     }
        //     else if (response.error) {
        //         this.setState({
        //             error: error
        //         });
        //         return
        //     }
        //     this.setState({
        //         foto: response.data
        //     });
        // });
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
                {this.state.foto == undefined && (
                    <View style={{ padding: 32 }}>

                        <Text>{this.state.error}</Text>
                        <Button
                            onPress={() => { this.agregarFoto(); }}
                            style={{ alignSelf: 'center' }}>
                            <Text>Agregar foto</Text>
                        </Button>
                    </View>

                )}
                {this.state.foto != undefined && (
                    <Button
                        onPress={() => {
                            this.informarSeleccion();
                        }}
                        rounded
                        style={{ alignSelf: 'flex-end' }}>
                        <Text>Siguiente</Text>
                    </Button>

                )}

            </View >
        );
    }
}