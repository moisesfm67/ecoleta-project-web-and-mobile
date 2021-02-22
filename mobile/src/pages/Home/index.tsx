import React, { useState, useEffect, ChangeEvent } from "react";
import { Picker } from "@react-native-picker/picker";
import { Feather as Icon } from "@expo/vector-icons";
import { View, ImageBackground, Image, StyleSheet, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const Home = () => {
  const navigation = useNavigation();

  interface IBGEUFResponse {
    sigla: string;
  }

  interface IBGECityResponse {
    nome: string;
  }

  const [ufs, setUfs] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);

        setCity(cityNames);
        setSelectedCity(cityNames[0]);
      });
  }, [selectedUf]);

  function handleSelectUf(value: any) {
    const uf = value;

    setSelectedUf(uf);
  }

  function handleSelectCity(value: any) {
    const city = value;

    setSelectedCity(city);
  }

  function handleNavigationToPoints() {
    navigation.navigate("Points", {
      selectedUf,
      selectedCity,
    });
  }

  console.log("uf ", selectedUf, " city ", selectedCity);

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>
      <Picker
        style={styles.select}
        selectedValue={selectedUf}
        onValueChange={handleSelectUf}
      >
        {ufs.map((uf) => (
          <Picker.Item label={uf} value={uf} key={uf} />
        ))}
      </Picker>

      <Picker
        style={styles.select}
        selectedValue={selectedCity}
        onValueChange={handleSelectCity}
      >
        {city.map((city) => (
          <Picker.Item label={city} value={city} key={city} />
        ))}
      </Picker>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
