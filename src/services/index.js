import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com" // defining base url for requests
});

export default api;
