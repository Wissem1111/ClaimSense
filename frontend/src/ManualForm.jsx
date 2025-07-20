import React, { useState } from "react";
import "./index.css";

const ManualForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    driverLicenseNumber: "",
    licenseValidityDate: "",

    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    vehicleRegistration: "",
    vehicleBrand: "",
    incidentType: "",
    incidentDetails: "",
    impactPoint: "",
    circumstances: "",
    amicableReport: false,
    policeReport: false,
    policeReceipt: false,
    insuredDeclaration: false,
    calledAssistance: false,
    calledTowTruck: false,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue;

    if (type === "radio") {
      newValue = value === "true";
    } else {
      newValue = value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
    <div className="form-row">
      <div className="form-group">
        <label>Nom Complet: </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="input"
          />
      </div>

      <div className="form-group">
      <label>Date de Naissance: </label>
        <input
          type="date"
          name="dateOfBirth"
          required
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
      <label> Téléphone:</label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
      <label> Numéro de Permis: </label>
        <input
          type="text"
          name="driverLicenseNumber"
          required
          value={formData.driverLicenseNumber}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
      <label>Date de validite du permis: </label>
        <input
          type="date"
          name="licenseValidityDate"
          required
          value={formData.licenseValidityDate}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
      <label>Date de l'accident :</label>
        <input
          type="date"
          name="incidentDate"
          required
          value={formData.incidentDate}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
      <label>Heure de l'accident : </label>
        <input
          type="hour"
          name="incidentTime"
          required
          value={formData.incidentTime}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
      <label>Lieu de l'accident: </label>
        <input
          type="text"
          name="incidentLocation"
          required
          value={formData.incidentLocation}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
      <label>Immatriculation du vehicule:</label>
        <input
          type="text"
          name="vehicleRegistration"
          required
          value={formData.vehicleRegistration}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
      <label>Marque du vehicule: </label>
        <input
          type="text"
          name="vehicleBrand"
          required
          value={formData.vehicleBrand}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
      <label>Type d'accident: </label>
        <input
          type="text"
          name="incidentType"
          required
          value={formData.incidentType}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
      <label> Details de l'accident: </label>
        <input
          type="text"
          name="incidentDetails"
          required
          value={formData.incidentDetails}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
      <label>Point d'impact: </label>
        <input
          type="text"
          name="impactPoint"
          required
          value={formData.impactPoint}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="form-group">
      <label>Circonstances exactes: </label>
        <input
          type="text"
          name="circumstances"
          required
          value={formData.circumstances}
          onChange={handleChange}
          className="input"
        />
        </div>
    </div>
    <div className="radio-question-container">
      {[
        { label: "Constat amiable ?", name: "amicableReport" },
        { label: "Police presente ?", name: "policeReport" },
        { label: "Recepisse de la police ?", name: "policeReceipt" },
        { label: "Declare a l'assurance ?", name: "insuredDeclaration" },
        { label: "Appele une assistance ?", name: "calledAssistance" },
        { label: "Remorquage demande ?", name: "calledTowTruck" },
      ].reduce((acc, field, index, array) => {
        if (index % 2 === 0) {
          acc.push(array.slice(index, index + 2));
        }
        return acc;
      }, []).map((pair, i) => (
        <div key={i} className="question-row">
          {pair.map((field) => (
            <div key={field.name} className="question-group">
              <p>{field.label}</p>
              <label>
                <input
                  type="radio"
                  name={field.name}
                  required
                  value="true"
                  checked={formData[field.name] === true}
                  onChange={handleChange}
                />
                Oui
              </label>
              <label>
                <input
                  type="radio"
                  name={field.name}
                  required
                  value="false"
                  checked={formData[field.name] === false}
                  onChange={handleChange}
                />
                Non
              </label>
            </div>
          ))}
        </div>
       ))}
      </div>


      <div className="button-container">
        <button type="submit" className="primary-btn">
          Soumettre
        </button>
        <button type="button" 
         onClick={  
          onCancel}
          className="stop-btn mt-2">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default ManualForm;
