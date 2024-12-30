import React, { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface ImagePickerProps {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

// Modify the component to accept props
export default function ImagePicker({ image, setImage }: ImagePickerProps) {
  const pickImage = async () => {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.removeIcon} onPress={removeImage}>
            <MaterialIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
          <Text style={styles.plusSign}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  plusSign: {
    fontSize: 40,
    color: "#888",
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  removeIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 2,
  },
});
