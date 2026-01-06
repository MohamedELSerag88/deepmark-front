import http from "./HttpService";
import { getJwt } from "./Admin/AuthService";
import { API_BASE_URL_ENV } from "../helpers/common";

const apiDropdownEndpoint = API_BASE_URL_ENV() + "/admin/settings/dropdown";
const apiUploadEndpoint = API_BASE_URL_ENV() + "/common/upload";
const apiUploadOtherEndpoint =
  API_BASE_URL_ENV() + "/common/upload";

export default class BaseService {
  apiEndpoint;

  constructor(apiEndPoint) {
    http.setJwt(getJwt());
    this.apiEndpoint = apiEndPoint;
  }

  entityUrl(params = []) {
    return `${this.apiEndpoint}/${params.join("/")}`;
  }

  dropDownUrl(model) {
    return `${apiDropdownEndpoint}/${model}`;
  }

  getList(params) {
    return http.get(this.apiEndpoint, { params });
  }

  find(id, params) {
    return http.get(this.entityUrl([id]), { params });
  }

  create(data) {
    return http.post(this.apiEndpoint, data);
  }

  update(id, data) {
    const body = { ...data };
    return http.put(this.entityUrl([id]), body);
  }

  toggleStatus(model, id, params = []) {
    return http.get(this.entityUrl(["toggle-activation", model, id]), { params });
  }

  getDropDown(model, params = []) {
    return http.get(this.dropDownUrl(model), { params });
  }

  remove(id) {
    return http.delete(this.entityUrl([id]));
  }

  postUpload(selectedFile, options) {

    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    return http.post(apiUploadEndpoint, formData, options);
  }
  postUploadOther(selectedFile, options) {
    const formData = new FormData();
    formData.append("selectedFile", selectedFile);
    return http.post(apiUploadOtherEndpoint, formData, options);
  }
}
