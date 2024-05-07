import { StackContext, Api, Function } from "sst/constructs";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Chain, Parallel, StateMachine } from "aws-cdk-lib/aws-stepfunctions";


export function MyStack({ stack }: StackContext) {
  const callCountryApiTask = new LambdaInvoke(stack, "callCountryApiTask", {
    lambdaFunction: new Function(stack, "callCountryApiTask-function", {
      handler: "packages/functions/src/callCountryApi.handler",
    }),
  });

  const countUnitedNationMembers = new LambdaInvoke(stack, "countUnitedNationMembers", {
    lambdaFunction: new Function(stack, "countUnitedNationMembers-func", {
      handler: "packages/functions/src/countUnitedNationMembers.handler",
    }),
  });

  const countLandLockedCountries = new LambdaInvoke(stack, "countLandLockedCountries", {
    lambdaFunction: new Function(stack, "countLandLockedCountries-func", {
      handler: "packages/functions/src/countLandLockedCountries.handler",
    }),
  });

  const aggregateData = new LambdaInvoke(stack, "aggregateData", {
    lambdaFunction: new Function(stack, "aggregateData-func", {
      handler: "packages/functions/src/aggregateData.handler",
    }),
  });

  // the creation of the chain of states
  const parallel = new Parallel(stack, "ParallelCompute");

  const stateDefinition = Chain.start(callCountryApiTask)
    .next(parallel.branch(countUnitedNationMembers).branch(countLandLockedCountries))
    .next(aggregateData);

  // the actual state machine with its name and its definition = its states and transitions
  const stateMachine = new StateMachine(stack, "StateMachineExample", {
    definition: stateDefinition,
  });

  const api = new Api(stack, "api", {
    routes: {
      "GET /start-machine": {
        function: {
          handler: "packages/functions/src/startMachine.handler",
          environment: {
            STATE_MACHINE: stateMachine.stateMachineArn
          }
        }
      },
    },
  });

  // Give our route the permission to start the state machine
  api.attachPermissionsToRoute("GET /start-machine", [
    [stateMachine, "grantStartExecution"],
  ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
