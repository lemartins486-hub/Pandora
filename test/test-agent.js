const fetch = require("node-fetch");

(async () => {
  try {
    const status = await (await fetch("http://127.0.0.1:3333/status")).json();
    console.log("Status:", status);
    const s = await (await fetch("http://127.0.0.1:3333/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "tester", text: "Teste de sessão" })
    })).json();
    console.log("Criou sessão:", s);
    process.exit(0);
  } catch (err) {
    console.error("Erro no teste do agent:", err);
    process.exit(2);
  }
})();
