import { View, Text, ImageBackground, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/UI/Header";
import Cards from "../components/UI/Cards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppContext } from "../context/UserContext";
const RewardsScreen = () => {
  const [rewards, setRewards] = useState();
  const { coin, setCoin, token } = useAppContext();
  useEffect(() => {
    async function fetchRewardsByInterest() {
      console.log(token);
      await axios
        .get(`http://192.168.106.45:8000/api/v1/reward/fetch-reward-interest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setRewards(res.data.data);
        })
        .catch((err) => {
          console.log("Reward By Interest Error :", err);
        });
    }
    fetchRewardsByInterest();
  }, []);

  async function postCompleteReward(data) {
    await axios
      .post(
        `http://192.168.106.45:8000/api/v1/reward/reward-completed`,
        { reward_id: data._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Reward screen", res.data.data);
        setCoin(res.data.data.coins);
      })
      .catch((err) => {
        console.log("Complete_Reward_Error :", err);
      });
  }
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
      source={require("../assets/backgroundGradient.png")}
    >
      <Header />
      <ScrollView>
        {rewards &&
          rewards.map((data, i) => (
            <Cards
              onPress={(e) => postCompleteReward(data)}
              key={i}
              title={data.title}
              bg_color={data.bg_color}
              description={data.description}
              imageUrl={data.image}
            />
          ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default RewardsScreen;
