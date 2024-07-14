import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEmployees } from '../api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
});

const WorkerDetails = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const getWorker = async () => {
      try {
        const workers = await fetchEmployees();
        setWorker(workers[id]);
      } catch (error) {
        console.error(error.message);
      }
    };

    getWorker();
  }, [id]);

  if (!worker) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{worker.name.first} {worker.name.last}</h1>
      <img src={worker.picture.large} alt={`${worker.name.first} ${worker.name.last}`} />
      <p>Email: {worker.email}</p>
      <p>Phone: {worker.phone}</p>
      <p>Location: {worker.location.street.name}, {worker.location.city}, {worker.location.state}, {worker.location.country}</p>
      <MapContainer 
        center={[worker.location.coordinates.latitude, worker.location.coordinates.longitude]} 
        zoom={13} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[worker.location.coordinates.latitude, worker.location.coordinates.longitude]} 
        />
      </MapContainer>
    </div>
  );
};

export default WorkerDetails;
