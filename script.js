let books = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let currentPage = 1;
const booksPerPage = 12;
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const bookList = document.getElementById("bookList");
const pageNumber = document.getElementById("pageNumber");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

document.addEventListener("DOMContentLoaded", function () {
  // Get the current URL path and extract the filename
  let currentUrl = window.location.pathname.split("/").pop();

  // If URL is empty (root page) or 'index.html', we default to 'index.html'
  if (!currentUrl || currentUrl === "") {
    currentUrl = "index.html";
  }

  console.log({ currentUrl });
  // Select the navigation links
  const homeLink = document.getElementById("homeLink");
  const wishlistLink = document.getElementById("wishlistLink");

  // Add the 'active' class based on the current page
  if (currentUrl === "wishlist.html") {
    wishlistLink.classList.add("active");
  } else if (currentUrl === "index.html") {
    homeLink.classList.add("active"); // Make home active by default
  }
});
async function fetchBooks(page = 1) {
  // Show the loading indicator
  document.getElementById("loading").style.display = "block";
  
  try {
    const response = await fetch(`https://gutendex.com/books?page=${page}`);
    const data = await response.json();
    books = data.results;
    displayBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    // Hide the loading indicator once the books are fetched
    document.getElementById("loading").style.display = "none";
  }
}


function displayBooks() {
  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .filter(
      (book) =>
        genreFilter.value === "" || book.subjects.includes(genreFilter.value)
    );

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  bookList.innerHTML = "";
  paginatedBooks.forEach((book) => {
    bookList.innerHTML += `
      <div class="book-item">
        <img src="${book.formats["image/jpeg"]}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>${book.authors.map((author) => author.name).join(", ")}</p>
        <p>Genres: ${book.subjects.join(", ")}</p>
        <button onclick="toggleWishlist(${book.id})">
          ${wishlist.includes(book.id) ? "💖" : "🤍"}
        </button>
      </div>
    `;
  });

  pageNumber.textContent = currentPage;
}

searchInput.addEventListener("input", displayBooks);
genreFilter.addEventListener("change", displayBooks);
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchBooks(currentPage);
  }
});
nextPageBtn.addEventListener("click", () => {
  currentPage++;
  fetchBooks(currentPage);
});

function toggleWishlist(bookId) {
  if (wishlist.includes(bookId)) {
    wishlist = wishlist.filter((id) => id !== bookId);
  } else {
    wishlist.push(bookId);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayBooks();
}

fetchBooks();
