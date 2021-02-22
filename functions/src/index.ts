import callableAction from "./callableAction";
export const CallableAction = callableAction(({row, callableData, context}) =>{
  const {ref, column, schemaDocPath, action} = callableData;
  console.log({
    row, // docSnapshot of the called column
    context, // callable context contains data such as the time and the user running the action
    ref, // contains document id and other references related to the row
    column, // contains key of the action column
    schemaDocPath, // table schema Doc Path
    action, // latest action state
  });

  // switch statement can be used to perform different event based on the state of the action cell
  switch (action) {
    case "run":
    case "undo":
    case "redo":
    default:
      break;
  }


  return {success: true, // return if the operation was success
    message: "hello world", // message shown in snackbar on the firetable ui after the completion of action
    cellStatus: "greeted", // optional cell label, to indicate the latest state of the cell/row
    newState: "disabled", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
  };
});
