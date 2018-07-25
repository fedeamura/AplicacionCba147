import React from "react";
import {
  View,
  Animated
} from "react-native";
import Gallery from 'react-native-image-gallery';
import WebImage from 'react-native-web-image'

//Mis componentes
import MiToolbar from "@Utils/MiToolbar";

export default class MiGaleria extends React.Component {

  static defaultProps = {
    ...React.Component.defaultProps,
    urls: [],
    visible: false,
    index: 0,
    onClose: () => { }
  }

  constructor(props) {
    super(props);
    this.state = {
      mostrar: props.visible
    };

    this.anim = new Animated.Value(props.visible == true ? 1 : 0);

    if (props.visible == true) {
      this.mostrar();
    } else {
      this.ocultar();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible == this.props.visible) return;

    if (nextProps.visible == true) {
      this.mostrar();
    } else {
      this.ocultar();
    }
  }

  mostrar = () => {
    this.setState({ mostrar: true }, () => {
      Animated.timing(this.anim, { toValue: 1, duration: 300 }).start();
    });

  }

  ocultar = () => {
    Animated.timing(this.anim, { toValue: 0, duration: 300 }).start((() => {
      this.setState({ mostrar: false });
      this.props.onClose();
    }));
  }

  render() {

    const urls = this.props.urls.map((url) => {
      return { source: { uri: url } }
    });

    // if (this.props.visible != true) return null;

    return (



      <View
        pointerEvents={this.props.visible ? 'auto' : 'none'}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>

        {/* Galeria */}
        <Animated.View
          style={{
            zIndex: 10,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: this.anim,
            transform: [
              { scale: this.anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }
            ]
          }}
        >
          {this.state.mostrar == true && (
            <Gallery
              resizeMethod="resize"
              imageComponent={(data) => {
                return <WebImage
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                  source={data.image.source}
                />
              }}
              style={{ flex: 1 }}
              initialPage={this.props.index}
              images={urls}
            />
          )}

        </Animated.View>

        {/* Fondo */}
        <Animated.View
          style={{
            zIndex: 1,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            opacity: this.anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
          }} ></Animated.View>

        <Animated.View style={{ zIndex: 20, opacity: this.anim }}>
          <MiToolbar
            dark={true}
            titulo="Visor de imagenes"
            onBackPress={this.ocultar}
            backgroundColor="transparent"
          />

        </Animated.View>
      </View >

    );
  }
}