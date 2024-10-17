const wishlistBooks = JSON.parse(localStorage.getItem("wishlist")) || [];
const wishlistContainer = document.getElementById("wishlist");

document.addEventListener("DOMContentLoaded", function () {
  // Get the current URL path and extract the filename
  let currentUrl = window.location.pathname.split("/").pop();

  // If URL is empty (root page) or 'index.html', we default to 'index.html'
  if (!currentUrl || currentUrl === "") {
    currentUrl = "index.html";
  }

  // Log the current URL for debugging purposes
  console.log({ currentUrl });

  // Select the navigation links
  const homeLink = document.getElementById("homeLink");
  const wishlistLink = document.getElementById("wishlistLink");
  console.log({ wishlistLink });
  // Check if the elements exist before adding the 'active' class
  if (currentUrl === "wishlist.html" && wishlistLink) {
    wishlistLink.classList.add("active");
  } else if ((currentUrl === "index.html" || currentUrl === "") && homeLink) {
    homeLink.classList.add("active"); // Make home active by default
  }
});

async function fetchWishlistBooks() {
  const promises = wishlistBooks.map((id) =>
    fetch(`https://gutendex.com/books/${id}`).then((response) =>
      response.json()
    )
  );
  const books = await Promise.all(promises);

  wishlistContainer.innerHTML = "";
  books.forEach((book) => {
    wishlistContainer.innerHTML += `
      <div class="book-item">
        <img src="${book.formats["image/jpeg"]}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>${book.authors.map((author) => author.name).join(", ")}</p>
        <p>Genres: ${book.subjects.join(", ")}</p>
      </div>
    `;
  });
}

fetchWishlistBooks();
