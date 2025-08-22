// ⚠️ Para testes locais SEM GEMINI, vamos simular a resposta.
// Se quiser usar Gemini real, substitua a função `gerarConteudoMock` pela `gerarConteudoReal`.

const API_KEY = "SUA_CHAVE_AQUI"; // só use se realmente quiser testar Gemini

// Função para simulação (mockada)
async function gerarConteudo() {
  const tema = document.getElementById("tema").value.trim();
  const saida = document.getElementById("saida");

  if (!tema) {
    alert("Digite um tema!");
    return;
  }

  saida.textContent = "Gerando conteúdo...";

  // Simulação da IA (sem API real)
  setTimeout(() => {
    const texto = `
📘 Exercícios sobre ${tema}:

1. Explique com suas palavras o que é ${tema}.
2. Dê um exemplo prático de uso de ${tema}.
3. Quais as vantagens de aprender ${tema}?
4. Crie um mini-projeto usando ${tema}.
5. Resuma ${tema} em 3 frases.

💡 Explicação: O tema "${tema}" é essencial para desenvolver habilidades práticas e entendimento conceitual.
    `;
    saida.textContent = texto;
  }, 1000);
}

// ⚡ Se quiser testar com GEMINI REAL, troque a função acima por esta:
async function gerarConteudoReal() {
  const tema = document.getElementById("tema").value.trim();
  const saida = document.getElementById("saida");

  if (!tema) {
    alert("Digite um tema!");
    return;
  }

  saida.textContent = "Gerando conteúdo...";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Crie 5 exercícios educativos sobre o tema: ${tema}, com explicações simples.` }] }]
        }),
      }
    );

    const data = await response.json();
    console.log("Resposta da API:", data);

    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error("Resposta inesperada da API");
    }

    saida.textContent = data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Erro:", err);
    saida.textContent = "⚠️ Erro ao gerar conteúdo (possível bloqueio CORS).";
  }
}

// 📄 Função para gerar PDF
function baixarPDF() {
  const texto = document.getElementById("saida").textContent;
  if (!texto || texto.includes("O conteúdo aparecerá aqui")) {
    alert("Nenhum conteúdo para salvar!");
    return;
  }

  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  doc.fontSize(18).text("📖 Material Lúmen", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(texto);

  doc.end();

  stream.on("finish", function () {
    const url = stream.toBlobURL("application/pdf");
    const a = document.createElement("a");
    a.href = url;
    a.download = "material.pdf";
    a.click();
  });
}
