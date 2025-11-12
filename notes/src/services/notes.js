// import axios so we can make HTTP requests
import axios from "axios";

// this is the base URL for the backend that handles notes
const baseUrl = "http://localhost:3001/api/notes";

// get all notes from the server
const getAll = () => {
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: 10000,
    content: "This note is not saved to server",
    important: true,
  };
  return request.then((response) => response.data.concat(nonExisting));
};

// add a new note to the server
const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

// update an existing note by its id
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

// export the functions so other files can use them
export default {
  getAll,
  create,
  update,
};
