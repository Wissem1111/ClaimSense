const API_URL = "http://localhost:8000";

export async function getCurrentQuestion() {
  const res = await fetch(`${API_URL}/current-question`);
  return await res.json();
}

export async function listenAndCorrect() {
  const res = await fetch(`${API_URL}/listen`);
  return await res.json();
}

export async function confirmAnswer(confirm) {
  const res = await fetch(`${API_URL}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ confirm }),
  });
  return await res.json();
}

export async function stopProcess() {
  await fetch(`${API_URL}/stop`, { method: "POST" });
}

export async function submitDeclaration() {
  const res = await fetch(`${API_URL}/submit`, {
    method: "POST",
  });
  return await res.json();
}

export async function skipUserQuestions() {
  const res = await fetch(`${API_URL}/skip-user`, {
    method: "POST",
  });
  return await res.json();
}


export async function submitManualDeclaration(data) {
  const res = await fetch("http://localhost:8000/submit-manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateDeclarationStatus(id, newStatus) {
  const response = await fetch(`http://localhost:8080/api/declarations/${id}/status?newStatus=${newStatus}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Échec de la mise à jour du statut");
  }

  return await response.json();
}


