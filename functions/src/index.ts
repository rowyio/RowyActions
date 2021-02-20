import callableAction from "./callableAction";
export const wrappedAction = callableAction(() =>{
  return {success: true, message: "hello world"};
});

