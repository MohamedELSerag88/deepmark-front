import BaseService from "../BaseService";
import { API_BASE_URL_ENV } from "../../helpers/common";

const baseUrl = API_BASE_URL_ENV() + "/admin/users";

export default class UsersService extends BaseService {
  constructor() {
    super(baseUrl);
  }
  export() {
    return this.getList.call({ apiEndpoint: baseUrl + "/export" }, {});
  }
  exportDownload() {
    // raw CSV download (blob)
    return import("../HttpService").then(({ default: http }) =>
      http.get(baseUrl + "/export/download", {
        responseType: "blob",
        headers: { Accept: "text/csv" },
      })
    );
  }
  projects(userId, params = {}) {
    return this.getList.call({ apiEndpoint: `${baseUrl}/${userId}/projects` }, params);
  }
}

