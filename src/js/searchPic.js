import { Notify } from 'notiflix';
import { refs } from './refs';
import { fetchPictures } from './fetchPictures';
import { renderPictures } from './render';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

const state = {
  currentPage: 1,
  perPage: 40,
  totalHits: null,
  symbol: '',
};

export async function searchInputPictures(evt) {
  evt.preventDefault();
  window.scrollTo(0, 0);

  state.currentPage = 1;
  state.symbol = refs.input.value;

  if (state.symbol === '') {
    Notify.warning('Write something to start search');
    return;
  }

  refs.gallery.innerHTML = '';

  try {
    const data = await fetchPictures(state);
    console.log(data);

    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    state.totalHits = data.totalHits;
    refs.gallery.insertAdjacentHTML('beforeend', renderPictures(data.hits));
    lightbox.refresh();
    updateLoadMoreButton();
  } catch (error) {
    Notify.failure(
      'Oops! Something went wrong while loading the page. Please try again later.'
    );
  }
}

export async function loadMorePictures() {
  state.currentPage += 1;

  state.symbol = refs.input.value;

  const data = await fetchPictures(state);
  refs.gallery.insertAdjacentHTML('beforeend', renderPictures(data.hits));
  lightbox.refresh();
  updateLoadMoreButton();
}

function updateLoadMoreButton() {
  const loadedPictures = state.currentPage * state.perPage;
  if (loadedPictures >= state.totalHits) {
    refs.btnLoadMore.style.visibility = 'hidden';
    Notify.info('These are all the images that correspond to your request.');
  } else {
    refs.btnLoadMore.style.visibility = 'visible';
  }
}

let loading = false;

window.addEventListener('scroll', async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
    loading = true;
    await loadMorePictures();
    loading = false;
  }
});
