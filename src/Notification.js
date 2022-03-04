import React, {useState, useEffect} from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from './firebase';

const Notification = () => {
  const [notification, setNotification] = useState({title: '', body: ''});

  const notify = () =>  toast(<ToastDisplay/>); 
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };

  useEffect(() => {
    console.log(notification);
    if (notification?.title ){
      console.log("Notification notify");
     notify()
    }
  }, [notification])

  requestForToken();

  onMessageListener()
    .then((payload) => {
      console.log(payload);
      setNotification({title: payload?.notification?.title, body: payload?.notification?.body});     
    })
    .catch((err) => console.log('ERROR: Notification listener failed: ', err));

  return (
     <Toaster/>
  )
}

export default Notification