const API = "http://127.0.0.1:3333";

document.getElementById("searchBtn").addEventListener("click", async () => {
  const q = document.getElementById("query").value;
  if (q.toLowerCase().includes("notepad") || q.toLowerCase().includes("bloco")) {
    await fetch(API + "/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd: "notepad.exe" })
    });
    speak("Abrindo bloco de notas.");
    return;
  }
  speak("Recebi: " + q + ". Salvando como sessão local.");
  await fetch(API + "/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user: "local", text: q }) });
  document.getElementById("responses").innerText = "Sessão salva.";
});

document.getElementById("listSessions").addEventListener("click", async () => {
  const res = await fetch(API + "/sessions");
  const rows = await res.json();
  const ul = document.getElementById("sessions");
  ul.innerHTML = "";
  rows.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.created_at} — ${r.user_name}: ${r.query}`;
    ul.appendChild(li);
  });
});

function speak(t) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "pt-BR";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
