# Rowy Actions


This package provides a firebase cloud functions project with a callable cloud function wrapper that handles role permission and the required fields validation for [Rowy](https://github.com/rowyio/rowy) action columns.

## Installation

```
yarn add rowy-actions
```

## Usage

This library can be used as an alternative to directly using [functions.https.onCall](https://firebase.google.com/docs/reference/functions/providers_https_#oncall) function to deploy a callable cloud functions for use in [Rowy](https://github.com/rowyio/rowy) [action fields](https://github.com/rowyio/rowy/wiki/Field-Types).
It can be installed and used in an existing firebase cloud functions project

```javascript 
// import and intialize firebase admin SDK
import * as admin from "firebase-admin";
admin.initializeApp();


import callableAction from "rowy-actions";
export const ExampleCallableAction = callableAction(async ({row, callableData, context}) =>{
  const {ref, column, schemaDocPath, action} = callableData;
  console.log({
    row, // docSnapshot of the called column
    context, // callable context contains data such as the time and the user running the action
    ref, // contains document id and other references related to the row
    column, // contains key of the action column
    schemaDocPath, // table schema Doc Path
    action, // latest action state
  });

  // switch statement can be used to perform different processes based on the state of the action cell
  switch (action) {
    case "run":
    case "undo":
    case "redo":
    default:
      break;
  }

  return {
    success: true, // return if the operation was success
    message: "hello world", // message shown in snackbar on Rowy after the completion of action
    cellStatus: "greeted", // optional cell label, to indicate the latest state of the cell/row
    newState: "redo", // "redo" | "undo" | "disabled" are options set the behavior of action button next time it runs
  };
});


```




## Demo

To experiment with this package you can clone this repo then modify the example [here](https://github.com/rowyio/RowyActions/blob/master/functions/src/index.ts).

```
git clone https://github.com/rowyio/RowyActions
cd RowyActions/functions
yarn install
firebase deploy --only functions --project [projectId]
```
