import { AUTH_LOGIN, AUTH_ERROR, AUTH_LOGOUT, AUTH_CHECK } from "react-admin";

export default (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const request = new Request("", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    return fetch(request)
      .then((response) => {
        console.log(response);
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ token }) => {
        console.log({ token }, username);
        localStorage.setItem("auth-token", token);
        localStorage.setItem("username", username);
      });
  }

  if (type === AUTH_LOGOUT) {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("username");
    return Promise.resolve();
  }
  if (type === AUTH_ERROR) {
    const status = params.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  }
  if (type === AUTH_CHECK) {
    return localStorage.getItem("auth-token")
      ? Promise.resolve()
      : Promise.reject();
  }
  return Promise.resolve();
};
