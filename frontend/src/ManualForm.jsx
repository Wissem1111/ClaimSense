import { useState } from "react";

const initialValues = {
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
  amicableReport: "non",
  policeReport: "non",
  policeReceipt: "non",
  insuredDeclaration: "non",
  calledAssistance: "non",
  calledTowTruck: "non"
};

<label><i className="fas fa-user"></i> Nom complet</label>


export default function ManualForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="manual-form" onSubmit={handleSubmit}>
      <h2>Formulaire de déclaration</h2>

      {Object.keys(initialValues).map((key) => (
        <div key={key} className="form-group">
          <label>{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={key}
            value={form[key]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <button type="submit" className="primary-btn">Voir le résumé</button>
      <button type="button" className="stop-btn" onClick={onCancel}>
        Annuler
      </button>
    </form>
  );
}
