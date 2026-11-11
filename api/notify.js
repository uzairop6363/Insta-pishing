
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { username, feedback } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof feedback !== "string" ||
      !/^@[a-zA-Z0-9._]{1,30}$/.test(username) ||
      feedback.trim().length < 2 ||
      feedback.length > 1000
    ) {
      return res.status(400).json({ success: false });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ success: false });
    }

    const message =
      "📸 INSTAGRAM STUDIO FEEDBACK\n\n" +
      "👤 Username: " + username + "\n" +
      "💬 Feedback: " + feedback.trim() + "\n\n" +
      "⚡ C9 UZAIR";

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({ success: false });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ success: false });
  }
}
