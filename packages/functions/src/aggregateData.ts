import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const countUnMembers = event[0].Payload.body;
  const countLandLocked = event[1].Payload.body;

  const aggregateData = {
    unMembers: countUnMembers,
    landLocked: countLandLocked,
  };

  return {
    statusCode: 200,
    body: aggregateData,
  };
};