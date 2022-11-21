import icons from '../../img/icons.svg';

export default class View {
  _data;

  // Building a method
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.errorHandler();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.errorHandler();
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const oldElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const oldEl = oldElement[i];

      // Updating the text that had been changed
      if (
        !newEl.isEqualNode(oldEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        oldEl.textContent = newEl.textContent;
      }

      // Updating the attributes because of the changes
      if (!newEl.isEqualNode(oldEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          oldEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // Render the loading spinner
  renderSpinner = () => {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;
    this._clear;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  errorHandler(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
              <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  messageHandler(message = this._successMessage) {
    const markup = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
