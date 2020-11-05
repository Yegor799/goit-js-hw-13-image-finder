import './styles.css'
import NewsApiService from './js/apiService.js'
import imagesTpl from './templates/imageCard.hbs'
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('[data-action="load-more"]')

const newsApiService = new NewsApiService();


searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);
gallery.addEventListener('click', onOpenModal);

window.scrollTo({
        behavior: "smooth"
});

function onSearch(e) {
    e.preventDefault();

    newsApiService.query = e.currentTarget.elements.query.value;
    

    if (newsApiService.query === '') {
    return;
    }
    
    newsApiService.resetPage();
    clearImagesContainer();
    fetchImages();

}

async function onLoadMore() {
    
   window.scrollTo({
      behavior: "smooth"
});  
  
  const loadMore = await newsApiService.fetchImages();  
  return appendImagesMarkup(loadMore);
  
  
}

async function fetchImages() {
 
  const images = await newsApiService.fetchImages();
  appendImagesMarkup(images);
  loadMoreButton.classList.remove('is-hidden');
}

function appendImagesMarkup(images) {
  gallery.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearImagesContainer() {
  gallery.innerHTML = '';
}

function onOpenModal(e) {
    if (e.target.nodeName !== 'IMG') {
    return;
  }

  const largeImageURL = `<img src= ${e.target.dataset.source}>`;
  basicLightbox.create(largeImageURL).show();
}






