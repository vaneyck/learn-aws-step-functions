import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const getRandomBooleanValue = () => { return Math.random() > 0.5 ? true : false; }
  const numberOfCountries = Math.round(Math.random() * 1000);

  let fakeData = [];
  for (var x = 0; x < numberOfCountries; x++) {
    fakeData.push({ landlocked: getRandomBooleanValue(), unMember: getRandomBooleanValue() });
  }

  return {
    statusCode: 200,
    body: fakeData,
  };
};