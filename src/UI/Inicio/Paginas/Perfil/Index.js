import React from "react";
import {
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import {
  Text,
} from "native-base";
import { Card, CardContent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebImage from 'react-native-web-image'

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

    const initData = global.initData;

    return (
      <View style={[styles.contenedor, { backgroundColor: initData.backgroundColor }]}>
        <ScrollView>
          <View style={styles.scrollView}>
            <View style={styles.imagen}>
              <WebImage
                resizeMode="cover"
                source={{ uri: 'https://i.pinimg.com/originals/d1/1a/45/d11a452f5ce6ab534e083cdc11e8035e.png' }}
                style={{
                  width: '100%',
                  height: '100%'
                }} />
            </View>

            <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_Titulo_DatosPersonales}</Text>
            <Card style={styles.card}>
              <CardContent>
                <Text style={{ fontSize: 24 }}>Federico Amura</Text>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="account-card-details" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Dni}</Text>
                    <Text>35476866</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="account-card-details" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Cuil}</Text>
                    <Text>20354768667</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="calendar" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_FechaNacimiento}</Text>
                    <Text>01/04/1991</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name={"gender-male"} type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Sexo}</Text>
                    <Text>{texto_Titulo_SexoMasculino}</Text>
                  </View>
                </View>


                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="map" type="MaterialCommunityIcons" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_DomicilioLegal}</Text>
                    <Text>Independencia 710 4f, Cordoba, Cordoba</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Text style={{ fontSize: 24, marginLeft: 24, marginTop: 32 }}>{texto_Titulo_DatosContacto}</Text>
            <Card style={[styles.card]}>

              <CardContent>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="email" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_Email}</Text>
                    <Text>fede.amura@gmail.com</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="phone" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_TelefonoCelular}</Text>
                    <Text>351-7449132</Text>
                  </View>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                  <Icon name="phone" style={{ fontSize: 24, marginLeft: 4, marginTop: 4, opacity: 0.8 }}></Icon>
                  <View style={{ marginLeft: 16 }}>
                    <Text style={{ fontWeight: 'bold' }}>{texto_Titulo_TelefonoFijo}</Text>
                    <Text>351-4226236</Text>
                  </View>
                </View>

              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: '100%'
  },
  imagen: {
    width: 156,
    overflow: 'hidden',
    height: 156,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: (200 / 2),
    margin: 16,
    alignSelf: 'center'
  },
  scrollView: {
    width: '100%',
    padding: 16
  },
  card: {
    borderRadius: 16,
    margin: 8
  }
});

const texto_Titulo_DatosPersonales = 'Datos personales';
const texto_Titulo_Dni = 'Nº de Documento';
const texto_Titulo_Cuil = 'CUIL';
const texto_Titulo_FechaNacimiento = 'Fecha de nacimiento';
const texto_Titulo_Sexo = 'Sexo';
const texto_Titulo_SexoMasculino = 'Masculino';
const texto_Titulo_SexoFemenino = 'Femenino';
const texto_Titulo_DomicilioLegal = 'Domicilio legal'

const texto_Titulo_DatosContacto = 'Datos de contacto';
const texto_Titulo_Email = 'E-Mail';
const texto_Titulo_TelefonoFijo = 'Teléfono fijo';
const texto_Titulo_TelefonoCelular = 'Teléfono Celular';


