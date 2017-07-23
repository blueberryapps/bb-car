
import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Button,
  Dimensions
} from 'react-native';

import Radar from './Radar'

import BluetoothSerial from 'react-native-bluetooth-serial'

import AnimationWrapper from './AnimationWrapper'

export default class BluetoothWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      data: {},
      lastAngle: 0
    }
  }

  readData = () => {
    BluetoothSerial.readUntilDelimiter('\n').then(x => {
      if (x.length > 0) {
        const { data, lastAngel } = this.state;
        const [angle, front, back] = x.toString().split(' ').map(y => parseInt(y, 10));
        console.log('xxxx', x, [angle, front, back]);
        if (angle !== lastAngel || !data[angle] || data[angle][0] !== front || data[angle][1] !== back) {
          this.setState({lastAngle: angle, data: {...data, [angle]: [front, back]}});
        }
      }
      setTimeout(this.readData, 10);
    });
  }

  componentWillMount() {
    this.findConnection()

    this.readData();
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
        console.log(err)
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
    const { connected, data, lastAngle } = this.state;

    const { width, height } = Dimensions.get('window');
    console.log(data)
    console.log(lastAngle)
    return (
      <View>
        <View style={{position: 'absolute', top: (height - width) / 2 + 36}}>
          <Radar data={data} lastAngle={lastAngle} size={width}/>
        </View>
        <Button title={connected ? 'Disconnect' : 'Connect'} onPress={this.handleConnectButton} />
        <AnimationWrapper connected={connected} sendData={this.sendData} setPower={this.setPower} clear={this.clearInterval}  />
      </View>
    );
  }
}

AppRegistry.registerComponent('bbcar', () => BluetoothWrapper);
