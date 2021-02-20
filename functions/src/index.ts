import callableActionWrapper from "./callableWrapper";

export const wrappedAction = callableActionWrapper(async ({row}) =>{
  return {success: true, message: `wrapped successfully ${row.code}`};
});

