#include <SPI.h>
#include <WiFly.h>
#include <Servo.h>
#include "Credentials.h"

boolean conected = false;
Servo s1, s2, s3, s4;
float general = 500;
float spead = 400;
String h = "";
String p = "";
int timer = 0;
int timeLimit = 10;

WiFlyClient client("fii.to", 3000);

/////////////////////////////////////////
/////////////////////////////////////////

void setup() {
  Serial.begin(9600);
  s1.attach(3);
  s2.attach(5);
  s3.attach(6);
  centerServos();
  delay(2000);
}

/////////////////////////////////////////
/////////////////////////////////////////

void loop() {
  if (timer == 0) {
    if (conected == false) {
      auth();
      h = conectToServer("wave-h ");
      p = conectToServer("wave-p ");
      spead = map(h.toFloat(), 0.0, 3.0, 700.0, 300.0);
      general = map(p.toFloat(), 0.0, 10.0, 0, 1000);
      Serial.println(h);
      Serial.println(p);
      Serial.println(spead);
      Serial.println(general);
    } else {
      timer++;
    }
  } else {
    wave1();
    wave2();
    wave3();
    timer++;
    if (timer == timeLimit) {
      timer = 0;
    }
  }
}delay(1000);

/////////////////////////////////////////
/////////////////////////////////////////

void auth() {
  WiFly.begin();
  if (!WiFly.join(ssid, passphrase)) {
    Serial.println("Association failed.");
    conected = false;
  } else {
    Serial.println("connecting...");
    conected = true;
  }
}

/////////////////////////////////////////
/////////////////////////////////////////

String conectToServer(String q) {
  if (client.connect()) {
    Serial.println("connected");
    client.print("GET /");
    client.print(q);
    client.println("HTTP/1.0");
    client.println();

    String waveData = "";
    int index;
    String data = "";

    if (client.connected()) {
      data = client.readStringUntil(';');
      index = data.indexOf('$');
      int arraysize = data.length();
      char inChar[arraysize];
      data.toCharArray(inChar, arraysize);

      for (int i = index + 1; i < sizeof(inChar); i++) {
        //Serial.print(inChar[i]);
        waveData += inChar[i];
      }
    }

    Serial.println(waveData);

    if (!client.connected()) {
      Serial.println();
      Serial.println("disconnecting.");
      client.stop();
      delay(1000);
      conected = false;
    }

    return waveData;

  } else {
    Serial.println("connection failed");
    return "1.0";
  }
  delay(1000);
}

/////////////////////////////////////////
/////////////////////////////////////////

void wave1() {
  int pos = 0;
  int l = 95;
  int r = 80;

  for (pos = r; pos <= l; pos += 1)
  {
    s1.write(pos);
    delay(spead);
  }
  delay(general);
  for (pos = l; pos >= r; pos -= 1)
  {
    s1.write(pos);
    delay(spead);
  }
  delay(general);
}

///////////////////////////
///////////////////////////

void wave2() {
  int pos = 0;
  int r = 98;
  int l = 85;

  for (pos = l; pos <= r; pos += 1)
  {
    s2.write(pos);
    delay(spead);
  }
  delay(general);
  for (pos = r; pos >= l; pos -= 1)
  {
    s2.write(pos);
    delay(spead);
  }
  delay(general);
}

///////////////////////////
///////////////////////////

void wave3() {
  int pos = 0;
  int l = 96;
  int r = 84;

  for (pos = r; pos <= l; pos += 1)
  {
    s3.write(pos);
    delay(spead);
  }
  delay(general);
  for (pos = l; pos >= r; pos -= 1)
  {
    s3.write(pos);
    delay(spead);
  }
  delay(general);
}

///////////////////////////
///////////////////////////

void centerServos() {
  s1.write(90);
  s2.write(90);
  s3.write(90);
  delay(2000);

}

