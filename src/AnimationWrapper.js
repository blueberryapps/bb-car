
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';


import { decreasePower, computePower, getRadians, getDegrees, calculateC, calculateAlfa } from './libs/calculations'

export default class AnimationWrapper extends Component {
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
        this.state.panAnimation.setOffset({ x: this.axisX, y: this.axisY });
        this.state.panAnimation.setValue({ x: 0, y: 0 });
        Animated.spring(this.state.scaleAnimation, {
          toValue: 1.5,
        }).start();
        // Start to send data to Car
        console.log('send')
        this.props.sendData && this.props.sendData()
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.panAnimation.x, dy: this.state.panAnimation.y },
      ]),
      onPanResponderRelease: () => {
        Animated.spring(this.state.scaleAnimation, {
          toValue: 1,
        }).start();

        // Clear coordinates
        this.state.panAnimation.setValue({ x: 0, y: 0 });
        this.props.clear()
        console.log('release')
      }
    });
  };


  componentWillUnmount() {
    this.state.panAnimation.x.removeAllListeners();
    this.state.panAnimation.y.removeAllListeners();
  };

  calculatePower = ({x, y}) => {

    // Absolute coordinates
    const coordX = Math.abs(this.axisXDefault - Math.abs(x))
    const coordY = Math.abs(this.axisYDefault - Math.abs(y))

    const isLeft = x < 134 ;
    const isTop = y < 259;

    // Distance from the center
    const c = calculateC(coordY, coordX)
    // Max distance limit
    const maxC = c > this.axisXDefault ? this.axisXDefault : c;

    // Alfa angle
    const alfa = getDegrees(Math.atan(coordY/coordX))

    // Angle ratio
    const powerDecrease = alfa / 90

    // Max power depends on dinstance from center of display
    const maxPower = (maxC/this.axisXDefault) * 255

    const right = (isTop ? 1 : -1) *  (maxPower)
    const left = (isTop ? 1 : -1) * ( powerDecrease * maxPower)

    const leftCalc = left ? left : 0
    const rightCalc = right ? right : 0

    this.props.setPower({
      right: parseInt((!isLeft ? leftCalc : rightCalc), 10),
      left: parseInt(( isLeft ? leftCalc : rightCalc), 10)
    })
  }


  render() {
    const { edgeLength, panAnimation, scaleAnimation } = this.state;
    const { connected } = this.props;

    const styles = {
      height: edgeLength,
      width: edgeLength,
      transform: [
        { translateX: panAnimation.x },
        { translateY: panAnimation.y },
        { scaleX: scaleAnimation },
        { scaleY: scaleAnimation },
      ],
      backgroundColor: connected ? 'blue' : 'red'
    };

    return (
      <Animated.View
        style={styles}
        {...this.panResponder.panHandlers}
      />
    );
  }
}
