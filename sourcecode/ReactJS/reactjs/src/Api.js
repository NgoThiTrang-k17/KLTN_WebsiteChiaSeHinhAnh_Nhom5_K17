export const getAllPost = async post => {

    const response = await fetch(
      `http://localhost:5000/Posts`,
    );
    const r = await response.json();
    return r;
  };