
import React, { Component } from "react";
import App from "Cordoba/src/UI/App";
import initData from '@UI/initData.json';

export default class Rules_Init extends React.Component {
  constructor() {
    super();
  }

  static getInitData() {
    return new Promise((resolve, reject) => {
      
      resolve(initData);
      // fetch("https://cba147log.firebaseio.com/initData.json", { method: 'GET' })
      //   .then(response => response.json())
      //   .then(initData => {
      //     resolve(initData);
      //   });
    });
  }
}
