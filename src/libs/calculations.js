


export const decreasePower = (alfa, length, maxLength) => {

  return ((alfa/90)*(length/maxLength) ) * 255;

}

export const computePower = (length, maxLength) => {

  return ((length/maxLength) ) * 255;

}


export const calculateC = (absoluteX, absoluteY) => {

  return Math.sqrt((absoluteX*absoluteX) + (absoluteY*absoluteY))
}


export const calculateAlfa = (absoluteX, c) => {
  return (Math.asin(absoluteX/c) * ( 180 / Math.PI)) || 0;
}


export const getRadians = degrees => degrees * (Math.PI / 180)
export const getDegrees = radians => radians * (180 / Math.PI)
