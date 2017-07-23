import React from 'react';
import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

const firstCircle = 0;
const secondCircle = 10;
const thirdCircle = 30;
const fourthCircle = 60;
const fifthCircle = 100;

const dimension = (circleRadius, x) => {
  const step = circleRadius / 4.5;
  if (x <= firstCircle) {
    return ((step / firstCircle) * x) / 2; // divide by 2 to get half step
  }
  if (x <= secondCircle) {
    return (step * 0.5) + ((step / (secondCircle - firstCircle)) * (x - firstCircle));
  }
  if (x <= thirdCircle) {
    return (step * 1.5) + ((step / (thirdCircle - secondCircle)) * (x - secondCircle));
  }
  if (x <= fourthCircle) {
    return (step * 2.5) + ((step / (fourthCircle - thirdCircle)) * (x - thirdCircle));
  }
  return (step * 3.5) + ((step / (fifthCircle - fourthCircle)) * (x - fourthCircle));
};

class Radar extends React.Component {
  state = {
    margin: 10,
    circleRadius: (this.props.size - 20) / 2,
    maximumValue: dimension((this.props.size - 20) / 2, 100.0) // 100 cm
  }

  getX = (angle, distance) => Math.round(Math.sin((angle % 90) * (Math.PI / 180)) * distance);
  getY = (angle, distance) => Math.round(Math.cos((angle % 90) * (Math.PI / 180)) * distance);

  getPixelDistance = distance => Math.round((this.state.circleRadius / this.state.maximumValue) * dimension(this.state.circleRadius, distance));

  getPosition = (angle, distanceInCm) => {
    const distanceInPx = this.getPixelDistance(distanceInCm);
    const X = this.state.circleRadius + this.state.margin + (distanceInPx * Math.cos(angle * (Math.PI / 180)));
    const Y = this.state.circleRadius + this.state.margin + (distanceInPx * Math.sin(angle * (Math.PI / 180)));
    return `${X},${Y}`;
  }

  mockData = {
  0: [40, 24],
  10: [20, 21],
  20: [22, 21],
  30: [31, 21],
  40: [19, 22],
  50: [20, 286],
  60: [21, 10],
  70: [145, 10],
  80: [179, 138],
  90: [40, 136],
  100: [19, 18],
  110: [19, 47],
  120: [24, 70],
  130: [182, 71],
  140: [104, 231],
  150: [151, 62],
  160: [17, 62],
  170: [16, 63],
  180: [40, 30],
  }

  render() {
    const { data, lastAngle } = this.props;
    const { circleRadius, margin } = this.state;
    const dd = Object.keys(data).map(angle => this.getPosition(parseInt(angle, 10) + 180, data[angle][0]))
      .concat(Object.keys(data).map(angle => this.getPosition(parseInt(angle, 10), data[angle][1])));
    const top = this.getPosition(lastAngle, 100);
    const bottom = this.getPosition(lastAngle + 180, 100);
    const center = margin + circleRadius;
    // console.log('datat', dd, data)
    return (

      <Svg height={center * 2} width={center * 2}>
        {dd.length > 0 && <Path d={`M${dd[0]} C ${dd.join(' ')} ${dd[0]}`} fill="lime" stroke="purple" strokeWidth="2" />}
        <Polygon points={`${top} ${bottom}`} stroke="red" strokeWidth="2" />
        <Circle cx={center} cy={center} r="10" fill="red" />
        <Circle cx={center} cy={center} r={this.getPixelDistance(firstCircle)} fill="red" fillOpacity="0.5" stroke="orange" strokeWidth="2" />
        <Text x={center - 8} y={center - this.getPixelDistance(firstCircle)} fill="orange">{firstCircle}</Text>
        <Circle cx={center} cy={center} r={this.getPixelDistance(secondCircle)} fill="transparent" stroke="orange" strokeWidth="2" />
        <Text x={center - 8} y={center - this.getPixelDistance(secondCircle)} fill="orange">{secondCircle}</Text>
        <Circle cx={center} cy={center} r={this.getPixelDistance(thirdCircle)} fill="transparent" stroke="orange" strokeWidth="2" />
        <Text x={center - 8} y={center - this.getPixelDistance(thirdCircle)} fill="orange">{thirdCircle}</Text>
        <Circle cx={center} cy={center} r={this.getPixelDistance(fourthCircle)} fill="transparent" stroke="orange" strokeWidth="2" />
        <Text x={center - 12} y={center - this.getPixelDistance(fourthCircle)} fill="orange">{fourthCircle}</Text>
        <Circle cx={center} cy={center} r={this.getPixelDistance(fifthCircle)} fill="transparent" stroke="orange" strokeWidth="2" />
        <Text x={center - 12} y={center - this.getPixelDistance(fifthCircle)} fill="orange">{fifthCircle}</Text>
      </Svg>
    );
  }
};

export default Radar;
