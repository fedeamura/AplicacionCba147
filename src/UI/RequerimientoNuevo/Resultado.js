import React from "react";
import {
  StyleSheet,
  View,
  Animated,
} from "react-native";
import {
  Button,
  Text,
} from "native-base";
import LottieView from 'lottie-react-native';

//Mis componentes
import App from "Cordoba/src/UI/App";


export default class RequerimientoNuevo_Resultado extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      cargando: props.cargando
    };

    this.anim = new Animated.Value(0);
    this.animTextos = new Animated.Value(0);
    this.animTextosCargando = new Animated.Value(0);
    this.animLottie = new Animated.Value(0);

    if (props.visible == true) {
      this.mostrar();
    } else {
      this.ocultar();
    }

    if (props.cargando == true) {
      this.mostrarCargando();
    } else {
      this.ocultarCargando();
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.visible == true) {
      this.mostrar();
    } else {
      this.ocultar();
    }

    if (nextProps.cargando == true) {
      this.mostrarCargando();
    } else {
      this.ocultarCargando();
    }

    this.setState({
      visible: nextProps.visible,
      cargando: nextProps.cargando
    });
  }

  mostrar = () => {
    Animated.timing(this.anim, {
      toValue: 1,
      timing: 300
    }).start();
  }

  ocultar = () => {
    Animated.timing(this.anim, {
      toValue: 0,
      timing: 300
    }).start();
  }

  mostrarCargando = () => {
    Animated.timing(this.animTextos, {
      toValue: 0,
      timing: 300
    }).start();
    Animated.timing(this.animTextosCargando, {
      toValue: 1,
      timing: 300
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(this.animLottie, {
          toValue: 0.5,
          duration: 1000
        }),
        Animated.timing(this.animLottie, {
          toValue: 0,
          duration: 1000
        })
      ])).start();
  }

  ocultarCargando = () => {
    Animated.timing(this.animTextos, {
      toValue: 1,
      timing: 300
    }).start();
    Animated.timing(this.animTextosCargando, {
      toValue: 0,
      timing: 300
    }).start();

    Animated.timing(this.animLottie, {
      toValue: 1,
      duration: 1500
    }).start();
  }

  render() {
    const textoResultado = texto_RequerimientoRegistrado.replace('{numero}', this.props.numero || 'sin número');

    return (
      <Animated.View
        pointerEvents={this.props.visible == true ? 'auto' : 'none'}
        style={[styles.contenedor_Resultado, {
          opacity: this.anim
        }]}>
        <View style={styles.animacion_Resultado}>
          <LottieView
            style={{ width: '100%', height: '100%' }}
            resizeMode='contain'
            source={require('@Resources/animacion_exito.json')}
            progress={this.animLottie} />
        </View>

        <View style={styles.contenedor_Textos}>
          <Animated.Text
            style={[
              styles.texto_Registrando,
              {
                position: 'absolute',
                opacity: this.animTextosCargando
              }]
            }>{texto_Registrando}</Animated.Text>

          <Animated.View style={[
            {
              opacity: this.animTextos
            }]}>
            <Text style={styles.texto_Resultado}>{textoResultado}</Text>
            <View style={{ marginTop: 16 }}>
              <Button
                bordered
                rounded
                style={{ alignSelf: 'center', borderColor: 'green' }}
                onPress={this.props.onPressVerDetalle}>
                <Text style={{ color: 'green' }}>{texto_BotonVerDetalle}</Text>
              </Button>
            </View>

          </Animated.View>
        </View>

      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  contenedor_Resultado: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center'
  },
  animacion_Resultado: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  contenedor_Textos: {
    width: '100%',
  },
  texto_Registrando: {
    fontSize: 24,
    height: 72,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center'
  },
  texto_Resultado: {
    fontSize: 24,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center'
  }
});

const texto_Registrando = 'Registrando su requerimiento';
const texto_RequerimientoRegistrado = 'Requerimiento número {numero} registrado correctamente';
const texto_BotonVerDetalle = 'Ver detalle';
