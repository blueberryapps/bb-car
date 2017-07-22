
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Button
} from 'react-native';

import BluetoothSerial from 'react-native-bluetooth-serial'


import { decreasePower, computePower, getRadians, getDegrees, calculateC, calculateAlfa } from './calculations'

export default class AnimationExample extends Component {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get('window');
    const edgeLength = 50;

    const axisX = (width / 2) - (edgeLength / 2);
    const axisY = (height / 2) - (edgeLength / 2);

    this.axisX = axisX;
    this.axisY = axisY;



    this.axisXDefault = axisX;
    this.axisYDefault = axisY;

    this.state = {
      connected: false,
      coordX: 0,
      coordY: 0,
      axisX,
      axisY,
      edgeLength,
      panAnimation: new Animated.ValueXY({ x: axisX , y: axisY }),
      scaleAnimation: new Animated.Value(1),
    }
  }

  componentWillMount() {
    this.state.panAnimation.x.addListener((event) => {this.axisX = event.value; this.calculatePower({x: event.value, y: this.axisY})});
    this.state.panAnimation.y.addListener((event) => {this.axisY = event.value; this.calculatePower({y: event.value, x: this.axisX})});

    this.panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e) => {

        this.sendData()
        this.state.panAnimation.setOffset({ x: this.axisX, y: this.axisY });
        this.state.panAnimation.setValue({ x: 0, y: 0 });
        Animated.spring(this.state.scaleAnimation, {
          toValue: 1.5,
        }).start();
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.panAnimation.x, dy: this.state.panAnimation.y },
      ]),
      onPanResponderRelease: () => {
        Animated.spring(this.state.scaleAnimation, {
          toValue: 1,
        }).start();


        this.interval && clearInterval(this.interval)

        const { width, height } = Dimensions.get('window');
        const edgeLength = 100;

        const axisX = (width / 2) - (edgeLength / 2);
        const axisY = (height / 2) - (edgeLength / 2);

        this.state.panAnimation.setValue({ x: 0, y: 0 });
      }
    });


    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
      .then((values) => {
        const [ isEnabled, devices ] = values

        console.log(isEnabled, devices)

        const [device] = devices.filter(item => {
          return item.name.startsWith('HC-05')
        })

        console.log(device)

        BluetoothSerial.connect(device.id)
          .then((res) => {
            console.log(`Connected to device`, res)
            this.setState({connected: true })

          })
          .catch(err => {
            alert('Amigo, no funciona!!')
            this.setState({connected: false })
          })


        this.setState({ isEnabled, device: device[0] })
      })
  };

  componentWillUnmount() {
    this.state.panAnimation.x.removeAllListeners();
    this.state.panAnimation.y.removeAllListeners();
    clearInterval(this.interval)
  };



  calculatePower = ({x, y}) => {
    const coordX = Math.abs(this.axisXDefault - Math.abs(x))
    const coordY = Math.abs(this.axisYDefault - Math.abs(y))

    const isLeft = x < 134 ;
    const isTop = y < 259;

    const c = calculateC(coordY, coordX)

    const maxC = c > this.axisXDefault ? this.axisXDefault : c;
    const alfa = getDegrees(Math.atan(coordY/coordX))
    // const beta = 90 - alfa

    const powerDecrease = alfa/90

    const maxPower = (maxC/this.axisXDefault) * 255

    const right = (isTop ? 1 : -1) *  (maxPower)
    const left = (isTop ? 1 : -1) * ( powerDecrease * maxPower)

    const leftCalc = left ? left : 0
    const rightCalc = right ? right : 0

    const power = {
      right: parseInt((!isLeft ? leftCalc : rightCalc), 10),
      left: parseInt(( isLeft ? leftCalc : rightCalc), 10)
    }

    this.power=power;
  }

  power = {
    right: 0,
    left: 0
  }


  interval = null;

  sendData = () => {
    this.interval = setInterval(()=>{

      if(this.state.connected){
        BluetoothSerial.write(`${this.power.left} ${this.power.right}\n`)
          .catch((err) => console.error(err.message))

        console.log(this.power)
      }

    },200)
  }



  connect = () => {
    const { device }  = this.state;
      console.log('try to connect', device, device.id)

  }

  render() {
    const { edgeLength, panAnimation, connected } = this.state;

    const styles = {
      height: edgeLength,
      width: edgeLength,
      backgroundColor: 'blue',
      transform: [
        { translateX: panAnimation.x },
        { translateY: panAnimation.y },
        { scaleX: this.state.scaleAnimation },
        { scaleY: this.state.scaleAnimation },
      ]
    };

    styles.backgroundColor = connected ? '#F5FCFF' : 'red';

    return (
      <View style={styles.container}>
        <Animated.View
          style={styles}
          {...this.panResponder.panHandlers}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('bbcar', () => AnimationExample);
