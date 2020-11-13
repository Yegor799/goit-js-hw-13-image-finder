import './styles.css'
import NewsApiService from './js/apiService.js'
import imagesTpl from './templates/imageCard.hbs'
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
// import LoadMoreBtn from './js/loadMoreBtn'

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const sentinel = document.querySelector('#sentinel');

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });

const newsApiService = new NewsApiService();


searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
gallery.addEventListener('click', onOpenModal);



function onSearch(e) {
    e.preventDefault();

    newsApiService.query = e.currentTarget.elements.query.value;    

    if (newsApiService.query === '') {
    return;
    }
    
    // loadMoreBtn.show();
    newsApiService.resetPage();
    clearImagesContainer();
    fetchImages();

}

// async function onLoadMore() { 
    
//   loadMoreBtn.disable();
//   const loadMore = await newsApiService.fetchImages();   
//   setTimeout(() => {
//         window.scrollBy({
//           top: document.documentElement.clientHeight - 100,
//           behavior: 'smooth',
//         });
//       }, 1000),

//   appendImagesMarkup(loadMore);
//   loadMoreBtn.enable();
  
  
// }

async function fetchImages() {
  
  const images = await newsApiService.fetchImages();  
  appendImagesMarkup(images);  
  // loadMoreBtn.enable();

  // if (images.length === 0) {    
  //    loadMoreBtn.hide();
  // }
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


const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.query !== '') {      
      newsApiService.fetchImages().then(images => {
        appendImagesMarkup(images);
        newsApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(sentinel);





