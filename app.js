
// GAUTENG ROOMS & RENTALS
// Powered by OyisaTech

const propertyList = document.getElementById("propertyList");
const searchForm = document.getElementById("searchForm");
const locationSearch = document.getElementById("locationSearch");
const categorySearch = document.getElementById("categorySearch");
const resultCount = document.getElementById("resultCount");

let allProperties = [];

// Display properties
function displayProperties(properties) {
  propertyList.innerHTML = "";

  resultCount.textContent =
    properties.length + (properties.length === 1 ? " property" : " properties");

  if (properties.length === 0) {
    propertyList.innerHTML = `
      <div class="empty-state">
        <h3>No properties found yet</h3>
        <p>Check another location or category. New rentals will appear here as landlords join.</p>
      </div>`;
    return;
  }

  properties.forEach(property => {
    const card = document.createElement("article");
    card.className = "property-card";

    const image = document.createElement("img");
    image.src = property.image_urls?.[0] || "";
    image.alt = property.title || "Rental property";
    image.loading = "lazy";
    image.onerror = () => {
      image.src = "https://placehold.co/600x400?text=Property+Photo";
    };

    const info = document.createElement("div");
    info.className = "property-info";

    const title = document.createElement("h3");
    title.textContent = property.title;

    const location = document.createElement("p");
    location.textContent = [property.suburb, property.city]
      .filter(Boolean).join(", ");

    const category = document.createElement("p");
    category.textContent = property.category;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = "R" + Number(property.rent).toLocaleString("en-ZA") + " / month";

    const description = document.createElement("p");
    description.textContent = property.description || "Contact landlord for details.";

    const bedrooms = document.createElement("p");
    bedrooms.textContent = "🛏️ " + (property.bedrooms || 1) +
      " bedrooms  |  🚿 " + (property.bathrooms || 1) + " bathrooms";

    const contact = document.createElement("a");
    contact.className = "property-link";
    contact.textContent = "Contact landlord on WhatsApp";
    
    const phone = String(property.contact_phone || "").replace(/\D/g, "");
    const whatsappNumber = phone.startsWith("0")
      ? "27" + phone.slice(1)
      : phone;

    contact.href = "https://wa.me/" + whatsappNumber +
      "?text=" + encodeURIComponent(
        "Hello, I'm interested in " + property.title
      );
    contact.target = "_blank";
    contact.rel = "noopener noreferrer";

    info.append(title, location, category, price,
      description, bedrooms, contact);

    card.append(image, info);
    propertyList.appendChild(card);
  });
}

// Search and filter properties
function filterProperties() {
  const location = locationSearch.value.trim().toLowerCase();
  const category = categorySearch.value;

  const filtered = allProperties.filter(property => {
    const searchable = [
      property.city,
      property.suburb,
      property.title
    ].filter(Boolean).join(" ").toLowerCase();

    return searchable.includes(location) &&
      (!category || property.category === category);
  });

  displayProperties(filtered);
}

// Search form
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  filterProperties();

  document.getElementById("properties").scrollIntoView({
    behavior: "smooth"
  });
});

// Category buttons
document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    categorySearch.value = button.dataset.category;
    filterProperties();

    document.getElementById("properties").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Load approved properties from Supabase
async function loadProperties() {
  if (!window.supabaseClient) {
    propertyList.innerHTML = `
      <div class="empty-state">
        <h3>Our rental marketplace is being prepared.</h3>
        <p>Property listings will appear here once the database is connected.</p>
      </div>`;
    resultCount.textContent = "Coming soon";
    return;
  }

  try {
    const { data, error } = await window.supabaseClient
      .from("properties")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    allProperties = data || [];
    filterProperties();

  } catch (error) {
    console.error("Property loading error:", error);
    propertyList.innerHTML = `
      <p>We couldn't load properties right now. Please try again later.</p>`;
  }
}

loadProperties();
                         
