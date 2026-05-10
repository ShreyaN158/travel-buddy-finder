import {
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
}