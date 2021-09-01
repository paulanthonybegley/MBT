import { createModel } from "@xstate/test";
import { Machine } from "xstate";
import Opportunity, { getOpportunityMachineDefinition } from "./Opportunity";
import { render, RenderResult, fireEvent, wait } from "@testing-library/react";
import React from "react";


const getEventConfigs = () => {
  const eventConfigs = {
    AUTHOR: {
      exec: async ({ getByText }: RenderResult) => {
        fireEvent.click(getByText("Author Opportunity"));
      },
    },
    COMPLETE: {
      exec: async ({ getByText }: RenderResult) => {
        fireEvent.click(getByText("Complete Opportunity"));
      },
    },
  };

  return eventConfigs;
};

const prospectTest = {
  test: async ({ getByText }: RenderResult) => {
    await wait(() => expect(() => getByText("prospect")).not.toThrowError());
  },
};
const authoringTest = {
  test: async ({ getByText }: RenderResult) => {
    await wait(() => expect(() => getByText("authoring")).not.toThrowError());
  },
};
const completedTest = {
  test: async ({ getByText }: RenderResult) => {
    await wait(() => expect(() => getByText("completed")).not.toThrowError());
  },
};

describe("Opportunity", () => {
  describe("matches all paths", () => {
    const testMachineDefinition = getOpportunityMachineDefinition();

    (testMachineDefinition.states.prospect as any).meta = prospectTest;
    (testMachineDefinition.states.authoring as any).meta = authoringTest;
    (testMachineDefinition.states.completed as any).meta = completedTest;

    const testMachine = Machine(testMachineDefinition);

    const testModel = createModel(testMachine).withEvents(
      getEventConfigs() as any
    );

    const testPlans = testModel.getShortestPathPlans();

    testPlans.forEach((plan) => {
      describe(plan.description, () => {
        plan.paths.forEach((path) => {
          it(path.description, async () => {
            await path.test(render(<Opportunity />));
          });
        });
      });
    });

    it("should have full coverage", () => {
      return testModel.testCoverage();
    });
  });
});
