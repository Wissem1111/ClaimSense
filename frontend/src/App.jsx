import { useState } from "react";
import "./index.css";
import ManualForm from "./ManualForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getCurrentQuestion,
  listenAndCorrect,
  confirmAnswer,
  stopProcess,
  submitDeclaration,
  submitManualDeclaration,
  skipUserQuestions,
} from "./api";



import { updateDeclarationStatus } from "./api"; 
function StatusUpdateButtons({ declarationId, currentStatus, onUpdated }) {
  const handleChange = async (newStatus) => {
    try {
      const updated = await updateDeclarationStatus(declarationId, newStatus);
      alert("Statut mis à jour: " + updated.status);
      if (onUpdated) onUpdated(updated);
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  return (
    <div style={{ marginTop: "8px" }}>
      {currentStatus === "en_attente" && (
        <button className="secondary-btn" onClick={() => handleChange("en_cours")}>
          Démarrer traitement
        </button>
      )}
      {currentStatus === "en_cours" && (
        <>
          <button className="secondary-btn" onClick={() => handleChange("validée")}>Valider</button>
          <button className="stop-btn" onClick={() => handleChange("refusée")}>Refuser</button>
        </>
      )}
    </div>
  );
}









function formatDateFR(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // fallback if invalid
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


  function App() {
  const [historyStack, setHistoryStack] = useState([]);
  const [stage, setStage] = useState("start");
  const [question, setQuestion] = useState("");
  const [raw, setRaw] = useState("");
  const [corrected, setCorrected] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [submitted, setSubmitted] = useState(false); 
  const [currentKey, setCurrentKey] = useState("");



  const startVoiceSession = async () => {
  await stopProcess();
  setStage("asking");
  setAnswers({});
  setRaw("");
  setCorrected("");
  setQuestion("");
  setSubmitted(false);
  setLoading(false);
  fetchNext();  
};


  const fetchNext = async () => {
    setLoading(true); 
    const data = await getCurrentQuestion();
    setLoading(false); 
    if (data.done) {
      setStage("summary");
    } else {
      setQuestion(data.question);
      setCurrentKey(data.key); 
      setRaw("");
      setCorrected("");
      if (data.userExists) {
        setStage("user-found");
      } else {
        setStage("asking");
      }
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (stage === "summary" && Object.keys(answers).length > 0) {
        playStoSend();
        const result = await submitManualDeclaration(answers);
        setSubmitted(true);
        alert(result?.message || "Erreur lors de l'envoi");
        
      } else {
        const result = await submitDeclaration(answers);
        setSubmitted(true);
        alert(result?.message || "Erreur lors de l'envoi");
        
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite lors de l'envoi de la declaration.");
    }
  };

const playBeep = () => {
  const audio = new Audio("/beep.mp3");
  audio.play();
};

const playStopBeep = () => {
  const audio = new Audio("/stop-beep.mp3");
  audio.play();
};

const playStoSend = () => {
  const audio = new Audio("/send.mp3");
  audio.play();
};



const handleListen = async () => {
  setLoading(true);
  playBeep();
  const data = await listenAndCorrect();
  setRaw(data.raw);
  setCorrected(data.corrected);
  setLoading(false);
};

  
  const handleConfirm = async (ok) => {
  if (ok && currentKey) {
    setAnswers((prev) => ({ ...prev, [currentKey]: corrected }));
  }
  await confirmAnswer(ok);
  fetchNext();
};
  

  const fieldLabels = {
  fullName: "Nom complet",
  dateOfBirth: "Date de naissance",
  phone: "Téléphone",
  driverLicenseNumber: "Numéro de permis",
  licenseValidityDate: "Validité du permis",
  incidentDate: "Date de l'incident",
  incidentTime: "Heure de l'incident",
  incidentLocation: "Lieu de l'incident",
  vehicleRegistration: "Immatriculation du véhicule",
  vehicleBrand: "Marque du véhicule",
  incidentType: "Type d'incident",
  incidentDetails: "Détails de l'incident",
  impactPoint: "Point d'impact",
  circumstances: "Circonstances",
  amicableReport: "Constat à l'amiable",
  policeReport: "Rapport de police",
  policeReceipt: "Récépissé de police",
  insuredDeclaration: "Déclaration de l'assuré",
  calledAssistance: "Assistance appelée",
  calledTowTruck: "Dépanneuse appelée",
  status: "Statut de traitement",
};


  const handleRestart = async () => {
    await stopProcess();
    setQuestion("");
    setRaw("");
    setCorrected("");
    setAnswers({});
    setStage("start");
    setHistoryStack([]); 

  };
 
  const generateStyledPDF = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); 
  doc.text("Declaration d'Assurance", 105, 20, null, null, "center");

  const tableBody = Object.entries(answers).map(([key, value]) => [
    fieldLabels[key] || key.replace(/_/g, " ").toUpperCase(),
    typeof value === "boolean" ? (value ? "Oui" : "Non") : value,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Champ", "Valeur"]],
    body: tableBody,
    styles: {
      fontSize: 11,
      halign: 'left',
      valign: 'middle',
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { top: 40 },
  });

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(
    "Je declare sur l'honneur que les informations fournies sont exactes.",
    20,
    doc.internal.pageSize.height - 30
  );
  doc.text("Signature electronique", 20, doc.internal.pageSize.height - 20);

  doc.save("declaration-assurance.pdf");
};

const fetchHistory = async () => {
  const fullName = answers.fullName || "";
  const dateOfBirth = answers.dateOfBirth || "";

  try {
    const res = await fetch(`http://localhost:8000/history?fullName=${encodeURIComponent(fullName)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`);
    const data = await res.json();

      if (Array.isArray(data.history)) {
      setHistory(data.history);
      setStage("history");
    } else {
      alert("Aucune declaration trouvee.");
    }
  } catch (error) {
    console.error("Erreur historique:", error);
    alert("Impossible de recuperer l'historique.");
  }
};

const generateHistoryPDF = (data) => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text("Historique de Declaration", 105, 20, null, null, "center");

  const tableData = Object.entries(data).map(([key, value]) => [
    key.replace(/_/g, " ").toUpperCase(),
    String(value),
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Champ", "Valeur"]],
    body: tableData,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  });

  doc.save(`declaration-${data.incidentDate}.pdf`);
};



  const goToStage = (next) => {
    setHistoryStack((stack) => [...stack, stage]);
    setStage(next);
  };

  const goBack = () => {
    setHistoryStack((stack) => {
      if (stack.length === 0) {
        handleRestart();
        return [];
      }
      const newStack = [...stack];
      const prev = newStack.pop();
      setStage(prev);
      return newStack;
    });
  };
 
  return (
    <div className="app-container">
        <div className="header">
        {stage !== "start" && (
          <button
            className="back-button"
            onClick={goBack}
          >
            Retour
          </button>
        )}
        <h1>ClaimSense</h1>
      </div>
    <h4>Assistant Vocal Intelligent</h4>

      {stage === "start" && (
        <div className="start-options">
          <h2>Choisissez votre mode</h2>
          <button
  className="primary-btn"
  onClick={startVoiceSession}
>
  Répondre par la voix
</button>
          <button className="secondary-btn" onClick={() => goToStage("form")}>
            Remplir un formulaire
          </button>
        </div>
      )}


      {loading && <div className="loader">⏳ Veuillez parler...</div>}



      {stage === "form" && (
        <ManualForm
          onSubmit={(data) => {
            setAnswers(data);
            setSubmitted(false);
            setStage("summary");
          }}
          onCancel={() => {
            playStopBeep();
            handleRestart();
          }}
        />
      )}


      {stage === "asking" && (
        <div className="question-box">
          <h2>Question</h2>
          <p>{question}</p>

          <button className="primary-btn" onClick={handleListen} disabled={loading}>
            {loading ? " Écoute..." : " Parler"}
          </button>

          {raw && (
            <>
              <h3>Votre réponse</h3>
              <p className="response">{raw}</p>

              <h3>Correction</h3>
              <p className="corrected">{corrected}</p>

              <div>
                <button className="confirm-btn" onClick={() => handleConfirm(true)}>Confirmer</button>
                <button className="cancel-btn" onClick={() => handleConfirm(false)}>Répéter</button>
              </div>
            </>
          )}

          <div style={{ marginTop: "20px" }}>
            <button className="stop-btn" onClick={() =>{handleRestart(); playStopBeep();}}>Arrêter</button>
          </div>
        </div>
      )}


      {stage === "user-found" && (
        <div className="user-box">
        <h2>Utilisateur déjà connu</h2>
        <p>Nous avons reconnu vos informations précédentes.</p>
        <button className="primary-btn" onClick={async () => {
          await skipUserQuestions();
          const next = await getCurrentQuestion();
          if (next.done) {
            setStage("summary");
          } else {
             setQuestion(next.question);
             setStage("asking");
          }
          }}
        >
  Passer à la déclaration
</button>
        <button className="stop-btn" onClick={handleRestart}>
          Recommencer une nouvelle déclaration
        </button>
        </div>
      )}


      {stage === "history" && (
        <div className="summary-box">
          <h2>Historique des Déclarations</h2>
          {history.length === 0 ? (
           <p>Aucune déclaration disponible.</p>
          ) : (
          <ul>
          {history.map((d, i) => (
  <li key={i}>
    <strong>Déclaration {i + 1}</strong><br />
    <span>
      Date : {formatDateFR(d.incidentDate)} <br />
      Lieu : {d.incidentLocation} <br />
      Statut : {d.status || "Non défini"}
    </span><br />

    <button className="secondary-btn" onClick={() => generateHistoryPDF(d)}>
      Télécharger PDF
    </button>

    <StatusUpdateButtons
      declarationId={d.idDeclaration}
      currentStatus={d.status}
      onUpdated={(updated) => {
        setHistory((prev) =>
          prev.map((item) =>
            item.idDeclaration === updated.idDeclaration ? updated : item
          )
        );
      }}
    />
  </li>
))}

          </ul>
          )}
          <button className="stop-btn" onClick={handleRestart}>Retour</button>
        </div>
      )}
  
      {stage === "summary" && (
        <div className="summary-box">
              <h2>Résumé</h2>
              <ul className="summary-list">
                {Object.entries(answers).map(([k, v]) => (
                <li key={k}>
                  <strong>{fieldLabels[k] || k} :</strong><br />
                  {typeof v === "boolean" ? v ? "Oui" : "Non" : String(v)}
                </li>
                ))}
              </ul>

          {!submitted && (
            <button className="primary-btn" onClick={handleSubmit}>Envoyer</button>
          )}

          {submitted && (
           <>
            <button className="secondary-btn" onClick={generateStyledPDF}>Télécharger le PDF</button>
            <button className="stop-btn" onClick={handleRestart}>Recommencer</button>
            <button className="secondary-btn" onClick={fetchHistory}>Voir l'historique</button>
           </>
          )}

        </div>
      )}




    </div>
  );
}
export default App;
