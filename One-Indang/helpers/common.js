import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

const hp = (percentage) => {
  return (percentage * deviceHeight) / 100;
};

const wp = (percentage) => {
  return (percentage * deviceWidth) / 100;
};

export { hp, wp }; //responsive dimension
