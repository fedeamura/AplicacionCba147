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
  Content,
  Card
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import WebImage from 'react-native-web-image'

//Mis componentes
import App from "@UI/App";

export default class PaginaPerfil extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      error: undefined
    };
  }

  componentDidMount() {

  }

  render() {

    const initData = global.initData.inicio.paginas.perfil;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ width: '100%', padding: 16 }}>

            <View style={{
              width: 156,
              overflow: 'hidden',
              height: 156,
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: (200 / 2),
              margin: 16,
              alignSelf: 'center'
            }}>

              <WebImage
                resizeMode="cover"
                source={{ uri: 'https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png' }}
                style={{
                  width: '100%',
                  height: '100%'
                }} />
            </View>

            <Text style={{ alignSelf: 'center', fontSize: 32, marginTop: 8 }}>Federico Amura</Text>

            <Card style={{ padding: 16, marginTop: 32 }}>

              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Icon name="gender-male" type="MaterialCommunityIcons" style={{ fontSize: 24, marginTop: 4 }} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ fontSize: 20 }}>Sexo</Text>
                  <Text>Masculino</Text>
                </View>
              </View>

              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>

                <Icon name="account-card-details" type="MaterialCommunityIcons" style={{ fontSize: 24, marginTop: 4 }} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ fontSize: 20 }}>DNI</Text>
                  <Text>35476866</Text>
                </View>
              </View>

              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
                <Icon name="calendar-today" type="MaterialCommunityIcons" style={{ fontSize: 24, marginTop: 4 }} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ fontSize: 20 }}>Fecha de nacimiento</Text>
                  <Text>01/04/1991</Text>
                </View>
              </View>

            </Card>

            <Card style={{ padding: 16, marginTop: 32 }}>

              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Icon name="email" type="MaterialCommunityIcons" style={{ fontSize: 24, marginTop: 4 }} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ fontSize: 20 }}>E-Mail</Text>
                  <Text>fede.amura@gmail.com</Text>
                </View>
              </View>

              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>

                <Icon name="phone" type="MaterialCommunityIcons" style={{ fontSize: 24, marginTop: 4 }} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={{ fontSize: 20 }}>Teléfono</Text>
                  <Text>3517449132</Text>
                </View>
              </View>

          

            </Card>

          </View>

        </ScrollView>

      </View >
    );
  }
}