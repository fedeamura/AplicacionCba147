import React from "react";
import {
  StyleSheet,
  View,
  Animated,
} from "react-native";
import {
  Text,
} from "native-base";
import LottieView from 'lottie-react-native';
import MiBoton from "@Utils/MiBoton";

export default class UsuarioNuevo_Resultado extends React.Component {


  static defaultProps = {
    ...React.Component.defaultProps,
    onButtonPress: function () { },
    visible: false,
    cargando: false,
    username: 'Sin datos',
    email: 'sin datos'
  }

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

  onButtonPress = () => {
    this.props.onButtonPress();
  }

  render() {

    const textoDetalle = texto_Detalle.replace('{email}', this.props.email);
    const textoDetalle2 = texto_Detalle2.replace('{username}', this.props.username || 'Sin datos');

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

        <View>
          <Animated.Text style={[
            styles.texto_CreandoUsuario,
            {
              position: 'absolute',
              opacity: this.animTextosCargando
            }]
          }>{texto_Registrando}</Animated.Text>

          <Animated.View style={{
            opacity: this.animTextos
          }}>
            <Text style={styles.texto_CreandoUsuario}>{texto_UsuarioCreado}</Text>
            <Text style={[styles.texto_EmailActivacion, { marginTop: 8 }]}>{textoDetalle}</Text>
            <Text style={[styles.texto_Username]}>{textoDetalle2}</Text>
            <View style={{ marginTop: 16 }}>
              <MiBoton
                centro
                verde
                rounded
                onPress={this.onButtonPress}
                texto={texto_BotonAceptar}
                sombra />
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
  texto_CreandoUsuario: {
    fontSize: 28,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center'
  },
  texto_EmailActivacion: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center'
  },
  texto_Username: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 300,
    opacity: 0.9,
    alignSelf: 'center'
  }
});

const texto_Registrando = 'Registrando su usuario...';
const texto_UsuarioCreado = 'Usuario creado correctamente';
const texto_Detalle = 'Te enviamos un e-mail a {email} con las instrucciones para activarlo';
const texto_Detalle2 = 'Recordá que tu nombre de usuario es {username}';
const texto_BotonAceptar = 'Aceptar';