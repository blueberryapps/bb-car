
import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Button
} from 'react-native';

import BluetoothSerial from 'react-native-bluetooth-serial'

import AnimationWrapper from './AnimationWrapper'

export default class BluetoothWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
    }
  }

  componentWillMount() {
    this.findConnection()


    BluetoothSerial.on('data', (data)=>{
      console.log('data', data)
    })

  };

  findConnection = () => {
    console.log('try to connect');
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
      .then((values) => {
        const [ isEnabled, devices ] = values

        const [device = {}] = devices.filter(item => {
          return item.name.startsWith('HC-05')
        })
        this.setState({ isEnabled, device })

        this.connect(device)
      })
  }

  connect = (device) => {
    BluetoothSerial.connect(device.id)
      .then((res) => {
        console.log(`Connected to device`, res)
        this.setState({ connected: true })
      })
      .catch(err => {
        alert('Amigo, no funciona!!')
        this.setState({ connected: false })
      })
  }

  disconnect = () => {
    BluetoothSerial.disconnect() && this.setState({ connected: false })
  }

  handleConnectButton = () => {
    const { connected, device } = this.state

    connected ? this.disconnect(device.id) : this.findConnection()
  };

  componentWillUnmount() {
    clearInterval(this.interval)
  };

  setPower = (power) => {
    this.power = power
  }

  power = {
    right: 0,
    left: 0
  }

  interval = null;

  sendData = () => {
    this.interval = setInterval(() => {
      const connected = BluetoothSerial.isConnected()
      if(connected){
        BluetoothSerial.write(`${this.power.left} ${this.power.right}\n`)
          .catch((err) => console.error(err.message))
      }else{
        this.setState({connected})
      }
    },100)
  }

  clearInterval = () => {
    this.interval && clearInterval(this.interval)
  }

  render() {
    const { connected } = this.state;

    return (
      <View>
        <Button title={connected ? 'Disconnect' : 'Connect'} onPress={this.handleConnectButton} />
        <AnimationWrapper connected={connected} sendData={this.sendData} setPower={this.setPower} clear={this.clearInterval}  />
      </View>
    );
  }
}

AppRegistry.registerComponent('bbcar', () => BluetoothWrapper);
