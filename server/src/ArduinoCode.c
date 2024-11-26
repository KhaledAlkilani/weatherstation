// This code has been added here to be documented and pushed to git repo. To run this code, copy it and paste it to Arduino IDE and upload it there.
// There is no way to push this code straight from Arduino IDE to the project git repo.

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h> 

// Wifi settings
// WiFi credentials for connecting to the network
const char* ssid = "add here the network name";
const char* password = "add here the netword password";

// MQTT Server IP address
// MQTT broker settings
const char* mqtt_server = "add here the server IP address";

// Initialize WiFi and MQTT client objects
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// DHT sensor pin and type definitions
#define DHTPIN 22
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE); // DHT sensor object

/* Variables for tracking the measurements for average calculation */
// Variables to manage linked list of measurements
int amountOfMeasurements = 5; // Number of measurements for sliding average
int measurementCounter = 0; // Counter for managing the list

/* Measurement struct definition for linked list */
// Linked list structure for storing measurements
struct measurement {
  float temperature;
  float humidity;  // Adding humidity field to track humidity
  struct measurement *next;
} ;

/* Struct pointer that is used to store the firstMeasurement (beginning of the linked list) */
// Pointers for linked list management
struct measurement *firstMeasurement; // Points to the first measurement
/* Struct pointer that is used to store the current position of the list */ 
struct measurement *currentMeasurement; // Points to the current position

// Application setup
// Initial setup function
void setup() {
  Serial.begin(115200); // Start serial communication
  dht.begin(); // Initialize the DHT sensor
  setup_wifi(); // Connect to WiFi
  mqttClient.setServer(mqtt_server, 1883); // Set MQTT broker details

  /* Create the first linked list item */
  // Initialize the linked list with the first measurement node
  firstMeasurement = (struct measurement *) malloc(sizeof(struct measurement));
  /* Ensure that the next address is still empty */
  // Ensure it has no next node yet
  firstMeasurement->next = NULL;
  currentMeasurement = firstMeasurement; // Set current position to the first node

  Serial.println("Using linked list for calculating the sliding average.");
}

// WiFi connection
// Function to set up the WiFi connection
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi SSID: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password); // Start WiFi connection
  while (WiFi.status() != WL_CONNECTED) { // Wait until connected
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP()); // Print the device's IP address
}

// MQTT connection
// Function to reconnect to MQTT broker if connection is lost
void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("ESP32_Client")) { // Attempt to connect
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000); // Wait and retry
    }
  }
}

/* Function that is used to add or update new measurement in the list */
// Add a measurement to the linked list
void addMeasurement(float temperature, float humidity) {
  currentMeasurement->temperature = temperature;
  currentMeasurement->humidity = humidity;

  measurementCounter += 1;
  if (measurementCounter == amountOfMeasurements) { // Reset to the first node if full
    currentMeasurement = firstMeasurement;
    measurementCounter = 0;
  }
  else {
    if (!currentMeasurement->next) { // If next node doesn't exist, create it
      struct measurement *nextMeasurement;
      nextMeasurement = (struct measurement *) malloc(sizeof(struct measurement));
      currentMeasurement->next = nextMeasurement;
      currentMeasurement = currentMeasurement->next;
      currentMeasurement->next = NULL;
    } else {
      currentMeasurement = currentMeasurement->next; // Move to the next node
    }
  }
}

/* Function to calculate the average of measured temperatures */
// Calculate average temperature from linked list
float calculateAverageTemperature() {
  float avgTemp = 0.0;
  struct measurement *avgMeasurement = firstMeasurement;
  while (avgMeasurement) { // Iterate through the list and sum temperatures
    avgTemp += avgMeasurement->temperature;
    avgMeasurement = avgMeasurement->next;
  }
  return avgTemp / amountOfMeasurements; // Return the average
}

/* Function to calculate the average of measured humidity */
// Calculate average humidity from linked list
float calculateAverageHumidity() {
  float avgHumidity = 0.0;
  struct measurement *avgMeasurement = firstMeasurement;
  while (avgMeasurement) { // Iterate through the list and sum humidity values
    avgHumidity += avgMeasurement->humidity;
    avgMeasurement = avgMeasurement->next;
  }
  return avgHumidity / amountOfMeasurements; // Return the average
}

// Application main loop
// Main loop to continuously measure and publish data
void loop() {
  // Reconnect mqtt if connection has been lost
  if (!mqttClient.connected()) {
    reconnect(); // Ensure MQTT connection is active
  }

  // Variables for measured temperature and humidity
  float measuredTemp = 0.0;
  float measuredHumidity = 0.0;

  // Read temperature and humidity from sensor
  // Measure temperature and humidity
  measuredTemp = dht.readTemperature();
  measuredHumidity = dht.readHumidity();

  // Print measured temperature and humidity to serial console
  // Print measurements to the serial console
  Serial.print("Temperature: ");
  Serial.println(measuredTemp);
  Serial.print("Humidity: ");
  Serial.println(measuredHumidity);

  // Add measurement to the linked list
  // Add the measurements to the linked list
  addMeasurement(measuredTemp, measuredHumidity);

  // Calculate average for temperature and humidity
  float averageTemp = calculateAverageTemperature();
  float averageHumidity = calculateAverageHumidity();

  // Print average values to serial console
  Serial.print("Average Temperature (linked list): ");
  Serial.println(averageTemp);
  Serial.print("Average Humidity (linked list): ");
  Serial.println(averageHumidity);

  // Convert the average temperature value to a char array and publish it to MQTT
   char tempString[8];
   dtostrf(averageTemp, 1, 2, tempString); // Corrected: converting average temp

// Create a JSON object for MQTT
  StaticJsonDocument<200> doc;
  doc["temperature"] = measuredTemp;
  doc["humidity"] = measuredHumidity;

  char output[200];
  serializeJson(doc, output);

 /* 
   * Publish real-time temperature and humidity data to the respective MQTT topics 
   * Ensures the data is sent only when valid (i.e., not NaN).
   */
  if (!isnan(measuredTemp) && !isnan(measuredHumidity)) {
    // Send temperature to 'weather/temperature' topic
    // Prepare and publish temperature data to the "weather/temperature" topic
    StaticJsonDocument<200> tempDoc;
    tempDoc["temperature"] = measuredTemp; // Adding temperature to JSON object
     char tempOutput[200];
     serializeJson(tempDoc, tempOutput); // Serialize JSON to char array
    mqttClient.publish("weather/temperature", tempOutput);  // Publish to MQTT Temperature topic

    // Send humidity to 'weather/humidity' topic
    // Prepare and publish humidity data to the "weather/humidity" topic
    StaticJsonDocument<200> humidityDoc;
    humidityDoc["humidity"] = measuredHumidity; // Adding humidity to JSON object
     char humidityOutput[200];
     serializeJson(humidityDoc, humidityOutput); // Serialize JSON to char array
    mqttClient.publish("weather/humidity", humidityOutput);  // Publish to MQTT Humidity topic
  }


  delay(2000);  // Wait before the next loop iteration
}
