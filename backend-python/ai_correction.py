import re
import dateparser
import unicodedata

def normalize(text):
    return unicodedata.normalize('NFD', text.lower()).encode('ascii', 'ignore').decode('utf-8').strip()

def correct_text(question, answer):
    q = normalize(question)
    a = normalize(answer)

    if "oui" in a: return "oui"
    if "non" in a: return "non"
    if "date" in q:
        dt = dateparser.parse(a, languages=["fr"])
        return dt.strftime("%Y-%m-%d") if dt else "date invalide"
    if "heure" in q:
        dt = dateparser.parse(a, languages=["fr"])
        return dt.strftime("%H:%M") if dt else "heure invalide"
    if "numero" in q or "immatriculation" in q:
        return re.sub(r"\s+", "", a).upper()
    return answer.capitalize()
