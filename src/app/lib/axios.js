import api from "./api";

const axios = async (url, options = {}) => {
  try {
    const response = await api(url, options);
    return response;
  } catch (error) {
    throw error;
  }
};

export default axios;
