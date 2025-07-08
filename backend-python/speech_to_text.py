import speech_recognition as sr

def listen_to_user(prompt=""):
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print(f"{prompt}")
        try:
            audio = r.listen(source, timeout=5)
            text = r.recognize_google(audio, language="fr-FR")
            return text
        except:
            return "incompris"
