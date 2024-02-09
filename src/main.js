import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.getElementById('load-more');
const apiKey = '42152673-4f3b2f2010df91e54c05d1b70';

const searchParams = {
  key: apiKey,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  q: '',
  page: 1,
  per_page: 15,
};

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  loader.style.display = 'block';
  const inputValue = e.target.elements.input.value;
  searchParams.q = inputValue;
  searchParams.page = 1;
  try {
    const images = await getPhotoByName();
    createGallery(images);
  } catch (error) {
    console.error(error);
  }
  e.target.reset();
});

loadMoreButton.addEventListener('click', async function () {
  loader.style.display = 'block';
  searchParams.page++;
  try {
    const images = await getPhotoByName();
    appendGallery(images);
  } catch (error) {
    console.error(error);
  }
});

async function getPhotoByName() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: searchParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.status);
  }
}

function createGallery(images) {
  if (images.hits.length === 0) {
    iziToast.show({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      messageColor: '#FFFFFF',
      backgroundColor: '#EF4040',
      position: 'topRight',
      messageSize: '16px',
      messageLineHeight: '24px',
      maxWidth: '432px',
    });
    gallery.innerHTML = '';
    loadMoreButton.style.display = 'none';
  } else {
    gallery.innerHTML = ''; // Clear gallery before adding new images
    appendGallery(images);
    loadMoreButton.style.display = 'block';
  }
  loader.style.display = 'none';
}

function appendGallery(images) {
  loader.style.display = 'block';

  const link = images.hits
    .map(
      image => `<a class="gallery-link" href="${image.largeImageURL}">
      <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
      <div class="image-info">
        <p ><strong>Likes:</strong> <span class="text">${image.likes}</span></p>
        <p ><strong>Views:</strong> <span class="text">${image.views}</span></p>
        <p ><strong>Comments:</strong> <span class="text">${image.comments}</span></p>
        <p ><strong>Downloads:</strong> <span class="text">${image.downloads}</span></p>
      </div>
    </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', link);
  loader.style.display = 'none';

  if (searchParams.page * 15 >= images.totalHits) {
    loadMoreButton.style.display = 'none';
    iziToast.show({
      message: "We're sorry, but you've reached the end of search results.",
      messageColor: '#FFFFFF',
      backgroundColor: '#EF4040',
      position: 'topRight',
      messageSize: '16px',
      messageLineHeight: '24px',
      maxWidth: '432px',
    });
  }

  let lightBox = new SimpleLightbox('.gallery-link');
  lightBox.refresh();
}
