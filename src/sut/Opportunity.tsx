import React from "react";
import "../Opportunity.css";
import Button from "@material-ui/core/Button";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";



const getOpportunityMachineDefinition = () => ({
  id: "opportunity",
  initial: "prospect",
  states: {
    prospect: { on: { AUTHOR: "authoring" } },
    authoring: { on: { COMPLETE: "completed" } },
    completed: {},
  },
});

const Opportunity: React.FC = () => {
  const [orderMachineState, send] = useMachine(
    Machine(getOpportunityMachineDefinition())
  );

  return (
    <div className="container">
      <h1>{orderMachineState.value}</h1>
      <div className="buttons">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => send("AUTHOR")}
        >
          Author Opportunity
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => send("COMPLETE")}
        >
          Complete Opportunity
        </Button>
      </div>
    </div>
  );
};

export default Opportunity;
export { getOpportunityMachineDefinition };
