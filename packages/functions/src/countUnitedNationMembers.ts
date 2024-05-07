import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const countryData = event.Payload.body;
  const unMembers = countryData.filter((country: any) => country.unMember === true);

  return {
    statusCode: 200,
    body: unMembers.length,
  };
};