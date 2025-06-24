import Echo from "laravel-echo";
import Pusher from "pusher-js";

// تفعيل Pusher
window.Pusher = Pusher;

const setupEcho = (token) => {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: process.env.REACT_APP_PUSHER_KEY, // مثال: abcd1234
    cluster: process.env.REACT_APP_PUSHER_CLUSTER, // مثال: mt1
    forceTLS: true,
    authEndpoint: "https://sienna-woodpecker-844567.hostingersite.com/broadcasting/auth",  // endpoint إن وُجد
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
};

export default setupEcho;