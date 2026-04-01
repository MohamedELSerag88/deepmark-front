import http from "../HttpService";
import { getJwt } from "./AuthService";
import { API_BASE_URL_ENV } from "../../helpers/common";

const baseUrl = API_BASE_URL_ENV() + "/admin/meetings";

export default class MeetingsService {
  constructor() {
    // Ensure Authorization header is set for admin APIs
    http.setJwt(getJwt());
  }
  list(params = {}) {
    return http.get(baseUrl, { params });
  }
  update(id, data) {
    return http.put(`${baseUrl}/${id}`, data);
  }
}

