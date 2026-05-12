/*import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete
} from "@react-google-maps/api";

import { useState, useRef } from "react";

export default function LocationPicker({
  setSelectedLocation,
  setDestinationName
}) {

  const [marker, setMarker] = useState({
    lat: 12.9716,
    lng: 77.5946
  });

  const autoRef = useRef();

  const handlePlaceChanged = () => {

    const place = autoRef.current.getPlace();

    if (!place.geometry) return;

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    setMarker(location);

    setSelectedLocation(location);

    setDestinationName(place.formatted_address);
  };

  const handleClick = (e) => {

    const newPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    setMarker(newPos);

    setSelectedLocation(newPos);
  };

  return (

    <LoadScript
      googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
      libraries={["places"]}
    >

      <Autocomplete
        onLoad={(ref) => autoRef.current = ref}
        onPlaceChanged={handlePlaceChanged}
      >

        <input
          type="text"
          placeholder="Search destination"
          style={{
            width: "100%",
            height: "45px",
            marginBottom: "15px"
          }}
        />

      </Autocomplete>

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "350px",
          borderRadius: "20px"
        }}
        center={marker}
        zoom={8}
        onClick={handleClick}
      >

        <Marker position={marker} />

      </GoogleMap>

    </LoadScript>
  );
}*/


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";

import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// FIX MARKER ICONS
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ setSelectedLocation, setDestinationName }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      setPosition(location);
      setSelectedLocation(location);

      setDestinationName(
        `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
      );
    }
  });

  return position ? (
    <Marker position={position}>
      <Popup>Destination Selected</Popup>
    </Marker>
  ) : null;
}

function LocationPicker({ setSelectedLocation, setDestinationName }) {
  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={5}
      style={{ height: "400px", width: "100%", borderRadius: "20px", marginTop: "15px" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap &copy; CARTO"
      />

      <LocationMarker
        setSelectedLocation={setSelectedLocation}
        setDestinationName={setDestinationName}
      />
    </MapContainer>
  );
}

export default LocationPicker;