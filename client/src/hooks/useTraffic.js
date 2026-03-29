import { useEffect, useState } from "react";
import {
  getTrafficData,
  getAttackLogs,
  getDashboardStats,
  getGeoTraffic,
} from "../services/traffic.service";

const useTraffic = () => {
  const [traffic, setTraffic] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [geo, setGeo] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);

      const [trafficRes, attacksRes, statsRes, geoRes] = await Promise.all([
        getTrafficData(),
        getAttackLogs(),
        getDashboardStats(),
        getGeoTraffic(),
      ]);

      setTraffic(trafficRes || []);
      setAttacks(attacksRes || []);
      setStats(statsRes || null);
      setGeo(geoRes || []);
    } catch (error) {
      console.error("Traffic fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, []);

  return {
    traffic,
    attacks,
    stats,
    geo,
    loading,
    refetch: fetchTrafficData,
  };
};

export default useTraffic;