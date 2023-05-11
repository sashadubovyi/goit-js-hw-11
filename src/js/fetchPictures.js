import axios from 'axios';

export async function fetchPictures({ symbol, currentPage, perPage }) {
  const BASE_URL = 'https://pixabay.com';
  const END_POINT = '/api/';
  const params = {
    key: '36218218-c6664bdfcb4076b08e84b91e8',
    q: symbol,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: perPage,
  };

  const response = await axios.get(`${BASE_URL}${END_POINT}`, {
    params: params,
  });
  return response.data;
}
