import React, { useState } from "react";
import { View, Text,TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import * as SMS from "expo-sms";

const emergencyContacts = [
  '+918076603037',
  '+917905522954',
  '+918178986672',
]

export default function App() {
  const [location, setLocation] = useState(null);

  const handleHelpPress = async () => {
    //Request location permissions

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location access is required to notify friends."
      );
      return;
    }

    //Get the current location
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation(currentLocation);

    const { latitude, longitude } = currentLocation.coords;
    console.log(latitude, longitude);

    //URL encode the coordinates to handle special characters
    const encodedLatitude = encodeURIComponent(latitude);
    const encodedLongitude = encodeURIComponent(longitude);
    const encodedCoordinates = `${encodedLatitude}%2C${encodedLongitude}`;

    // Create the message with the encoded coordinates
    const message = `Emergency! I need help. My location: https://maps.google.com/?q=${encodedCoordinates}`;

    //Send SMS to all emergency contacts
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      try {

        for(const contact of emergencyContacts){
          await SMS.sendSMSAsync([contact], message);
        }

        Alert.alert("Help Sent!", "Your friend has been notified.");
      } catch (error) {
        Alert.alert("Error", "Something went wrong while sending the message.");
      }
    } else {
      Alert.alert("Error", "SMS is not available on this device.");
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Emergency Alert</Text>
      <TouchableOpacity style= {styles.emergencyButton} onPress={handleHelpPress}>
        <Text style={styles.buttonText}>HELP</Text>
      </TouchableOpacity>
      {/* <Button title="HELP" onPress={handleHelpPress} color="#d9534f" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#333",
  },
  emergencyButton: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',

  },
});
