
## Structure du projet
 frontend/ # Interface utilisateur React
 
 backend-python/ # Serveur FastAPI : écoute vocale avec IA
 
 backend-java/ # Backend principal Spring Boot : API + base de données




# ClaimSense – Assistant Vocal Intelligent pour Déclarations d’Assurance

Ce projet vise à simplifier la déclaration la déclaration de sinistres automobiles. Elle combine l'intelligence artificielle, la reconnaissance vocale, et une interface utilisateur intuitive pour offrir une expérience fluide, rapide et inclusive, particulièrement utile pour les personnes âgées ou non technophiles.

---

##  Fonctionnalités principales

-  **Déclaration vocale** via un assistant IA (STT & NLP)
-  **Formulaire manuel** avec saisie guidée
-  **Correction intelligente** du texte vocal
-  **Génération automatique de PDF**
-  **Historique des déclarations**
-  **Authentification & sécurité**
-  **Suivi du statut** (_en attente_, _en cours_, _validée_, _refusée_)
-  **Interface responsive** et moderne (React + Bootstrap)

---

##  Structure du projet

ClaimSense/
│
├── frontend/ # Application React.js 
│ ├── public/
│ ├── src/
│ │ ├── components/ # Composants réutilisables
│ │ ├── pages/ # Pages principales
│ │ └── services/ # Appels API
│
├── backend-python/ # Serveur vocal IA (FastAPI)
│ ├── main.py # Point d’entrée FastAPI
│ ├── speech_to_text.py # STT (speech recognition)
│ ├── ai_correction.py # Correction sémantique du texte
│ └── requirements.txt
│
├── backend-java/ # Backend principal (Spring Boot)
│ ├── controllers/ # Points d’entrée API
│ ├── services/ # Logique métier
│ ├── dto/ # Data Transfer Objects
│ ├── entities/ # Entités JPA
│ ├── repositories/ # Accès aux données
│ └── security/ # Authentification & JWT
│
├── database/ # SQL & config DB (MySQL)
├── README.md # Documentation du projet

---

## Technologies utilisées

| Domaine            | Technologies                          |
|--------------------|----------------------------------------|
| Frontend           | React.js, Bootstrap, Axios             |
| Backend principal  | Spring Boot, Java, JPA, MySQL, JWT     |
| Backend vocal      | FastAPI, Python, SpeechRecognition     |
| IA (correction)    | NLP personnalisé (Python)              |
| Authentification   | JWT, Spring Security                   |
| Fichiers PDF       | iText (Java) / ReportLab (Python)      |

---

## Lancer le projet localement

### 1. Cloner le dépôt
```bash
git clone https://github.com/Wissem1111/ClaimSense.git
cd ClaimSense
