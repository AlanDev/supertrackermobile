import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Linking
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Logo from "./Logo";

interface ComerciosModalProps {
  visible: boolean;
  onClose: () => void;
}

const ComerciosModal: React.FC<ComerciosModalProps> = ({ visible, onClose }) => {
  const abrirEnMaps = (direccion: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      direccion
    )}`;
    Linking.openURL(url);
  };

  const negocios = [
    {
      id: 1,
      nombre: "Supermercado Express",
      categoria: "Supermercado",
      direccion: "Avenida 9 de julio 10",
      distancia: "0.5 km",
      horario: "8:00 - 22:00",
      rating: 4.5,
      imagenUrl: "https://img.freepik.com/free-photo/shopping-cart-supermarket_23-2148879372.jpg?size=626&ext=jpg"
    },
    {
      id: 2,
      nombre: "Farmacia Salud",
      categoria: "Farmacia",
      direccion: "Calle Central 456",
      distancia: "0.8 km",
      horario: "24 horas",
      rating: 4.2,
      imagenUrl: "https://img.freepik.com/free-photo/pharmacist-with-tablet-standing-pharmacy-counter_107420-83608.jpg?size=626&ext=jpg"
    },
    {
      id: 3,
      nombre: "Tienda Electrónica",
      categoria: "Electrónica",
      direccion: "Plaza Comercial 789",
      distancia: "1.2 km",
      horario: "9:00 - 20:00",
      rating: 4.0,
      imagenUrl: "https://img.freepik.com/free-photo/electronic-devices-balancing-concept_23-2150422322.jpg?size=626&ext=jpg"
    },
    {
      id: 4,
      nombre: "Cafetería Aroma",
      categoria: "Cafetería",
      direccion: "Av. del Parque 234",
      distancia: "0.3 km",
      horario: "7:00 - 21:00",
      rating: 4.8,
      imagenUrl: "https://img.freepik.com/free-photo/people-cafe-drinking-coffee_23-2149004692.jpg?size=626&ext=jpg"
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black bg-opacity-50">
        <View className="flex-1 bg-purple-50">
          <View className="px-6 py-8">
            <View className="flex-row items-center justify-between mb-6">
              <Logo/>
              <Pressable 
                onPress={onClose}
                className="bg-white p-3 rounded-full shadow-sm"
              >
                <Ionicons name="close" size={24} color="#8b5cf6" />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-semibold text-2xl text-gray-800">
                Comercios cercanos
              </Text>

              <Pressable className="py-1">
                <Text className="text-base font-medium text-purple-600">
                  Ver todos
                </Text>
              </Pressable>
            </View>

            <ScrollView>
              {negocios.map((negocio) => (
                <View
                  key={negocio.id}
                  className="bg-white shadow-sm border border-gray-100 rounded-xl mb-4 overflow-hidden"
                >
                  <Image
                    source={{ uri: negocio.imagenUrl }}
                    style={{ width: "100%", height: 140 }}
                    className="bg-gray-200"
                  />
                  
                  <View className="p-4">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-bold text-lg text-gray-800">{negocio.nombre}</Text>
                      <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full">
                        <Ionicons name="star" size={14} color="#f59e0b" />
                        <Text className="text-amber-600 font-medium ml-1">{negocio.rating}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center mb-1">
                      <View className="bg-purple-100 px-2 py-1 rounded-full mr-2">
                        <Text className="text-purple-700 text-xs">{negocio.categoria}</Text>
                      </View>
                      <View className="bg-blue-100 px-2 py-1 rounded-full">
                        <Text className="text-blue-700 text-xs">{negocio.distancia}</Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <Pressable 
                        onPress={() => abrirEnMaps(negocio.direccion)}
                        className="flex-row items-center mb-2"
                      >
                        <Ionicons name="location-outline" size={16} color="#8b5cf6" />
                        <Text className="text-purple-600 ml-1 underline">
                          {negocio.direccion}
                        </Text>
                      </Pressable>

                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={16} color="#374151" />
                        <Text className="text-gray-700 ml-1">
                          {negocio.horario}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row mt-4">
                      <Pressable className="bg-purple-600 rounded-lg flex-1 py-3 mr-2">
                        <Text className="text-white font-medium text-center">
                          Ver detalles
                        </Text>
                      </Pressable>
                      
                      <Pressable className="bg-white border border-purple-500 rounded-lg py-3 px-4">
                        <Ionicons name="navigate" size={20} color="#8b5cf6" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
              
              <Pressable className="bg-white rounded-xl border border-purple-500 p-4 mb-6">
                <Text className="text-purple-600 font-medium text-center">Cargar más comercios</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ComerciosModal; 