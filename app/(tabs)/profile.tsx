import {
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import Logo from "../components/Logo";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Register from "../pages/auth/register";
import Login from "../pages/auth/login";

const profile = () => {
  return <Register />;
};

export default profile;
