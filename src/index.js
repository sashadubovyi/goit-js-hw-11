import { refs } from './js/refs';
import { searchInputPictures } from './js/searchPic';
import { loadMorePictures } from './js/searchPic';

refs.btnLoadMore.style.visibility = 'hidden';
refs.form.addEventListener('submit', searchInputPictures);
refs.btnLoadMore.addEventListener('click', loadMorePictures);

export const state = {
  currentPage: 1,
  perPage: 40,
  totalHits: null,
  symbol: '',
};
