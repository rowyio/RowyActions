import callableAction from "./callableAction";
export const CallableAction = callableAction(({row,callableData,context}) =>{
  const {ref, column, schemaDocPath,action} = callableData;
  console.log({
    row, // docSnapshot of the called column
    context, // callable context contains data such as the time and the user running the action
    ref, // contains document id and other references related to the row
    column, // contains key of the action column
    schemaDocPath, // table schema Doc Path
    action // latest action state  
  })
  return {success: true, message: "hello world"};
});

