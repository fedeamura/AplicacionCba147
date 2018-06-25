import React from "react";
import {
  View,
  StyleSheet
} from "react-native";
import {
  Text,
  Item,
  Picker
} from "native-base";
import { Card, CardContent } from "react-native-paper";

//Mis componentes
import Rules_Ajustes from "@Rules/Rules_Ajustes";

export default class PaginaAjustes extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cardRequerimiento: "1"
    };
  }

  componentDidMount() {
    Rules_Ajustes.getListadoRequerimientoInterfaz().then((data) => {
      this.setState({ cardRequerimiento: data + '' });
    });
  }

  onCardRequerimientoChange = (val) => {
    Rules_Ajustes.setListadoRequerimientoInterfaz(val).then(() => {
      this.setState({ cardRequerimiento: val });
    });
  }
  render() {
    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>
        <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 16 }}>Interfaz</Text>
        <Card style={styles.card}>
          <CardContent>
            <Text>Listado de requerimientos</Text>
            <Item picker >
              <Picker
                iosHeader="Seleccione un estilo"
                mode="dropdown"
                style={{ width: '100%' }}
                placeholder="Interfaz card requerimiento"
                placeholderStyle={{ color: "black" }}
                selectedValue={this.state.cardRequerimiento}
                onValueChange={this.onCardRequerimientoChange}
              >
                <Picker.Item label="Version Dregadez" value="1" />
                <Picker.Item label="Version Blanca" value="2" />
              </Picker>
            </Item>
          </CardContent>
        </Card>

      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%',
    padding: 16
  },
  contenido: {
    flex: 1
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
})