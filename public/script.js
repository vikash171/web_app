// ================== INDEXDB Setup ==================
let db;
const request = indexedDB.open("mediaDB", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains("downloads")) {
    db.createObjectStore("downloads", { keyPath: "id" });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("IndexedDB ready");
  loadDownloads();
};

request.onerror = (event) => {
  console.error("DB error:", event.target.errorCode);
};

// ================== API Fetch ==================
// ================== API Fetch ==================
const API_URL = "https://picsum.photos/v2/list?page=1&limit=6";

async function loadMedia() {
  const mediaContainer = document.getElementById("mediaContainer");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    mediaContainer.innerHTML = "";

    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "media-item";
      div.innerHTML = `
        <img src="https://picsum.photos/id/${item.id}/400/300" alt="photo">
        <button class="download-btn" data-url="https://picsum.photos/id/${item.id}/1200/800" data-id="${item.id}">
          Download
        </button>
      `;
      mediaContainer.appendChild(div);
    });

    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.addEventListener("click", saveToDownloads);
    });
  } catch (err) {
    mediaContainer.innerHTML = "Error loading media.";
    console.error(err);
  }
}
loadMedia();


// ================== Save to IndexedDB ==================
function saveToDownloads(e) {
  const url = e.target.dataset.url;
  const id = e.target.dataset.id;

  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const transaction = db.transaction(["downloads"], "readwrite");
      const store = transaction.objectStore("downloads");
      const item = { id, blob, type: blob.type };
      store.put(item);

      transaction.oncomplete = () => {
        console.log("Saved to DB:", id);
        loadDownloads();
      };
    });
}

// ================== Load Downloads ==================
function loadDownloads() {
  if (!db) return;
  const list = document.getElementById("downloadList");
  list.innerHTML = "";

  const transaction = db.transaction(["downloads"], "readonly");
  const store = transaction.objectStore("downloads");
  const req = store.getAll();

  req.onsuccess = () => {
    req.result.forEach(item => {
      const url = URL.createObjectURL(item.blob);
      const div = document.createElement("div");
      div.className = "media-item";
      if (item.type.startsWith("image/")) {
        div.innerHTML = `<img src="${url}"><a href="${url}" download="photo.jpg" class="download-btn">Save</a>`;
      } else if (item.type.startsWith("video/")) {
        div.innerHTML = `<video src="${url}" controls></video><a href="${url}" download="video.mp4" class="download-btn">Save</a>`;
      }
      list.appendChild(div);
    });
  };
}
