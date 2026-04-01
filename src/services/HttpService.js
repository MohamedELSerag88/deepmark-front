import axios from "axios";
import { toast } from "react-toastify";
// import https from "https";
import {
  // adminPrefix,
  // providerPrefix,
  // studentPrefix,
} from "../configs/routePrefix";

axios.defaults.headers.common["accept-language"] = "en";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
// axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

axios.interceptors.response.use(null, async (error) => {
  const status = error?.response?.status;
  const expectedError =
    error?.response &&
    status >= 401 &&
    status < 500;

  // Redirect to admin login on Unauthorized
  if (status === 401) {
    try {
      const AdminAuth = await import("./Admin/AuthService");
      AdminAuth.logout();
    } catch (_) {}
    try {
      const { adminPrefix } = await import("../configs/routePrefix");
      window.location = `${adminPrefix}/login`;
    } catch (_) {
      window.location = "/admin/login";
    }
    return Promise.reject(error);
  }

  if (!error?.message) {
    // no-op
  } else if (!expectedError) {
    toast.error("An unexpected error occurred.");
  } else {
    const msg = error?.response?.data?.error || error?.message;
    if (msg) toast.error(msg);
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};