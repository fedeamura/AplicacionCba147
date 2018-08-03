import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Keyboard,
  TextInput,
} from "react-native";
import {
  ListItem,
  Text
} from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import autobind from 'autobind-decorator'

//Mis compontenes
import App from "@UI/App";
import MiToolbar from "@Utils/MiToolbar";
import MiListado from "@Utils/MiListado";

export default class MiPicker extends React.Component {
  constructor(props) {
    super(props);

    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    if (!('busqueda' in params)) {
      params.busqueda = false;
    }

    if (!('cumpleBusqueda' in params)) {
      params.cumpleBusqueda = () => { return true };
    }

    this.state = {
      busqueda: undefined
    }

    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  @autobind
  keyboardWillShow(event) {
    this.teclado = true;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height
    }).start();
  }

  @autobind
  keyboardWillHide(event) {
    this.teclado = false;

    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
    }).start();
  }

  @autobind
  onChangeBusqueda(text) {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    this.setState({
      busqueda: text,
      dataFiltrada: params.data.filter(element => params.cumpleBusqueda(element, text))
    });
  }

  @autobind
  goBack() {
    App.goBack()
  }

  render() {
    let { params } = this.props.navigation.state || {};
    if (params == undefined) params = {};

    const colorFondo = params.backgroundColor || 'white';

    return (
      <View style={[styles.contenedor, { backgroundColor: colorFondo }]}>

        {/* Toolbar */}
        <MiToolbar customContent onBackPress={this.goBack}>
          {params.busqueda == true && (
            <TextInput
              onChangeText={this.onChangeBusqueda}
              placeholder={params.placeholderBusqueda}
              underlineColorAndroid='rgba(0,0,0,0)'
              style={[styles.inputBusqueda]} />
          )}
        </MiToolbar>

        {/* Content */}
        <View style={styles.contenido}>
          <MiListado
            backgroundColor={colorFondo}
            data={this.state.busqueda != undefined && this.state.busqueda != "" ? this.state.dataFiltrada : params.data}
            keyExtractor={params.keyExtractor}
            renderEmpty={() => {
              return <Text>{params.textoEmpty || 'No encontrado'}</Text>;
            }}
            renderItem={({ item }) => {
              return (
                <ListItem
                  onPress={() => {
                    params.onPress(item);
                    App.goBack();
                  }}
                >
                  {params.renderItem != undefined ?
                    (
                      <View style={{ width: '100%' }}>
                        {params.renderItem(item)}
                      </View>
                    ) :
                    (
                      <Text>{params.title(item)}</Text>
                    )
                  }
                </ListItem>
              );
            }}
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0)"]}
            backgroundColor="transparent"
            style={{ left: 0, top: 0, right: 0, height: 16, position: 'absolute' }}
            pointerEvents="none" />
        </View>

        <Animated.View style={[{ height: '100%' }, {
          maxHeight: this.keyboardHeight
        }]}></Animated.View>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    height: "100%",
    width: "100%",
  },
  contenedorBusqueda: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  inputBusqueda: {
    marginLeft: 16,
    width: '100%',
    fontSize: 20
  },
  contenido: {
    flex: 1
  }
});
