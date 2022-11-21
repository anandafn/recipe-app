import View from './View.js';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully added';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
  _btnCloseModal = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpenModal.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnCloseModal.addEventListener(
      'click',
      this._toggleWindow.bind(this)
    );
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const dataArr = [...new FormData(this._parentElement)];
      const data = Object.fromEntries(dataArr); //fromEntries will helps to convert to an object
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
