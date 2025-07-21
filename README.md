
# ClaimSense – Assistant Vocal Intelligent pour Déclarations d’Assurance

Ce projet vise à simplifier la déclaration la déclaration de sinistres automobiles. Elle combine l'intelligence artificielle, la reconnaissance vocale, et une interface utilisateur intuitive pour offrir une expérience fluide, rapide et inclusive, particulièrement utile pour les personnes âgées ou non technophiles.

---

## Fonctionnalités principales

-  **Déclaration vocale** via un assistant IA (STT & NLP)  
-  **Formulaire manuel** avec saisie guidée  
-  **Correction intelligente** du texte vocal  
-  **Génération automatique de PDF**  
-  **Historique des déclarations**  
-  **Authentification & sécurité**  
-  **Suivi du statut** (_en attente_, _en cours_, _validée_, _refusée_)  
-  **Interface responsive** et moderne (React + Bootstrap)

---

## Structure du projet

```
ClaimSense/
│
├── frontend/                # Application React.js
│   ├── public/
│   │   ├── beep.mp3     
│   │   ├── icon.ico
│   │   └── send.mp3 
│   │   ├── stop-beep.mp3 
│   ├── src/
│   │   ├── api.js    
│   │   ├── App.jsx
│   │   └── index.css
│   │   ├── main.jsx
│   │   └── ManualForm.jsx
│
├── backend-python/          # Serveur vocal IA (FastAPI)
│   ├── main.py              # Point d’entrée FastAPI
│   ├── speech_to_text.py    # speech recognition
│   ├── ai_correction.py     # Correction automatique du texte
│   └── requirements.txt
│
├── backend-java/            # Backend principal (Spring Boot)
│   ├── client/
│   ├── controller/         # Points d’entrée API
│   ├── service/            # Logique métier
│   ├── dto/                # Data Transfer Objects
│   ├── model/              # Entités JPA
│   ├── repositoriy/        # Accès aux données
│   └── exception/          
│
├── database/                # SQL & config DB (MySQL)
├── README.md                # Documentation du projet
```

---

## Technologies utilisées

| Domaine            | Technologies                          |
|--------------------|----------------------------------------|
| Frontend           | React.js, Bootstrap                    |
| Backend principal  | Spring Boot, Java, JPA, pgAdmin 4      |
| Backend vocal      | FastAPI, Python, SpeechRecognition     |
| IA (correction)    | NLP personnalisé (Python)              |
| Authentification   |      Spring Security                   |
| Fichiers PDF       | jsPDF (React.js)                       |

---

## Lancer le projet localement

### 1. Cloner le dépôt
```bash
git clone https://github.com/Wissem1111/ClaimSense.git
cd ClaimSense
```

### 2. Backend Spring Boot (Java)
- Configurer `application.properties` avec vos infos MySQL
- Lancer via IDE ou en ligne de commande :
```bash
./mvnw spring-boot:run
```

### 3. Backend IA (Python – FastAPI)
```bash
cd backend-python
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Frontend React
```bash
cd frontend
npm install
npm start
```

---

## Aperçu de l'application

> _Une interface claire, un processus rapide, et un suivi intelligent._
<img width="1385" height="865" alt="Screenshot 2025-07-21 012630" src="https://github.com/user-attachments/assets/7482c554-f013-464a-a9b4-70d82e305683" />


---

##  Exemple de flux utilisateur

1. L'utilisateur clique sur "Déclarer par voix" et parle.  
2. Le texte est transcrit, corrigé et validé.  
3. Les données sont envoyées au backend Spring pour traitement.  
4. L'utilisateur peut suivre le **statut** de sa déclaration.  
5. Un **PDF** est généré et archivé.

---

##  Développé par

**Wissem Bagga**  
Étudiant ingénieur passionné par le développement web et la création d’outils à impact social.

-  [Portfolio](https://wissem-s-portfolio.onrender.com)  
-  [GitHub](https://github.com/Wissem1111)  
-  [LinkedIn](https://www.linkedin.com/in/wissem-bagga-369917231/) 

---
