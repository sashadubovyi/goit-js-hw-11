import { Notify } from 'notiflix';
import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  btnSearch: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
let currentPage = 1;
const perPage = 40;
let totalHits = 0;
refs.btnLoadMore.style.visibility = 'hidden';

refs.form.addEventListener('submit', searchInputPictures);
refs.btnLoadMore.addEventListener('click', loadMorePictures);

function fetchPictures(symbol) {
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

  return axios
    .get(`${BASE_URL}${END_POINT}`, {
      params: params,
    })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.data;
    });
}

function searchInputPictures(evt) {
  evt.preventDefault();
  currentPage = 1;

  const inputWords = refs.input.value;

  if (inputWords === '') {
    Notify.warning('Write something to start search');
    return;
  }

  refs.gallery.innerHTML = '';

  fetchPictures(inputWords)
    .then(data => {
      console.log(data);

      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      totalHits = data.totalHits;
      renderPictures(data.hits);
      updateLoadMoreButton();
    })
    .catch(error => {
      Notify.failure(
        'Oops! Something went wrong while loading the page. Please try again later.'
      );
    });
}

function loadMorePictures(evt) {
  currentPage += 1;
  const inputWords = refs.input.value;

  fetchPictures(inputWords).then(data => {
    renderPictures(data.hits);
    updateLoadMoreButton();
  });
}

function updateLoadMoreButton() {
  const loadedPictures = currentPage * perPage;
  if (loadedPictures >= totalHits) {
    refs.btnLoadMore.style.visibility = 'hidden';
  } else {
    refs.btnLoadMore.style.visibility = 'visible';
  }
}

function renderPictures(hits) {
  const markup = hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                Likes: <b>${likes.toLocaleString()}</b>
            </p>
            <p class="info-item">
                Views: <b>${views.toLocaleString()}</b>
            </p>
            <p class="info-item">
                Comments: <b>${comments.toLocaleString()}</b>
            </p>
            <p class="info-item">
                Downloads: <b>${downloads.toLocaleString()}</b>
            </p>
        </div>
    </div>
          `;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
