from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from speech_to_text import listen_to_user
from ai_correction import correct_text

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define questions
user_questions = [
    ("fullName", "Quel est votre nom complet ?"),
    ("dateOfBirth", "Quelle est votre date de naissance ?"),
    ("phone", "Quel est votre numéro de téléphone ?"),
    ("driverLicenseNumber", "Quel est votre numéro de permis ?"),
    ("licenseValidityDate", "Date de validité du permis ?"),
]

declaration_questions = [
    ("incidentDate", "Date de l'accident ?"),
    ("incidentTime", "Heure de l'accident ?"),
    ("incidentLocation", "Lieu de l'accident ?"),
    ("vehicleRegistration", "Immatriculation du véhicule ?"),
    ("vehicleBrand", "Marque du véhicule ?"),
    ("incidentType", "Type d'accident ?"),
    ("incidentDetails", "Détails de l'accident ?"),
    ("impactPoint", "Point d'impact ?"),
    ("circumstances", "Circonstances exactes ?"),
    ("amicableReport", "Constat amiable ? (oui/non)"),
    ("policeReport", "Police présente ? (oui/non)"),
    ("policeReceipt", "Récépissé de la police ? (oui/non)"),
    ("insuredDeclaration", "Déclaré à l'assurance ? (oui/non)"),
    ("calledAssistance", "Appelé une assistance ? (oui/non)"),
    ("calledTowTruck", "Remorquage demandé ? (oui/non)")
]

questions = user_questions + declaration_questions

current_index = 0
answers = {}
user_id = None
stopped = False

class ConfirmModel(BaseModel):
    confirm: bool


def normalize_booleans(data):
    for key in data:
        if isinstance(data[key], str):
            val = data[key].strip().lower()
            if val == "oui":
                data[key] = True
            elif val == "non":
                data[key] = False
    return data


@app.get("/current-question")
def current_question():
    global current_index, stopped, user_id

    if stopped:
        return {"done": True, "userExists": bool(user_id)}

    if current_index >= len(questions):
        return {"done": True, "userExists": bool(user_id)}

    key, question = questions[current_index]

    return {
        "done": False,
        "key": key,
        "question": question,
        "userExists": user_id is not None and current_index == len(user_questions)
    }


@app.get("/listen")
def listen():
    global current_index
    if current_index >= len(questions):
        return {"raw": "", "corrected": ""}
    key, question = questions[current_index]
    raw = listen_to_user(question)
    corrected = correct_text(question, raw)
    answers[key] = corrected
    return {"raw": raw, "corrected": corrected}

@app.post("/confirm")
def confirm(model: ConfirmModel):
    global current_index, user_id

    if model.confirm:
        current_index += 1

        # Register user after user questions
        if current_index == len(user_questions):
            user_data = {k: answers[k] for k, _ in user_questions}
            user_id = get_or_create_user(user_data)
    return {"confirmed": model.confirm}

@app.post("/stop")
def stop():
    global current_index, answers, user_id, stopped
    current_index = 0
    answers = {}
    user_id = None
    stopped = True
    return {"message": "Process stopped"}

@app.post("/submit")
def submit():
    global answers, user_id
    declaration_data = {k: answers[k] for k, _ in declaration_questions}
    declaration_data["idUser"] = user_id
    declaration_data["engagement"] = "Je déclare sur l'honneur que les informations sont exactes."

    # Convertir "oui"/"non" en True/False
    declaration_data = normalize_booleans(declaration_data)

    r = requests.post("http://localhost:8080/api/declarations/vocal", json=declaration_data)

    try:
        r.raise_for_status()
        if r.text.strip():
            return {"message": "Déclaration envoyée avec succès", "data": r.json()}
        else:
            return {"message": "Déclaration envoyée mais réponse vide du serveur"}
    except Exception as e:
        print("Erreur lors de l'envoi de la déclaration:", e)
        return {"error": str(e), "response": r.text}



def get_or_create_user(user_data):
    try:
        res = requests.get("http://localhost:8080/api/users/search", params={
            "fullName": user_data["fullName"],
            "dateOfBirth": user_data["dateOfBirth"]
        })

        if res.status_code == 200 and res.json():
            print("Utilisateur trouvé dans la base")
            return res.json()["idUser"]
    except Exception as e:
        print("Erreur lors de la vérification utilisateur:", e)

    print("Création d'un nouvel utilisateur...")
    res = requests.post("http://localhost:8080/api/users", json=user_data)
    res.raise_for_status()
    return res.json()["idUser"]

@app.post("/skip-user")
def skip_user():
    global current_index, stopped
    current_index = len(user_questions)  # Sauter les questions utilisateur
    stopped = False                      # Permet au frontend de continuer normalement
    return {"skipped": True}

