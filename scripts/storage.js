import AsyncStorage from "@react-native-async-storage/async-storage";

export const getWakeReason = async () => {
  return await AsyncStorage.getItem("wakeReason");
};