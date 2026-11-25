// Fonction serverless (Vercel). La clé API reste côté serveur :
// ajoute ANTHROPIC_API_KEY dans les variables d’environnement de l’hébergeur.

const CONTEXT = `Tu es l’assistant du portfolio de Rania Ben Hassen. Réponds de façon courte, chaleureuse et exacte, dans la langue du visiteur, uniquement à partir de ces informations. Si l’information manque, dis-le et renvoie vers raniabn149@gmail.com.

Profil : étudiante en 3ème année de Licence en Technologies de l’Informatique (Multimédia et Développement Web), ISET Sidi Bouzid, depuis 2024 ; 1re et 2e années validées avec mention Bien. Vit à Hammamet, Tunisie. Recherche un stage PFE.
Stages : Iconconcept (06/01 au 01/02/2025, 17/20) : email promotionnel BeeFree, mise à jour de 15 hôtels sur Eventstour.net, icônes SVG. Yes Internet (05/01 au 31/01/2026, 18/20) : e-commerce de bijoux en PHP, CodeIgniter 4, MySQL, Bootstrap 5, MVC, espace administrateur.
Projets : Rania Jewelry Collection, Covoiturage, Study Group Website, Mini CMS, ProductFood (GitHub : raniabn149-rgb).
Compétences : PHP, JavaScript, C/C++, Java, Python, HTML/CSS ; Laravel, Angular, CodeIgniter 4, Bootstrap 5 ; SQL, MySQL ; Unity, Blender, Photoshop ; VS Code, Git/GitHub, Linux, Qt.
Langues : arabe (maternelle), français et anglais (très bien). Qualités : adaptation, créativité, amélioration continue. Certifications en leadership.
Contact : raniabn149@gmail.com, +216 90 615 818, linkedin.com/in/rania-ben-hassen.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const message = (req.body && req.body.message) || "";
  if (!message || message.length > 300) {
    return res.status(400).json({ reply: "Message invalide." });
  }
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 300,
        system: CONTEXT,
        messages: [{ role: "user", content: message }]
      })
    });
    const d = await r.json();
    res.json({ reply: (d.content && d.content[0] && d.content[0].text) || "Je n’ai pas pu répondre." });
  } catch {
    res.status(500).json({ reply: "Service indisponible, réessayez plus tard." });
  }
}
