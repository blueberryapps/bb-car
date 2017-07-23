/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
// import Sensor from './Sensor'

export default class bbcar extends Component {
  state = {
    left: 0,
    right: 0,
  }

  changeLeft = (left=0) => this.setState({left})
  changeRight = (right=0) => this.setState({right})

  render() {
    const { left, right } = this.state
    return (
      <View style={styles.container}>

        <Slider onValueChange={this.changeLeft} step={1} minimumValue={-255} maximumValue={255} value={left} style={styles.slider}/>


        <Slider onValueChange={this.changeRight} step={1} minimumValue={-255} maximumValue={255} value={right} style={styles.slider}/>

        <Text style={styles.welcome}>
          {this.state.left}
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    width: 200
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

// AppRegistry.registerComponent('bbcar', () => bbcar);
