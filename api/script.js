document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchQueryElement = document.getElementById('search-query');
  const resultsContainer = document.getElementById('results');
  const loadingElement = document.getElementById('loading');
  
  // Handle form submission
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (query) {
      searchShows(query);
    }
  });
  
  // Function to search shows
  function searchShows(query) {
    // Show loading state
    loadingElement.classList.remove('hidden');
    resultsContainer.innerHTML = '';
    searchQueryElement.textContent = `Showing results for: "${query}"`;
    
    // Fetch data from TV Maze API
    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Hide loading message
        loadingElement.classList.add('hidden');
        
        // Check if data is empty
        if (!data || data.length === 0) {
          resultsContainer.innerHTML = `
            <div class="error">
              No shows found matching "${query}".
            </div>
          `;
          return;
        }
        
        // Process each show
        data.forEach(item => {
          const show = item.show;
          
          // Create show card
          const showCard = document.createElement('div');
          showCard.className = 'show-card';
          
          // Get show details (with fallbacks for missing data)
          const name = show.name || 'Untitled Show';
          const summary = show.summary 
            ? show.summary.replace(/<[^>]*>/g, '') // Remove HTML tags
            : 'No description available.';
          const image = show.image 
            ? show.image.medium 
            : 'https://via.placeholder.com/210x295?text=No+Image';
          
          // Populate show card
          showCard.innerHTML = `
            <h2>${name}</h2>
            <img src="${image}" alt="${name}" class="show-image">
            <p>${summary}</p>
            ${show.officialSite ? `<a href="${show.officialSite}" target="_blank" class="official-site">Official Website</a>` : ''}
          `;
          
          // Add to results
          resultsContainer.appendChild(showCard);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        loadingElement.classList.add('hidden');
        resultsContainer.innerHTML = `
          <div class="error">
            Error loading show data: ${error.message}<br>
            Please try again later.
          </div>
        `;
      });
  }
  
  // Initial load with "girls" as default search
  searchInput.value = 'girls';
  searchShows('girls');
});
