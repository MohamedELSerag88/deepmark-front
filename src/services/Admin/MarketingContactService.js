import http from "../HttpService";
import { getJwt } from "./AuthService";
import { API_BASE_URL_ENV } from "../../helpers/common";

const baseUrl = API_BASE_URL_ENV() + "/admin/marketing/contact-submissions";

export default class MarketingContactService {
  constructor() {
    http.setJwt(getJwt());
  }
  list(params = {}) {
    return http.get(baseUrl, { params });
  }
  update(id, data) {
    return http.put(`${baseUrl}/${id}`, data);
  }
  remove(id) {
    return http.delete(`${baseUrl}/${id}`);
  }
}
