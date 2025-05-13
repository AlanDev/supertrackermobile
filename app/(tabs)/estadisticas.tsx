import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { Svg, Circle, Rect } from "react-native-svg";
import Logo from "../components/Logo";


const estadisticas = () => {
  

  return (
    <View className="flex-1 bg-purple-50">
      <ScrollView>
        <View className="px-6 py-8">
        <Logo/>


          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-semibold text-2xl text-gray-800">
              Estadísticas
            </Text>

            <Pressable className="bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
              <Text className="text-base font-medium text-purple-600">
                Este mes
              </Text>
            </Pressable>
          </View>

          
        </View>
      </ScrollView>
    </View>
  );
};

export default estadisticas;

const styles = StyleSheet.create({});
