#include<ESP8266WiFi.h>
#include<DHT.h>
#include <FirebaseESP8266.h>


#define FIREBASE_HOST "https://netzerox-6948e-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "cad93ce1dfd2bfdd03766a4d202ddaba489f70cf"

FirebaseData firebaseData;

#define DHTPIN D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define IR_SENSOR D3

#define LED D2

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Firebase.reconnectWiFi(true);

    dht.begin();
    pinMode(IR_SENSOR, INPUT);
    pinMode(LED, OUTPUT);
}

void loop() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int motion = digitalRead(IR_SENSOR);
    
    Serial.print("Temp: "); Serial.print(temperature);
    Serial.print(" | Humidity: "); Serial.print(humidity);
    Serial.print(" | Motion: "); Serial.println(motion);

    Firebase.setFloat(firebaseData, "/sensor/temperature", temperature);
    Firebase.setFloat(firebaseData, "/sensor/humidity", humidity);
    Firebase.setInt(firebaseData, "/sensor/IR", motion);

    if (temperature > 30 || motion == 1) {
        digitalWrite(LED, HIGH);
    } else {
        digitalWrite(LED, LOW);
    }

    delay(5000); 
}
