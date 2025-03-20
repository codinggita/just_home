import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaBed, FaBath, FaCar, FaDog, FaCouch, FaCalendarAlt, FaMoneyBillWave, FaTags, FaUser, FaEnvelope, FaPhone, FaStar } from "react-icons/fa";
import Mainnavbar from "../Mainnav/Mainnavbar";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rentalDays, setRentalDays] = useState(0);
  const [totalRentalPrice, setTotalRentalPrice] = useState(0);

  useEffect(() => {
    fetch(`https://just-home.onrender.com/properties/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Property not found");
        }
        return res.json();
      })
      .then((data) => {
        setProperty(data);
        console.log("Property Data:", data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && property?.charmInfo?.listingType === "rent") {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(diffDays);
      const pricePerDay = property.charmInfo.price.amount;
      setTotalRentalPrice(diffDays * pricePerDay);
    }
  }, [startDate, endDate, property]);

  // Handler for booking button
  const handleBookClick = () => {
    if (!startDate || !endDate) {
      alert("Please select start and end dates to book the rental.");
      return;
    }
    alert(`Booking confirmed for ${rentalDays} days! Total: ${totalRentalPrice.toFixed(2)} ${property.charmInfo.price.currency}`);
  };

  if (loading) return <p className="loading">Loading property details...</p>;
  if (error || !property) return <p className="error">Property not found.</p>;

  console.log("Owner Data:", property.owner);

  return (
    <div>
      <Mainnavbar />
      <div className="property-container" style={{ marginTop: "65px" }}>
        {/* Left Section - Property Details */}
        <div className="property-info">
          <h1 className="property-title">{property.address.street}</h1>
          <p className="property-location">
            <FaMapMarkerAlt /> <p>{property.selectedCategory}</p> in {property.address.state}, {property.address.country}
          </p>

          {/* Key Details */}
          <div className="property-details">
            <span><FaBed /> {property.essentialInfo.bedrooms} Bedrooms</span>
            <span><FaBath /> {property.essentialInfo.bathrooms} Bathrooms</span>
            <span>
              <FaCalendarAlt /> Built in {new Date(property.createdAt).toLocaleDateString()}
            </span>
            {property.selectedFeatures.includes("Parking") && <span><FaCar /> Parking Available</span>}
          </div>

          {/* Status and Price Section */}
          <div className="property-status-price">
            {property.charmInfo.listingType === "rent" ? (
              <>
                <button className="rent-button">For Rent</button>
                <div className="rental-dates">
                  <label>
                    Start Date:
                    <input
                      type="date"
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </label>
                  <label>
                    End Date:
                    <input
                      type="date"
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      min={startDate ? new Date(startDate).toISOString().split("T")[0] : undefined}
                      disabled={!startDate}
                    />
                  </label>
                </div>
                {rentalDays > 0 && (
                  <p>
                    <FaCalendarAlt /> Rental Period: {rentalDays} days
                  </p>
                )}
                <h2 className="property-price">
                  <FaMoneyBillWave /> Total: {totalRentalPrice.toFixed(2)} {property.charmInfo.price.currency} ({property.charmInfo.price.amount} {property.charmInfo.price.currency} per day)
                </h2>
                <button className="action-button" onClick={handleBookClick}>
                  Book Now
                </button>
              </>
            ) : (
              <>
                <button className="sale-button">For Sale</button>
                <h2 className="property-price">
                  <FaMoneyBillWave /> {property.charmInfo.price.amount} {property.charmInfo.price.currency}
                </h2>
                <button className="action-button">
                  Contact Seller
                </button>
              </>
            )}
          </div>

          {/* Owner Information */}
          <div className="property-owner">
            <h3><FaUser /> Owned by {property.owner?.name}</h3>
            <p><FaEnvelope /> {property.owner?.email}</p>
            <p><FaPhone /> {property.owner?.phone}</p>
          </div>

          {/* Facilities Section */}
          <div className="property-facilities">
            <h2>What this place offers?</h2>
            <div className="facilities-grid">
              {property.selectedFeatures?.map((facility, index) => (
                <div key={index} className="facility-item">
                  {facility}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Property Image */}
        <div className="property-image-section">
          <img
            src={property.photos?.[0] ? `https://just-home.onrender.com${property.photos[0]}` : "/fallback-image.jpg"}
            alt={property.charmInfo.title}
            className="main-image"
          />
          <div className="other-images">
            {property.photos?.map((img, index) => (
              <img
                key={index}
                src={`https://just-home.onrender.com${img}`}
                alt={`Property image ${index + 1}`}
                className="small-image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;