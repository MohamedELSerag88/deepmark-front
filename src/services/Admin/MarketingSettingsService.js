import http from "../HttpService";
import { getJwt } from "./AuthService";
import { API_BASE_URL_ENV } from "../../helpers/common";

const baseUrl = API_BASE_URL_ENV() + "/admin/marketing";

export default class MarketingSettingsService {
  constructor() {
    http.setJwt(getJwt());
  }
  get() {
    return http.get(`${baseUrl}/settings`);
  }
  update(data) {
    return http.put(`${baseUrl}/settings`, data);
  }
}
