import http from "../HttpService";
import { getJwt } from "./AuthService";
import { API_BASE_URL_ENV } from "../../helpers/common";

const baseUrl = API_BASE_URL_ENV() + "/admin/ai-prompts";

export default class AiPromptsService {
  constructor() {
    http.setJwt(getJwt());
  }

  list() {
    return http.get(baseUrl);
  }

  get(key) {
    return http.get(`${baseUrl}/${key}`);
  }

  update(key, data) {
    return http.put(`${baseUrl}/${key}`, data);
  }
}
