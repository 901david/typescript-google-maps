import axios from "axios";

const findEl = (selector: string) => document.querySelector(selector);

const formEl = findEl("form");

const GOOGLE_API_KEY = "API_KEY";

type GoogleGeoCodeResponseItem = {
  geometry: { location: { lat: number; lng: number } };
};
type GoogleGeoCodeResponse = {
  results: GoogleGeoCodeResponseItem[];
  status: "OK" | "NO RESULTS";
};

interface MapArgs {
  lat: number;
  lng: number;
}

const initMap = (
  center: MapArgs = { lat: -34.397, lng: 150.644 },
  zoom: number = 12
) => {
  const coords = { center, zoom };
  const map = new google.maps.Map(findEl("#map")!, coords);
  var marker = new google.maps.Marker({ position: center, map: map });
  console.log(marker);
};

const formHandler = async (event: Event) => {
  event.preventDefault();
  const addressInput = <HTMLInputElement>findEl("#address");
  const enteredAddress = addressInput!.value;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    enteredAddress
  )}&key=${GOOGLE_API_KEY}`;
  try {
    const geoResults = await axios.get<GoogleGeoCodeResponse>(url);
    if (geoResults.data.status !== "OK") {
      throw new Error("Place not found");
    }
    initMap(geoResults.data.results[0].geometry.location);
  } catch (err) {
    if (err) console.log("ERROR: ", err);
  }
};

formEl!.addEventListener("submit", formHandler);
