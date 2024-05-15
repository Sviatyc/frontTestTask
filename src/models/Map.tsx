import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDatabase, ref, get, set, push } from "firebase/database";
import { app } from "@/firebase/firebaseConfig";

function Map({ updateMarkers }) {
  const [markers, setMarkers] = useState([]);

  const fetchMarkers = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "markers");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setMarkers(Object.values(snapshot.val()));
    } else {
      console.log("No markers found in database");
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  useEffect(() => {
    fetchMarkers();
  }, [updateMarkers]);

  const addMarker = async (latlng) => {
    const { lat, lng } = latlng;
    const db = getDatabase(app);
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const newDocRef = push(ref(db, "markers"));
    set(newDocRef, {
      lat: lat,
      lng: lng,
      date: timestamp,
    })
      .then(() => {
        updateMarkers();
      })
      .catch((err) => console.log(err));
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(event) {
        addMarker(event.latlng);
      },
    });
    return null;
  };

  const handleMarkerDragEnd = (index) => (event) => {
    const { lat, lng } = event.target.getLatLng();
    const updatedMarkers = [...markers];
    updatedMarkers[index] = { ...updatedMarkers[index], lat, lng };
    setMarkers(updatedMarkers);
    updateMarker(index, lat, lng);
  };

  const updateMarker = async (index, lat, lng) => {
    const db = getDatabase(app);
    const markersRef = ref(db, "markers");
    const snapshot = await get(markersRef);
    if (snapshot.exists()) {
      const markersData = snapshot.val();
      markersData[index].lat = lat;
      markersData[index].lng = lng;
      setMarkers(Object.values(markersData));
      await set(markersRef, markersData);
    }
  };

  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <MapClickHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((mark, index) => {
          return (
            <Marker
              key={index}
              position={[mark.lat, mark.lng]}
              draggable={true}
              eventHandlers={{
                dragend: () => handleMarkerDragEnd(index),
              }}
            >
              <Popup>{`Marker number:${index + 1}`}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default Map;
