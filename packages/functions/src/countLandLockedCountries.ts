import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const countryData = event.Payload.body;
  const landLockedCountries = countryData.filter((country: any) => country.landlocked === true);

  return {
    statusCode: 200,
    body: landLockedCountries.length,
  };
};