/* =====================================================
   ELEMENTS
   ===================================================== */

const clock =
  document.getElementById("clock");

const date =
  document.getElementById("date");

const searchForm =
  document.getElementById("searchForm");

const searchInput =
  document.getElementById("searchInput");

const bookmarkBar =
  document.getElementById("bookmarkBar");

const otherBookmarks =
  document.getElementById("otherBookmarks");


/* =====================================================
   CLOCK
   ===================================================== */

function updateClock() {

  const now = new Date();


  clock.textContent =
    now.toLocaleTimeString([], {

      hour: "2-digit",

      minute: "2-digit",

      hour12: false

    });


  date.textContent =
    now.toLocaleDateString([], {

      weekday: "long",

      day: "numeric",

      month: "long",

      year: "numeric"

    });

}


updateClock();

setInterval(updateClock, 1000);


/* =====================================================
   DUCKDUCKGO
   ===================================================== */

searchForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const query =
      searchInput.value.trim();


    if (!query) return;


    window.location.href =
      "https://duckduckgo.com/?q=" +
      encodeURIComponent(query);

  }
);


/* =====================================================
   SEARCH SHORTCUT
   ===================================================== */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "/" &&
      document.activeElement !== searchInput
    ) {

      event.preventDefault();

      searchInput.focus();

    }

  }
);


/* =====================================================
   ESC
   ===================================================== */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      searchInput.value = "";

      searchInput.blur();

    }

  }
);


/* =====================================================
   DOMAIN
   ===================================================== */

function getDomain(url) {

  try {

    return new URL(url)
      .hostname
      .replace(/^www\./, "");

  }

  catch {

    return "";

  }

}


/* =====================================================
   FAVICON
   ===================================================== */

function createFavicon(url) {

  const image =
    document.createElement("img");

  image.className = "favicon";


  try {

    const host =
      new URL(url).hostname;


    /*
     * Website favicon
     */

    image.src =
      "https://www.google.com/s2/favicons" +
      "?domain=" +
      encodeURIComponent(host) +
      "&sz=32";


  }

  catch {

    image.style.display =
      "none";

  }


  /*
   * Fallback
   */

  image.onerror = function() {

    const fallback =
      document.createElement("span");

    fallback.className =
      "favicon-fallback";

    fallback.textContent = "●";

    image.replaceWith(fallback);

  };


  return image;

}


/* =====================================================
   CREATE BOOKMARK
   ===================================================== */

function createBookmark(bookmark) {

  const link =
    document.createElement("a");


  link.className =
    "bookmark";


  link.href =
    bookmark.url;


  /*
   * Icon
   */

  link.appendChild(
    createFavicon(bookmark.url)
  );


  /*
   * Name
   */

  const name =
    document.createElement("span");


  name.className =
    "bookmark-name";


  name.textContent =
    bookmark.title ||
    bookmark.url;


  link.appendChild(name);


  /*
   * Domain
   */

  const domain =
    document.createElement("span");


  domain.className =
    "bookmark-url";


  domain.textContent =
    getDomain(bookmark.url);


  link.appendChild(domain);


  return link;

}


/* =====================================================
   FOLDER
   ===================================================== */

function createFolder(folder) {

  const element =
    document.createElement("div");


  element.className =
    "bookmark-folder";


  const icon =
    document.createElement("span");


  icon.textContent =
    "󰉋";


  icon.style.color =
    "var(--accent)";


  icon.style.fontSize =
    "11px";


  const name =
    document.createElement("span");


  name.textContent =
    folder.title;


  element.appendChild(icon);

  element.appendChild(name);


  return element;

}


/* =====================================================
   RENDER BOOKMARK TREE
   ===================================================== */

function renderBookmarks(
  nodes,
  container
) {

  let bookmarkCount = 0;


  function walk(items) {

    for (const item of items) {


      /*
       * BOOKMARK
       */

      if (item.url) {

        container.appendChild(
          createBookmark(item)
        );

        bookmarkCount++;

      }


      /*
       * FOLDER
       */

      else if (
        item.children &&
        item.title
      ) {

        const folder =
          createFolder(item);


        container.appendChild(
          folder
        );


        walk(item.children);

      }

    }

  }


  walk(nodes);


  if (bookmarkCount === 0) {

    container.innerHTML =
      '<div class="empty">No bookmarks</div>';

  }

}


/* =====================================================
   LOAD CHROMIUM BOOKMARKS
   ===================================================== */

function loadBookmarks() {

  if (!chrome.bookmarks) {

    bookmarkBar.innerHTML =
      '<div class="empty">Bookmarks permission unavailable</div>';

    otherBookmarks.innerHTML =
      '<div class="empty">Bookmarks permission unavailable</div>';

    return;

  }


  chrome.bookmarks.getTree(
    function(tree) {

      bookmarkBar.innerHTML = "";

      otherBookmarks.innerHTML = "";


      const root =
        tree[0];


      if (
        !root ||
        !root.children
      ) {

        return;

      }


      for (
        const folder of root.children
      ) {

        const title =
          folder.title.toLowerCase();


        /*
         * BOOKMARK BAR
         */

        if (
          title === "bookmarks bar" ||
          title === "bookmark bar"
        ) {

          renderBookmarks(
            folder.children || [],
            bookmarkBar
          );

        }


        /*
         * OTHER BOOKMARKS
         */

        else if (
          title === "other bookmarks"
        ) {

          renderBookmarks(
            folder.children || [],
            otherBookmarks
          );

        }

      }

    }
  );

}


/* =====================================================
   LIVE BOOKMARK UPDATES
   ===================================================== */

if (chrome.bookmarks) {

  chrome.bookmarks.onCreated
    .addListener(loadBookmarks);

  chrome.bookmarks.onRemoved
    .addListener(loadBookmarks);

  chrome.bookmarks.onChanged
    .addListener(loadBookmarks);

  chrome.bookmarks.onMoved
    .addListener(loadBookmarks);

}


/* =====================================================
   START
   ===================================================== */

loadBookmarks();

const wallpaper = document.getElementById("wallpaper");

wallpaper.addEventListener("error", () => {
  console.error("Wallpaper failed to load:", wallpaper.error);
});

wallpaper.addEventListener("loadeddata", () => {
  wallpaper.play().catch((error) => {
    console.error("Wallpaper autoplay failed:", error);
  });
});