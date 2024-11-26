Weather Station Project

This project demonstrates a real-time weather station application. It consists of three main components:

Arduino Code: Captures temperature and humidity data using a DHT11 sensor and publishes it to an MQTT broker. 
Backend: Handles MQTT communication, stores data in a MongoDB database, and serves real-time updates to clients through WebSockets.
Frontend: A React-based web interface to display real-time temperature and humidity data along with a history of measurements.

Arduino Code Setup

1. Hardware:

  ESP32 microcontroller
  DHT11 sensor
  Breadboard
  Jumper wires
  Proper wiring:
    VCC of DHT11 to 3.3V of ESP32
    GND of DHT11 to GND of ESP32
    DATA of DHT11 to a GPIO pin (e.g., GPIO22 in the code).

2. Software:

  - Arduino IDE (latest version)
  ESP32 Board Package:
    Install the ESP32 board package via Tools > Board > Boards Manager.
  - Install required libraries via the Arduino Library Manager (Tools > Manage Libraries):
    WiFi by Arduino
    PubSubClient by Nick O’Leary
    DHT sensor library by Adafruit
    ArduinoJson by Benoît Blanchon

3. Upload Code:

  Modify the ssid and password fields in the Arduino code to match your Wi-Fi credentials.
  Set the correct GPIO pin for the DHT11 sensor (DHTPIN).
  Set the mqtt_server variable to your MQTT broker remote IP. "Check below in the Backend Setup section => Setup => MQTT Broker" to know how and from where to get this IP address.
  Select the correct ESP32 board and COM port in the Arduino IDE.
  Upload the code to the ESP32.

-----------------------------------------------------------------------------------------------------------------------

Backend Setup

1. Software:

  Node.js (Latest stable version)
  MongoDB (For data storage): Download here
    Install MongoDB Community Edition to set up a local database.
    Install MongoDB Compass for an easy graphical interface to manage the database.
  MQTT Broker: Use Mosquitto or another MQTT broker.
    Use Mosquitto as the MQTT broker. It can be installed on a virtual machine running Ubuntu.
    Install MQTT Explorer to test and debug MQTT topics.
  Virtual Machine (recommended for Mosquitto):
    Use a virtual machine (e.g., VirtualBox or VMware) with Ubuntu to set up the Mosquitto broker.
    Commands to install Mosquitto broker on Ubuntu:
      sudo apt update
      sudo apt install mosquitto mosquitto-clients
      sudo systemctl enable mosquitto
      sudo systemctl start mosquitto
    Configure Mosquitto with username and password:
      Create a password file: sudo mosquitto_passwd -c /etc/mosquitto/passwd mqtt_user
      Edit the Mosquitto configuration file: sudo nano /etc/mosquitto/mosquitto.conf
      Add the following to mosquitto.conf:
        allow_anonymous false
        password_file /etc/mosquitto/passwd
      Restart Mosquitto: sudo systemctl restart mosquitto

  
2. Setup:

  Install dependencies:
    npm install
  Use MongoDB Compass for a graphical interface to monitor the database.
  MQTT Broker:
    Ensure the Mosquitto broker is running.
    Get the remote server IP by running this command in ubuntu cli: ip a
    Connect to your MQTT broker with the remote server IP.
    In /weatherstation/server/src/services/mqttClient.ts need to replace with the remote server ip to this line: const mqttClient = mqtt.connect("mqtt://here the remote server ip:1883");
    Also in /weatherstation/server/src/index.ts replace with the remote server ip to this line: console.log(`Server listening on http://here the remote server ip:${port}`); 
  Start the backend server:
    At this directory /weatherstation/server, start the server by running this command: npm start
  The server will:
    Subscribe to the MQTT broker for temperature and humidity topics.
    Store incoming data in the MongoDB database.
    Serve real-time updates via WebSocket and historical data via REST API.

-----------------------------------------------------------------------------------------------------------------------

Frontend Setup

1. Software:

  Visual Studio Code
  Node.js (Latest stable version)
  Vite (for React with TypeScript)

2. Setup:

  Install dependencies: npm install
  Ensure the backend server is running.

3. Run the Frontend:

   At the frontend directory /weatherstation/client, run this command: npm run dev
   Access the web app at http://localhost:5173

-----------------------------------------------------------------------------------------------------------------------

Project Architecture

1. Arduino (ESP32):

  Captures temperature and humidity data using the DHT11 sensor.
  Publishes data to the MQTT broker on weather/temperature and weather/humidity topics.
  
2. Backend:

  Subscribes to the MQTT topics to receive data from the ESP32.
  Stores data in a MongoDB database.
  Serves real-time data to the frontend using WebSockets.
  Provides historical data via a REST API (/api/temperature-history).
  
3. Frontend:

  Displays real-time temperature and humidity readings.
  Shows the latest history of recorded measurements.
  Updates the UI dynamically using WebSocket and Axios requests.

-----------------------------------------------------------------------------------------------------------------------

Notes

  For any issues, check:
    Serial Monitor in Arduino IDE for ESP32 logs.
    Backend logs for errors in MQTT or MongoDB operations.
    Browser console for frontend issues.
