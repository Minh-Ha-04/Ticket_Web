import axios from "axios";


let setLoadingGlobal: ((value: boolean) => void) | null = null;


export const registerSetLoading = (fn: (value: boolean) => void) => {
  setLoadingGlobal = fn;
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 500000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    // bật loading
    if (setLoadingGlobal) setLoadingGlobal(true);

    // gắn token
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return response;
  },
  (error) => {
    if (setLoadingGlobal) setLoadingGlobal(false);

    const status = error.response?.status;

    if (status === 401) {
      // Chỉ xóa token khi server trả 401 (token hết hạn/không hợp lệ)
      // Không xóa khi lỗi mạng (error.response === undefined)
      if (error.response) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  }
);


export default instance;
