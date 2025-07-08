import { useState } from "react";
import "./index.css";
import {
  getCurrentQuestion,
  listenAndCorrect,
  confirmAnswer,
  stopProcess,
  submitDeclaration,
  skipUserQuestions 
} from "./api";


function App() {
  const [stage, setStage] = useState("start"); // start | asking | summary and
  const [question, setQuestion] = useState("");
  const [raw, setRaw] = useState("");
  const [corrected, setCorrected] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

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
    const result = await submitDeclaration();
    alert(result.message || "Erreur lors de l'envoi");
    handleRestart();
  };

  const handleRestart = async () => {
    await stopProcess();
    setQuestion("");
    setRaw("");
    setCorrected("");
    setAnswers({});
    setStage("start");
  };

  return (
    <div className="app-container">
      <h1>Assistant Vocal Intelligent</h1>

      {stage === "start" && (
        <button className="primary-btn" onClick={fetchNext}>
          Démarrer
        </button>
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


      {stage === "summary" && (
        <div className="summary-box">
          <h2>Résumé</h2>
          <ul>
            {Object.entries(answers).map(([k, v]) => (
              <li key={k}><strong>{k.replace(/_/g, " ")}:</strong> {v}</li>
            ))}
          </ul>

          <button className="primary-btn" onClick={handleSubmit}>Envoyer</button>
          <button className="stop-btn" onClick={handleRestart}>Recommencer</button>
        </div>
      )}
    </div>
  );
}

export default App;
