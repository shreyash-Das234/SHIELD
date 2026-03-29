export const getIPInfo = async (ip) => {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      org: data.org,
    };
  } catch (error) {
    console.error("IP info fetch error:", error);
    return null;
  }
};