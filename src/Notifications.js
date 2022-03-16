// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { requestForToken } from "./firebase.js";

const Notifications = (props) => {
  const [ setTokenFound] = useState(false);

  // To load once
  useEffect(() => {
    let data;

    async function tokenFunc() {
      data = await requestForToken(setTokenFound);
      if (data) {
        console.log("Token is", data);
      }
      return data;
    }

    tokenFunc();
  }, [setTokenFound]);

  return <></>;
};

Notifications.propTypes = {};

export default Notifications;