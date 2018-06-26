import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import PhotoView from 'react-native-photo-view';

//Mis componentes
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import App from "@UI/App";

export default class VisorFoto extends React.Component {

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      url: params.url || ''
    };
  }

  componentWillMount() {

  }

  cerrar = () => {
    App.goBack();
  }

  render() {
    return <View
      style={[style.contenedor]}>

      <MiStatusBar />

      <PhotoView
        source={{ uri: this.state.url || '' }}
        minimumZoomScale={0.5}
        maximumZoomScale={3}
        androidScaleType="center"
        style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />

      <MiToolbar
        onBackPress={this.cerrar}
        titulo="Visor de imagenes" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />

    </View >;
  }
}

const style = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    zIndex: 200,
    backgroundColor: 'black',
    top: 0
  }
});


