import React from "react";
import {
  Animated,
  View,
  Alert,
  Text,
  ScrollView
} from "react-native";
import {
  Spinner
} from 'native-base';
import {
  Dialog,
  Button as ButtonPaper,
  DialogActions,
  DialogTitle,
  DialogContent
} from "react-native-paper";

export default class MiDialogo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      render: props.visible,
      animando: false,
      visible: props.visible
    };

    this.anim = new Animated.Value(props.visible ? 1 : 0);
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    onDismiss: () => { },
    titulo: undefined,
    botones: [],
    cancelable: true,
    cargando: false
  }


  ocultar() {

  }

  render() {
    let cancelable = this.props.cancelable;
    if (this.props.cargando == true) {
      cancelable = false;
    }

    return <Dialog
      dismissable={cancelable}
      style={{
        borderRadius: 16,
        maxWidth: 400,
        width: '90%',
        alignSelf: 'center'
      }}
      visible={this.props.visible}
      onDismiss={this.props.onDismiss}
    >
      {this.renderCargando()}
      {this.renderContent()}

    </Dialog>;
  }

  renderCargando() {
    const cargando = this.props.cargando == true || false;
    if (cargando == false) return null;
    return <Spinner color="green" />;
  }

  renderContent() {
    const cargando = this.props.cargando == true || false;
    if (cargando == true) return null;

    const botones = this.props.botones.map((boton) => {
      let habilitado = boton.enabled == undefined || boton.enabled == true;

      return <ButtonPaper
        style={{ opacity: habilitado ? 1 : 0.5 }}
        onPress={() => {
          if (habilitado == false) return;
          boton.onPress();
        }}
      >{boton.texto || 'Boton'}
      </ButtonPaper>
    });

    return <View>
      {
        this.props.titulo != undefined && (
          <DialogTitle>{this.props.titulo}</DialogTitle>
        )
      }

      <DialogContent>
        <ScrollView style={{ maxHeight: 500 }}>
          {this.props.children}
        </ScrollView>
      </DialogContent>

      {this.props.botones.length != 0 && (
        <DialogActions>
          {botones}
        </DialogActions>
      )}
    </View>

  }
}
