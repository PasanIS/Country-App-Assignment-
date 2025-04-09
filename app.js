let countriesArrayList = [];
let index = 0;

let selectedCountry = null;

// ------Load Countries
function loadCountries() {
    let countriesList = document.getElementById("countriesList");
    countriesArrayList = []; //----clear previous data
    index = 0; //----reset index
  
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((dataList) => {
        let body = "";
        dataList.forEach((element) => {
          countriesArrayList.push(element); //---store
          body += `<div class="col" id="${index}">
              <div class="card shadow-sm">
                <img src="${element.flags.png}" alt="Flag">
                <div class="card-body">
                  <p class="card-text">
                    ${element.name.common}
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" onclick="showCountryModal(${index})" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        View More ->
                      </button>
                    </div>
                    <small class="text-body-secondary">Listed</small>
                  </div>
                </div>
              </div>
            </div>
          `;
          index++;
        });
        countriesList.innerHTML = body;
      });
  }

// ------Search Country
function search() {
  const searchCountry = document.getElementById("txtSearch").value.trim();
  const countriesList = document.getElementById("countriesList");
  countriesList.innerHTML = ""; // ----Clear Cards
  console.log(searchCountry); //----Debug

  if (searchCountry === "") {
    alert("Please enter a country name...");
    return;
  }

  fetch(`https://restcountries.com/v3.1/name/${searchCountry}?fullText=true`)
  .then((res) => res.json())
  .then((dataList) => {
    let body = "";
    countriesArrayList = []; //----reset
    index = 0;

    dataList.forEach((country) => {
      countriesArrayList.push(country);
      selectedCountry = country;
      body += `
        <div class="col">
          <div class="card shadow-sm">
            <img src="${country.flags.png}" class="card-img-top" alt="${country.name.common} flag" />
            <div class="card-body">
              <p class="card-text">
                <strong>${country.name.common}</strong><br />
                Capital: ${country.capital ? country.capital[0] : "N/A"}<br />
                Region: ${country.region}<br />
                Population: ${country.population.toLocaleString()}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" onclick="showCountryModal(${index})" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    View More ->
                  </button>
                </div>
                <small class="text-body-secondary">Search Result</small>
              </div>
            </div>
          </div>
        </div>
      `;
      index++;
    });

    countriesList.innerHTML = body;
  })
}

//----Show Country Modal
function showCountryModal(countryIndex) {
    const country = countriesArrayList[countryIndex]; //---retrieve
    const modalTitle = document.getElementById("exampleModalLabel");
    const modalBody = document.getElementById("modal-body");
  
    modalTitle.textContent = country.name.common;
  
    // -----Rest modal code
    const name = country.name.common || "N/A";
    const officialName = country.name.official || "N/A";
    const flag = country.flags.png || "";
    const capital = country.capital ? country.capital.join(", ") : "N/A";
    const region = country.region || "N/A";
    const subregion = country.subregion || "N/A";
    const population = country.population?.toLocaleString() || "N/A";
    const area = country.area?.toLocaleString() + " km²" || "N/A";
    const timezones = country.timezones?.join(", ") || "N/A";
    const borders = country.borders?.join(", ") || "N/A";
    const mapLink = country.maps?.googleMaps || "#";
    const languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "N/A";
    const currencies = country.currencies
      ? Object.values(country.currencies)
          .map((cur) => `${cur.name} (${cur.symbol})`)
          .join(", ")
      : "N/A";
  
    modalBody.innerHTML = `
      <img src="${flag}" alt="${name} flag" class="img-fluid mb-3" />
      <ul class="list-group text-start">
        <li class="list-group-item"><strong>Name:</strong> ${name} (${officialName})</li>
        <li class="list-group-item"><strong>Capital:</strong> ${capital}</li>
        <li class="list-group-item"><strong>Region:</strong> ${region}</li>
        <li class="list-group-item"><strong>Subregion:</strong> ${subregion}</li>
        <li class="list-group-item"><strong>Population:</strong> ${population}</li>
        <li class="list-group-item"><strong>Area:</strong> ${area}</li>
        <li class="list-group-item"><strong>Languages:</strong> ${languages}</li>
        <li class="list-group-item"><strong>Currencies:</strong> ${currencies}</li>
        <li class="list-group-item"><strong>Timezones:</strong> ${timezones}</li>
        <li class="list-group-item"><strong>Borders:</strong> ${borders}</li>
        <li class="list-group-item">
          <strong>Google Maps:</strong> <a href="${mapLink}" target="_blank">Open Map</a>
        </li>
      </ul>
    `;
  }
  

//----Map View Button
document.getElementById("mapViewBtn").addEventListener("click", () => {
  if (selectedCountry && selectedCountry.latlng) {
    const lat = selectedCountry.latlng[0];
    const lng = selectedCountry.latlng[1];
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  } else {
    alert("Please search for a country first...");
  }
});

//----Refresh Button
document.getElementById("refreshBtn").addEventListener("click", () => {
  document.getElementById("txtSearch").value = ""; // ----Clear search input
  selectedCountry = null; // ----Reset selected country
  index = 0; // ----Reset index
  loadCountries();
});

//----Load all countries by default
loadCountries();
