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
  skipUserQuestions 
} from "./api";


function App() {
  const [stage, setStage] = useState("start"); // start | asking | summary and
  const [question, setQuestion] = useState("");
  const [raw, setRaw] = useState("");
  const [corrected, setCorrected] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);


  
  
  const fetchNext = async () => {
  const data = await getCurrentQuestion();
  if (data.done) {
    setStage("summary");
  } else {
    setQuestion(data.question);
    setRaw("");
    setCorrected("");
    if (data.userExists) {
      setStage("user-found");
    } else {
      setStage("asking");
    }
  }
};


  


const handleListen = async () => {
    setLoading(true);
    const data = await listenAndCorrect();
    setRaw(data.raw);
    setCorrected(data.corrected);
    setLoading(false);
  };

  
  
  
  const handleConfirm = async (ok) => {
    if (ok && question) {
      const key = question.split("?")[0].toLowerCase().replace(/[^a-z0-9]/g, "_");
      setAnswers((prev) => ({ ...prev, [key]: corrected }));
    }
    await confirmAnswer(ok);
    fetchNext();
  };

  
  
  const handleSubmit = async () => {
  let result;
    try {
    if (Object.keys(answers).length >= 15) {
      result = await submitManualDeclaration(answers);
    } else {
      result = await submitDeclaration();
    }

    alert(result?.message || "Erreur lors de l'envoi");
    handleRestart();
  } catch (error) {
    console.error("Erreur lors de la soumission :", error);
    alert("Une erreur s'est produite lors de l'envoi de la déclaration.");
  }
  };




  const handleRestart = async () => {
    await stopProcess();
    setQuestion("");
    setRaw("");
    setCorrected("");
    setAnswers({});
    setStage("start");
  };

  
  
  
  
  const generateStyledPDF = () => {
  const doc = new jsPDF();

  // 1. Titre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); // bleu stylisé
  doc.text("Déclaration d'Assurance", 105, 20, null, null, "center");

  // 2. Sous-titre
  doc.setFontSize(14);
  doc.setTextColor(33, 33, 33);
  doc.text("Résumé généré automatiquement", 105, 30, null, null, "center");

  // 3. Tableau des réponses
  const tableBody = Object.entries(answers).map(([key, value]) => [
    key.replace(/_/g, " ").toUpperCase(),
    value,
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

  // 4. Signature ou note en bas
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(
    "Je déclare sur l'honneur que les informations fournies sont exactes.",
    20,
    doc.internal.pageSize.height - 30
  );
  doc.text("Signature électronique : ____________________", 20, doc.internal.pageSize.height - 20);

  // 5. Sauvegarde
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
      alert("Aucune déclaration trouvée.");
    }
  } catch (error) {
    console.error("Erreur historique:", error);
    alert("Impossible de récupérer l'historique.");
  }
};



const generateHistoryPDF = (data) => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text("Historique de Déclaration", 105, 20, null, null, "center");

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




  
  return (
    <div className="app-container">
      <h1>Assistant Vocal Intelligent</h1>

      {stage === "start" && (
        <div className="start-options">
          <h2>Choisissez votre mode :</h2>
          <button className="primary-btn" onClick={fetchNext}>
            Répondre par la voix
          </button>
          <button className="secondary-btn" onClick={() => setStage("form")}>
            Remplir un formulaire
          </button>
        </div>
      )}


      {stage === "form" && (
        <ManualForm
        onSubmit={(data) => {
        setAnswers(data);
        setStage("summary");
      }}
        onCancel={handleRestart}
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
            <button className="stop-btn" onClick={handleRestart}>Arrêter</button>
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
              <strong>Déclaration #{i + 1}</strong><br />
              <span>Date : {d.incidentDate} | Lieu : {d.incidentLocation}</span><br />
              <button className="secondary-btn" onClick={() => generateHistoryPDF(d)}>
                Télécharger PDF
              </button>
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
          <ul>
            {Object.entries(answers).map(([k, v]) => (
              <li key={k}><strong>{k.replace(/_/g, " ")}:</strong> {v}</li>
            ))}
          </ul>

          <button className="primary-btn" onClick={handleSubmit}>Envoyer</button>
          <button className="secondary-btn" onClick={generateStyledPDF}>Télécharger le PDF</button>
          <button className="stop-btn" onClick={handleRestart}>Recommencer</button>
          <button className="secondary-btn" onClick={fetchHistory}> Voir l'historique </button>

        </div>
      )}
    </div>
  );
}

export default App;
