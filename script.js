
const events = [
  {
    id: 1,
    title: "Feel the Music Festival",
    category: "Music",
    date: "2026-11-14",
    time: "6:00 PM",
    location: "Lahore, Pakistan",
    price: 2500,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
    description: "Get ready for an unforgettable evening filled with live music, amazing performances and great energy. Bring your friends and enjoy the atmosphere!"
  },
  {
    id: 2,
    title: "Future Tech Summit",
    category: "Tech",
    date: "2026-11-20",
    time: "10:00 AM",
    location: "Islamabad, Pakistan",
    price: 1800,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    description: "Explore the world of technology, digital innovation and emerging ideas. A great opportunity to discover new trends and learn from the tech community."
  },
  {
    id: 3,
    title: "Creative Art Exhibition",
    category: "Art",
    date: "2026-11-22",
    time: "3:00 PM",
    location: "Lahore, Pakistan",
    price: 1200,
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800",
    description: "Step into a creative space filled with inspiring artwork, colors and imagination. Discover unique pieces and enjoy a beautiful artistic experience."
  },
  {
    id: 4,
    title: "Design Your Future Workshop",
    category: "Workshops",
    date: "2026-11-27",
    time: "11:00 AM",
    location: "Karachi, Pakistan",
    price: 1500,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    description: "Explore creative thinking, practical design concepts and new skills in this interactive workshop. Perfect for anyone who loves learning and creating."
  },
  {
    id: 5,
    title: "Street Food Carnival",
    category: "Food",
    date: "2026-12-05",
    time: "5:00 PM",
    location: "Lahore, Pakistan",
    price: 1000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    description: "Enjoy a fun food experience with delicious street food, exciting flavors and a lively atmosphere. Bring your appetite and explore something tasty!"
  },
  {
    id: 6,
    title: "Photography Walk",
    category: "Art",
    date: "2026-12-09",
    time: "8:00 AM",
    location: "Islamabad, Pakistan",
    price: 800,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
    description: "Bring your camera or smartphone and explore the beauty of everyday moments. Learn creative photography ideas and enjoy a relaxed photo walk."
  },
  {
    id: 7,
    title: "Champions Sports Day",
    category: "Sports",
    date: "2026-12-12",
    time: "9:00 AM",
    location: "Faisalabad, Pakistan",
    price: 1300,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    description: "Enjoy an energetic sports experience with friendly activities, exciting games and a spirit of teamwork. Come along and enjoy the action!"
  },
  {
    id: 8,
    title: "Startup & Ideas Meetup",
    category: "Tech",
    date: "2026-12-18",
    time: "2:00 PM",
    location: "Karachi, Pakistan",
    price: 2000,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    description: "Explore fresh ideas, creative thinking and entrepreneurship. Connect with people who are interested in building, learning and sharing new ideas."
  }
];

// ELEMENTS
const eventGrid = document.getElementById("eventGrid");
const eventCount = document.getElementById("eventCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.getElementById("filterButtons");
const emptyState = document.getElementById("emptyState");
const bookingList = document.getElementById("bookingList");
const eventModal = document.getElementById("eventModal");
const eventModalContent = document.getElementById("eventModalContent");
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const ticketQuantity = document.getElementById("ticketQuantity");
const bookingTotal = document.getElementById("bookingTotal");
const toast = document.getElementById("toast");

let activeFilter = "All";
let selectedEvent = null;
let toastTimer;

let favorites = loadStorage("eventoraFavorites", []);
let bookings = loadStorage("eventoraBookings", []);

// STORAGE
function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    showToast("Browser storage is unavailable.");
  }
}

// FORMAT PRICE
function formatPrice(price) {
  return "PKR " + Number(price).toLocaleString("en-PK");
}

// FORMAT DATE
function formatDate(dateString) {
  const date = new Date(dateString + "T12:00:00");

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// TOAST MESSAGE
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// RENDER EVENTS
function renderEvents() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredEvents = events.filter(event => {
    const matchesCategory =
      activeFilter === "All" || event.category === activeFilter;

    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm) ||
      event.category.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  eventCount.textContent =
    `${filteredEvents.length} ${filteredEvents.length === 1 ? "event" : "events"}`;

  emptyState.hidden = filteredEvents.length !== 0;
  eventGrid.style.display = filteredEvents.length ? "grid" : "none";

  eventGrid.innerHTML = filteredEvents.map(event => `
    <article class="event-card">
      <div class="event-image">
        <img src="${event.image}" alt="${event.title}" loading="lazy">
        <span class="event-category">${event.category}</span>

        <button
          class="favorite-btn ${favorites.includes(event.id) ? "liked" : ""}"
          data-favorite="${event.id}"
          aria-label="Add ${event.title} to favourites"
          title="Add to favourites">
          ${favorites.includes(event.id) ? "♥" : "♡"}
        </button>
      </div>

      <div class="event-card-content">
        <span class="event-date">📅 ${formatDate(event.date)} · ${event.time}</span>
        <h3>${event.title}</h3>
        <p class="event-location">📍 ${event.location}</p>

        <div class="event-card-bottom">
          <div class="event-price">
            ${formatPrice(event.price)}
            <small>per ticket</small>
          </div>

          <button class="details-btn" data-details="${event.id}">
            View Details →
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// FILTER BUTTONS
filterButtons.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");

  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn === button);
  });

  renderEvents();
});

// CATEGORY CARDS
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    activeFilter = card.dataset.category;

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.filter === activeFilter
      );
    });

    renderEvents();
    document.getElementById("events").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// SEARCH
searchInput.addEventListener("input", renderEvents);

// CLEAR FILTERS
document.getElementById("resetFilters").addEventListener("click", () => {
  activeFilter = "All";
  searchInput.value = "";

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === "All");
  });

  renderEvents();
});

// FAVORITES
eventGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-favorite]");

  if (!button) return;

  const id = Number(button.dataset.favorite);

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
    showToast("Removed from favourites");
  } else {
    favorites.push(id);
    showToast("Added to favourites ♥");
  }

  saveStorage("eventoraFavorites", favorites);
  renderEvents();
});

// EVENT DETAILS
eventGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");

  if (!button) return;

  const id = Number(button.dataset.details);
  openEventDetails(id);
});

function openEventDetails(id) {
  const event = events.find(item => item.id === id);

  if (!event) return;

  selectedEvent = event;

  eventModalContent.innerHTML = `
    <img class="modal-event-image" src="${event.image}" alt="${event.title}">

    <span class="modal-event-category">${event.category}</span>

    <h2 class="modal-event-title">${event.title}</h2>

    <p class="modal-event-description">${event.description}</p>

    <div class="modal-event-meta">
      <span>📅 ${formatDate(event.date)}</span>
      <span>🕒 ${event.time}</span>
      <span>📍 ${event.location}</span>
    </div>

    <div class="event-modal-bottom">
      <span class="modal-price">${formatPrice(event.price)} <small>/ ticket</small></span>
      <button class="primary-btn" id="modalBookBtn">
        Book Tickets →
      </button>
    </div>
  `;

  openModal("eventModal");

  document.getElementById("modalBookBtn").addEventListener("click", () => {
    closeModal("eventModal");
    openBookingModal(event.id);
  });
}

// OPEN AND CLOSE MODALS
function openModal(id) {
  const modal = document.getElementById(id);

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.show")) {
    document.body.style.overflow = "";
  }
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.close);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal("eventModal");
    closeModal("bookingModal");
  }
});

// BOOKING MODAL
function openBookingModal(id) {
  selectedEvent = events.find(item => item.id === id);

  if (!selectedEvent) return;

  document.getElementById("bookingEventName").textContent =
    selectedEvent.title;

  document.getElementById("bookingSummary").textContent =
    `📅 ${formatDate(selectedEvent.date)}  |  📍 ${selectedEvent.location}`;

  ticketQuantity.value = "1";
  updateBookingTotal();

  openModal("bookingModal");
}

// UPDATE TOTAL
function updateBookingTotal() {
  if (!selectedEvent) return;

  const quantity = Number(ticketQuantity.value);
  const total = selectedEvent.price * quantity;

  bookingTotal.textContent = formatPrice(total);
}

ticketQuantity.addEventListener("change", updateBookingTotal);

// CONFIRM BOOKING (DEMO ONLY)
bookingForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!selectedEvent) return;

  const quantity = Number(ticketQuantity.value);
  const total = selectedEvent.price * quantity;

 
const customerName = document.getElementById("customerName").value.trim();
const customerEmail = document.getElementById("customerEmail").value.trim();

if (!customerName || !customerEmail) {
  showToast("Please enter your name and email.");
  return;
}

const newBooking = {
  bookingId: Date.now(),
  eventId: selectedEvent.id,
  title: selectedEvent.title,
  category: selectedEvent.category,
  date: selectedEvent.date,
  location: selectedEvent.location,
  image: selectedEvent.image,
  customerName: customerName,
  customerEmail: customerEmail,
  quantity: quantity,
  total: total,
  status: "Confirmed"
};

  bookings.unshift(newBooking);

  saveStorage("eventoraBookings", bookings);

  closeModal("bookingModal");
  renderBookings();

  showToast("Your demo booking is confirmed! 🎉");

  document.getElementById("bookings").scrollIntoView({
    behavior: "smooth"
  });
});

// RENDER BOOKINGS
function renderBookings() {
  if (bookings.length === 0) {
    bookingList.innerHTML = `
      <div class="booking-empty">
        <span>🎟️</span>
        <h3>No bookings yet</h3>
        <p>Your next adventure starts with an event.</p>
        <a href="#events" class="primary-btn">Explore Events →</a>
      </div>
    `;

    return;
  }

  bookingList.innerHTML = bookings.map(booking => `
    <article class="booking-card">
      <img src="${booking.image}" alt="${booking.title}">

      <div class="booking-info">
        <h3>${booking.title}</h3>
        <p>📅 ${formatDate(booking.date)}</p>
        <p>🎟️ ${booking.quantity} ticket(s)</p>
        <strong>${formatPrice(booking.total)}</strong>
        <span class="booking-status">${booking.status}</span>
      </div>

      <button class="cancel-booking" data-cancel="${booking.bookingId}">
        Remove
      </button>
    </article>
  `).join("");
}

// REMOVE BOOKING FROM DEMO LIST
bookingList.addEventListener("click", event => {
  const button = event.target.closest("[data-cancel]");

  if (!button) return;

  const id = Number(button.dataset.cancel);

  bookings = bookings.filter(booking => booking.bookingId !== id);

  saveStorage("eventoraBookings", bookings);
  renderBookings();

  showToast("Booking removed from your demo list");
});

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
  });
});

// ACTIVE NAVIGATION
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-links a").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
  });
});

// INITIALIZE
renderEvents();
renderBookings();
