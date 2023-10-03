export const getProducts = async () => {
  try {
    return await axios.get(`http://localhost:8000/api/products`);
  } catch (error) {
    console.log("error has been occured");
  }
};
