/*
  BB Car made with love by Blueberry.io
*/
/*
  Ultrasonic
*/

const int trigFrontPin = 12;
const int echoFrontPin = 13;
const int trigBackPin = 8;
const int echoBackPin = 9;
const int ultrasonicTimeout = 120 * 58;// Max.Distance(cm) * 58
const int ultrasonicMeasureLength = (ultrasonicTimeout / 1000) * 2; // 2 stands for back and front
long measureDuration;

void ultrasonicSetup() {
  pinMode(trigFrontPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoFrontPin, INPUT); // Sets the echoPin as an Input
  pinMode(trigBackPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoBackPin, INPUT); // Sets the echoPin as an Input
}

int measureDistanceFront() {
    // Clears the trigPin
  digitalWrite(trigFrontPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigFrontPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigFrontPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  measureDuration = pulseIn(echoFrontPin, HIGH, ultrasonicTimeout);
  // Calculating the distance
  if ( measureDuration == 0 ) {
	  measureDuration = ultrasonicTimeout; 
  }
  return measureDuration*0.034/2;
}

int measureDistanceBack() {
    // Clears the trigPin
  digitalWrite(trigBackPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigBackPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigBackPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  measureDuration = pulseIn(echoBackPin, HIGH, ultrasonicTimeout);
  // Calculating the distance
  if ( measureDuration == 0 ) {
	  measureDuration = ultrasonicTimeout; 
  }
  return measureDuration*0.034/2;
}

/* 
  Bluetooth 
*/

#include <SoftwareSerial.h>
int bluetoothRxPin = 11;
int bluetoothTxPin = 10;
SoftwareSerial bluetooth(bluetoothTxPin, bluetoothRxPin);

void bluetoothSetup() {
  bluetooth.begin(9600);
  Serial.println(“Arduino zapnuto, test Bluetooth..“);
  bluetooth.println(“Arduino zapnuto, test Bluetooth..“);
}

/* 
  Servo
*/

#include <Servo.h>

int servoAdjustment = 0;
int servoPin = 6;
int angle = 0;
int direction = 1;
int step = 15;
int bluetoothOutput = 1;
int alreadyMeasured = 0;
unsigned long servoPreviousMillis = 0;
int servoMoveInterval = 300;
Servo servo;

void servoSetup() {
  servo.attach(servoPin);
}

int getAngle() {
  int newAngle = angle+(step*direction);
  if(newAngle > 180 || newAngle < 0) {
    direction = -1*direction;
    return getAngle();
  }
  return newAngle;
}

void measureDistance() {
  unsigned long currentMillis = millis();
  if (currentMillis - servoPreviousMillis >= (servoMoveInterval - ultrasonicMeasureLength) && alreadyMeasured == 0) {
    alreadyMeasured = 1;
    if (bluetoothOutput) {
      bluetooth.print(angle + servoAdjustment);
      bluetooth.print(” “);
      bluetooth.print(measureDistanceFront());
      bluetooth.print(” “);
      bluetooth.println(measureDistanceBack());
    } else {
      Serial.print(angle + servoAdjustment);
      Serial.print(” “);
      Serial.print(measureDistanceFront());
      Serial.print(” “);
      Serial.println(measureDistanceBack());
    }
  }
}

void moveServo() {
  unsigned long currentMillis = millis();
  if (currentMillis - servoPreviousMillis >= servoMoveInterval) {
    servoPreviousMillis = currentMillis;
    alreadyMeasured = 0;
    angle = getAngle();
    servo.write(angle);
  }
}

/*
 LED
*/
int ledPin = LED_BUILTIN;
int ledState = LOW;             
unsigned long previousMillis = 0;       
const long interval = 1000; 

void toggleLed() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;

    // if the LED is off turn it on and vice-versa:
    if (ledState == LOW) {
      ledState = HIGH;
    } else {
      ledState = LOW;
    }

    // set the LED with the ledState of the variable:
    digitalWrite(ledPin, ledState);
  }
}

void ledSetup() {
  pinMode(ledPin, OUTPUT);
}

/*
  MOTORS
*/

/*
A0 is referred to as Pin 14
A1 is referred to as Pin 15
A2 is referred to as Pin 16
A3 is referred to as Pin 17
A4 is referred to as Pin 18
A5 is referred to as Pin 19
*/

int dir1PinA = 18;
int dir2PinA = 19;
int speedPinA = 3; // Needs to be a PWM pin to be able to control motor speed
int dir1PinB = 16;
int dir2PinB = 17;
int speedPinB = 5; // Needs to be a PWM pin to be able to control motor speed

int motorA = 0;
int motorB = 0;

String inputString = “”;         // a string to hold incoming data
String motorAString = “”;         // a string to hold incoming data
String motorBString = “”;         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete
boolean motorAComplete = false;  // whether the string is complete
unsigned long previousMotorMillis = 0;
const long motorInterval = 250; 

void motorsSetup() {
  pinMode(dir1PinA,OUTPUT);
  pinMode(dir2PinA,OUTPUT);
  pinMode(speedPinA,OUTPUT);
  pinMode(dir1PinB,OUTPUT);
  pinMode(dir2PinB,OUTPUT);
  pinMode(speedPinB,OUTPUT);
}

void updateMotors() {
  analogWrite(speedPinA, abs(motorA));//Sets speed variable via PWM 
  digitalWrite(dir1PinA, motorA > 0 ? LOW : HIGH);
  digitalWrite(dir2PinA, motorA <= 0 ? LOW : HIGH);
  analogWrite(speedPinB, abs(motorB));//Sets speed variable via PWM 
  digitalWrite(dir1PinB, motorB > 0 ? LOW : HIGH);
  digitalWrite(dir2PinB, motorB <= 0 ? LOW : HIGH);
}

void stopMotorsWhenNoNewData() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMotorMillis >= motorInterval && (motorA != 0 || motorB != 0)) {
    motorA = 0;
    motorB = 0;
    updateMotors();
    Serial.println(“Stopping motors”);
  }
}

void receiveAndUpdateMotorData() {
  unsigned long currentMillis = millis();
  if (stringComplete) {
    int A = motorAString.toInt();
    if (A > -256 && A < 256) {
      motorA = A;  
    }
    int B = motorBString.toInt();
    if (B > -256 && B < 256) {
      motorB = B;
    }
    Serial.print(“.”);
    Serial.println(“A”);
    Serial.println(A);
    Serial.println(motorA);
    Serial.println(“B”);
    Serial.println(B);
    Serial.println(motorB);
    updateMotors();
    previousMotorMillis = currentMillis;

    // clear the string:
    inputString = “”;
    motorAString = “”;
    motorBString = “”;
    stringComplete = false;
  }
}

/* 
  Parsing Input
*/

void readDataSetup() {
  Serial.begin(9600);
  // reserve 200 bytes for the inputString:
  inputString.reserve(200);
  motorAString.reserve(5);
  motorBString.reserve(5);
}

void parseInputChar(char inChar) {
  // add it to the inputString:
  if (isDigit(inChar) || inChar == ‘-’) {
  // convert the incoming byte to a char and add it to the string:
    if (motorAComplete) {
      motorBString += (char)inChar;
    } else {
      motorAString += (char)inChar;  
    }
  }

  if (inChar == ' ‘) {
    motorAComplete = true;
  }
  // if the incoming character is a newline, set a flag
  // so the main loop can do something about it:
  if (inChar == ‘\n’) {
    motorAComplete = false;
    stringComplete = true;
  }
}

/*
  SETUP & LOOP
*/

void setup() {
  readDataSetup();
  bluetoothSetup();
  ledSetup();
  ultrasonicSetup();
  servoSetup();
  motorsSetup();
}

void loop() {
  toggleLed();
  bluetoothEvent();
  receiveAndUpdateMotorData();
  stopMotorsWhenNoNewData();
  measureDistance();
  moveServo();
}

/*
  SerialEvent occurs whenever a new data comes in the
 hardware serial RX.  This routine is run between each
 time loop() runs, so using delay inside loop can delay
 response.  Multiple bytes of data may be available.
 */
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    parseInputChar(inChar);
  }
}

void bluetoothEvent() {
  while (bluetooth.available() > 0) {
    char inChar = (char)bluetooth.read();
    inputString += inChar;
    parseInputChar(inChar);
  }
}