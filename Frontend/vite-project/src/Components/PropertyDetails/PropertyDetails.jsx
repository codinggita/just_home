import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="property-loading">Loading property details...</p>;
  if (!property) return <p className="property-not-found">Property not found.</p>;

  return (
    <div className="property-details-container">
      <h1 className="property-title">{property.title}</h1>
      <img src={property.coverimg} alt={property.title} className="property-image" />
      <p className="property-type">{property.propertyType}</p>
      <p className="property-location">📍 {property.location}</p>
      <p className="property-price">💰 Price: <strong>${property.price}</strong></p>
      <p className="property-description">{property.description}</p>
    </div>
  );
};

export default PropertyDetails;
