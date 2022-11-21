import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'We could not find the recipe that you are looking for. Please try another one';
  _successMessage = '';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
