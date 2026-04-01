import http from "../HttpService";
import { getJwt } from "./AuthService";
import { API_BASE_URL_ENV } from "../../helpers/common";

const baseUrl = API_BASE_URL_ENV() + "/admin/questions";

export default class QuestionsService {
  constructor() {
    http.setJwt(getJwt());
  }
  list(params = {}) {
    return http.get(baseUrl, { params });
  }
  create(data) {
    return http.post(baseUrl, data);
  }
  update(id, data) {
    return http.put(`${baseUrl}/${id}`, data);
  }
  remove(id) {
    return http.delete(`${baseUrl}/${id}`);
  }
}

