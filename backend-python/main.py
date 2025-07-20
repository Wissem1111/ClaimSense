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
    ("phone", "Quel est votre numero de telephone ?"),
    ("driverLicenseNumber", "Quel est votre numero de permis ?"),
    ("licenseValidityDate", "Date de validite du permis ?"),
]

declaration_questions = [
    ("incidentDate", "Date de l'accident ?"),
    ("incidentTime", "Heure de l'accident ?"),
    ("incidentLocation", "Lieu de l'accident ?"),
    ("vehicleRegistration", "Immatriculation du vehicule ?"),
    ("vehicleBrand", "Marque du vehicule ?"),
    ("incidentType", "Type d'accident ?"),
    ("incidentDetails", "Details de l'accident ?"),
    ("impactPoint", "Point d'impact ?"),
    ("circumstances", "Circonstances exactes ?"),
    ("amicableReport", "Constat amiable ? (oui/non)"),
    ("policeReport", "Police presente ? (oui/non)"),
    ("policeReceipt", "Recepisse de la police ? (oui/non)"),
    ("insuredDeclaration", "Declare a l'assurance ? (oui/non)"),
    ("calledAssistance", "Appele une assistance ? (oui/non)"),
    ("calledTowTruck", "Remorquage demande ? (oui/non)")
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
        stopped = False  # Allow new session after first call
        current_index = 0
        answers.clear()
        user_id = None

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
    
    try:
        raw = listen_to_user(question)
        corrected = correct_text(question, raw)
    except Exception as e:
        print("Erreur d'écoute ou de correction :", e)
        return {"error": str(e), "raw": "", "corrected": ""}
    
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
    declaration_data["engagement"] = "Je declare sur l'honneur que les informations sont exactes."
    declaration_data["status"] = "en attente"
    # Convertir "oui"/"non" en True/False
    declaration_data = normalize_booleans(declaration_data)

    r = requests.post("http://localhost:8080/api/declarations/vocal", json=declaration_data)

    try:
        r.raise_for_status()
        if r.text.strip():
            return {"message": "Declaration envoyee avec succes", "data": r.json()}
        else:
            return {"message": "Declaration envoyee mais reponse vide du serveur"}
    except Exception as e:
        print("Erreur lors de l'envoi de la declaration:", e)
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
        print("Erreur lors de la verification utilisateur:", e)

    print("Creation d'un nouvel utilisateur...")
    res = requests.post("http://localhost:8080/api/users", json=user_data)
    res.raise_for_status()
    return res.json()["idUser"]

@app.post("/skip-user")
def skip_user():
    global current_index, stopped
    current_index = len(user_questions)  # Sauter les questions utilisateur
    stopped = False                      # Permet au frontend de continuer normalement
    return {"skipped": True}

@app.post("/submit-manual")
def submit_manual(data: dict):
    print("Soumission reçue :", data)
    data = normalize_booleans(data)

    # Extract user fields with flexible key names
    user_data = {}
    for key, _ in user_questions:
        # Convert to snake_case using Python's string methods
        snake_key = ''.join(['_'+i.lower() if i.isupper() else i for i in key]).lstrip('_')
        user_data[key] = data.get(snake_key) or data.get(key)

    user_id = get_or_create_user(user_data)

    # Extract remaining fields
    declaration_data = {}
    for key, _ in declaration_questions:
        snake_key = ''.join(['_'+i.lower() if i.isupper() else i for i in key]).lstrip('_')
        declaration_data[key] = data.get(snake_key) or data.get(key)

    declaration_data["idUser"] = user_id
    declaration_data["engagement"] = "Je declare sur l'honneur que les informations sont exactes."
    declaration_data["status"] = "en attente"
    r = requests.post("http://localhost:8080/api/declarations/vocal", json=declaration_data)

    try:
        r.raise_for_status()
        return {"message": "Declaration envoyee", "data": r.json()}
    except Exception as e:
        return {"error": str(e)}

@app.get("/history")
def get_user_history(fullName: str, dateOfBirth: str):
    try:
        res = requests.get("http://localhost:8080/api/users/search", params={
            "fullName": fullName,
            "dateOfBirth": dateOfBirth
        })
        res.raise_for_status()
        user = res.json()

        if not user or "idUser" not in user:
            return {"history": []}

        user_id = user["idUser"]
        decls = requests.get(f"http://localhost:8080/api/declarations/user/{user_id}")
        decls.raise_for_status()

        return {"history": decls.json()}
    except Exception as e:
        print("Erreur historique:", e)
        return {"error": str(e)}
