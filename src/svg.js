import React from 'react';

const firstCircle = 10;
const secondCircle = 20;
const thirdCircle = 35;
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
    data: {
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
    },
    lastMeasuredAngle: 45,
    margin: 10,
    circleRadius: 200,
    maximumValue: dimension(200, 100.0) // 500 cm
  }

  getX = (angle, distance) => Math.sin((angle % 90) * (Math.PI / 180)) * distance;
  getY = (angle, distance) => Math.cos((angle % 90) * (Math.PI / 180)) * distance;

  getPixelDistance = distance => Math.round((this.state.circleRadius / this.state.maximumValue) * dimension(this.state.circleRadius, distance));

  getPosition = (angle, distanceInCm) => {
    const distanceInPx = this.getPixelDistance(distanceInCm);
    const X = this.state.circleRadius + this.state.margin + (distanceInPx * Math.cos(angle * (Math.PI / 180)));
    const Y = this.state.circleRadius + this.state.margin + (distanceInPx * Math.sin(angle * (Math.PI / 180)));
    return `${X},${Y}`;
  }

  render() {
    const { circleRadius, data, margin, lastMeasuredAngle } = this.state;
    const dd = Object.keys(data).map(angle => this.getPosition(parseInt(angle, 10) + 180, data[angle][0]))
      .concat(Object.keys(data).map(angle => this.getPosition(parseInt(angle, 10), data[angle][1])));
    const top = this.getPosition(lastMeasuredAngle, 100);
    const bottom = this.getPosition(lastMeasuredAngle + 180, 100);
    const center = margin + circleRadius;
    return (
      <svg height={center * 2} width={center * 2}>
        <path d={`M${dd[0]} C ${dd.join(' ')} ${dd[0]} Z`} style={{ fill: 'lime', stroke: 'purple', strokeWidth: 2 }} />
        <polygon points={`${top} ${bottom}`} style={{ stroke: 'red', strokeWidth: 2 }} />
        <circle cx={center} cy={center} r="5" style={{ fill: 'red' }} />
        <circle cx={center} cy={center} r={this.getPixelDistance(firstCircle)} style={{ fill: 'red', fillOpacity: '0.5', stroke: 'orange', strokeWidth: 2 }} />
        <text x={center - 8} y={center - this.getPixelDistance(firstCircle) + 15} fill="orange">{firstCircle}</text>
        <circle cx={center} cy={center} r={this.getPixelDistance(secondCircle)} style={{ fill: 'transparent', stroke: 'orange', strokeWidth: 2 }} />
        <text x={center - 8} y={center - this.getPixelDistance(secondCircle) + 15} fill="orange">{secondCircle}</text>
        <circle cx={center} cy={center} r={this.getPixelDistance(thirdCircle)} style={{ fill: 'transparent', stroke: 'orange', strokeWidth: 2 }} />
        <text x={center - 8} y={center - this.getPixelDistance(thirdCircle) + 15} fill="orange">{thirdCircle}</text>
        <circle cx={center} cy={center} r={this.getPixelDistance(fourthCircle)} style={{ fill: 'transparent', stroke: 'orange', strokeWidth: 2 }} />
        <text x={center - 12} y={center - this.getPixelDistance(fourthCircle) + 15} fill="orange">{fourthCircle}</text>
        <circle cx={center} cy={center} r={this.getPixelDistance(fifthCircle)} style={{ fill: 'transparent', stroke: 'orange', strokeWidth: 2 }} />
        <text x={center - 12} y={center - this.getPixelDistance(fifthCircle) + 15} fill="orange">{fifthCircle}</text>
      </svg>
    );
  }
};

export default Radar;
