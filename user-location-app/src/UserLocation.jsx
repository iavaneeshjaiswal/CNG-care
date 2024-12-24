import React, { useState, useEffect } from "react";

const UserLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const [mapUrl, setMapUrl] = useState("");

  // Function to get the user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      // Use the geolocation API to fetch the user's position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If successful, update state with latitude and longitude
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLocation({
            latitude: lat,
            longitude: lon,
            error: null,
            loading: false,
          });

          // Construct the Google Maps URL with the retrieved coordinates
          const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
          setMapUrl(googleMapsUrl); // Update the map URL state
        },
        (error) => {
          // Handle error (e.g. permission denied, position unavailable)
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
            loading: false,
          });
        }
      );
    } else {
      // If geolocation is not supported
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      });
    }
  };

  // Use the useEffect hook to get the location when the component mounts
  useEffect(() => {
    getLocation(); // Fetch location when the component mounts
  }, []); // Empty array means this will run only once when the component mounts

  return (
    <div>
      <h2>User Location</h2>
      {location.loading ? (
        <p>Loading...</p>
      ) : location.error ? (
        <p>Error: {location.error}</p>
      ) : (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </p>
        </div>
      )}
      <button onClick={getLocation}>Get Location Again</button>
    </div>
  );
};

export default UserLocation;
