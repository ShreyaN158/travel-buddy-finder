import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapClickHandler({
  setSelectedLocation,
  setDestinationName,
  setAttractions,
  setPlaceName
}) {

  useMapEvents({

    async click(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setSelectedLocation({
        lat,
        lng
      });

      // GET PLACE NAME

      const locationRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const locationData = await locationRes.json();

      const actualPlace =
        locationData.address?.city ||
        locationData.address?.town ||
        locationData.address?.village ||
        locationData.display_name;

      setPlaceName(actualPlace);

      setDestinationName(actualPlace);

      // GET TOURIST ATTRACTIONS

      const overpassQuery = `
      [out:json];
      (
        node
          ["tourism"="attraction"]
          (around:10000,${lat},${lng});
      );
      out;
      `;

      const attractionRes = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: overpassQuery
        }
      );

      const attractionData = await attractionRes.json();

      const places = attractionData.elements.map(item => ({
        name:
          item.tags?.name ||
          "Tourist Attraction",
        lat: item.lat,
        lon: item.lon
      }));

      setAttractions(places.slice(0, 8));
    }

  });

  return null;
}

export default function LocationPicker({
  setSelectedLocation,
  setDestinationName,
  setAttractions,
  setPlaceName
}) {

  return (

    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "20px",
        marginBottom: "20px"
      }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler
        setSelectedLocation={setSelectedLocation}
        setDestinationName={setDestinationName}
        setAttractions={setAttractions}
        setPlaceName={setPlaceName}
      />

    </MapContainer>
  );
}