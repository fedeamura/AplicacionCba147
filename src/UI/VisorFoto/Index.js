import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import PhotoView from 'react-native-photo-view';
import LinearGradient from 'react-native-linear-gradient';

//Mis componentes
import MiStatusBar from "@Utils/MiStatusBar";
import MiToolbar from "@Utils/MiToolbar";
import App from "@UI/App";

export default class VisorFoto extends React.Component {

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      source: params.source || { uri: '' }
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

      <MiToolbar
        onBackPress={this.cerrar}
        titulo="Visor de imagenes" />


      <View style={{ width: '100%', height: '100%', flex: 1 }} >

        <PhotoView
          resizeMode={'cover'}
          source={this.state.source}
          minimumZoomScale={1}
          maximumZoomScale={3}
          androidScaleType="center"
          style={{ width: '100%', height: '100%', flex: 1 }} />

        {/* Sombra del toolbar */}
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
          backgroundColor="transparent"
          style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }} />

      </View>

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


