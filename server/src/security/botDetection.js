const BOT_SIGNATURES = ["curl", "python", "bot", "scrapy", "wget"];

const detectBot = (userAgent = "") => {
  const normalizedAgent = userAgent.toLowerCase();
  const matched = BOT_SIGNATURES.find((signature) => normalizedAgent.includes(signature));

  return {
    isBot: Boolean(matched),
    signature: matched || null
  };
};

module.exports = { detectBot };
