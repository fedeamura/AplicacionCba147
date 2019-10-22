import React, { Component } from "react";
import SInfo from 'react-native-sensitive-info';

export default class DB extends React.Component {

    static setItem(nombre, val) {
        return SInfo.setItem(nombre, val, {});
    }

    static getItem(nombre) {
        return SInfo.getItem(nombre, {});
    }

    static removeItem(nombre) {
        // SInfo.setItem(nombre, undefined, {});
        SInfo.deleteItem(nombre, {});
    }
}