const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const resultsContainer = document.querySelector('.results-container');
const priceDisplay = document.getElementById('price-display');
let items = [];
let selectedIndex = -1;

fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error loading data');
    }
    return response.json();
  })
  .then(data => {
    items = data;
    searchInput.removeAttribute('disabled');
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const results = items.filter(item => item.Item.toLowerCase().includes(searchTerm));
    selectedIndex = -1;
    displaySuggestions(results);
});

searchInput.addEventListener('keydown', (event) => {
    const suggestions = document.getElementsByClassName('suggestion');
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
        updateSelection(suggestions);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection(suggestions);
    } else if (event.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            displayResult(items.find(item => item.Item === suggestions[selectedIndex].textContent));
        }
    }
});

function displaySuggestions(results) {
    suggestionsContainer.innerHTML = '';
    results.forEach(result => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.textContent = result.Item;
        suggestion.addEventListener('click', () => displayResult(result));
        suggestionsContainer.appendChild(suggestion);
    });
}



function displayResult(result) {
    if (result) {
        priceDisplay.innerHTML = `Price: $${result.Price.toFixed(2)}`; 
    } else {
        priceDisplay.innerHTML = '';
    }
}

function updateSelection(suggestions) {
    Array.from(suggestions).forEach((suggestion, index) => {
        if (index === selectedIndex) {
            suggestion.classList.add('selected');
        } else {
            suggestion.classList.remove('selected');
        }
    });

    if (selectedIndex >= 0) {
        searchInput.value = suggestions[selectedIndex].textContent;
    }
}
