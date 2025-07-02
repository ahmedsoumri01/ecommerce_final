import { useState } from "react";
import axios from "axios";
import api from "@/app/api/axios";
export function useKpi() {
  const [visits, setVisits] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [productStats, setProductStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<any>(null);
  const [visitsStats, setVisitsStats] = useState<any>(null);
  const [topVisited, setTopVisited] = useState<any[]>([]);

  const incrementProductVisit = async (productId: string) => {
    try {
      const res = await api.post(`/kpi/product/${productId}/visit`);
      setVisits(res.data.visits);
    } catch (err) {}
  };

  const fetchProductVisits = async (productId: string) => {
    try {
      const res = await api.get(`/kpi/product/${productId}/visits`);
      setVisits(res.data.visits);
    } catch (err) {}
  };

  const fetchTotalVisits = async () => {
    try {
      const res = await api.get(`/kpi/total-visits`);
      setTotalVisits(res.data.total);
    } catch (err) {}
  };

  const fetchUserCount = async () => {
    const res = await api.get(`/kpi/users/total`);
    setUserCount(res.data.total);
  };

  const fetchProductStats = async () => {
    const res = await api.get(`/kpi/products/stats`);
    setProductStats(res.data);
  };

  const fetchOrderStats = async () => {
    const res = await api.get(`/kpi/orders/stats`);
    setOrderStats(res.data.stats);
  };

  const fetchCategoryCount = async () => {
    const res = await api.get(`/kpi/categories/total`);
    setCategoryCount(res.data.total);
  };

  const fetchRecentActivities = async () => {
    const res = await api.get(`/kpi/recent-activities`);
    setRecentActivities(res.data);
  };

  const fetchVisitsStats = async () => {
    const res = await api.get(`/kpi/visits/stats`);
    setVisitsStats(res.data);
  };

  const fetchTopVisited = async () => {
    const res = await api.get(`/kpi/products/top-visited`);
    setTopVisited(res.data.top);
  };

  return {
    visits,
    totalVisits,
    userCount,
    productStats,
    orderStats,
    categoryCount,
    recentActivities,
    visitsStats,
    topVisited,
    incrementProductVisit,
    fetchProductVisits,
    fetchTotalVisits,
    fetchUserCount,
    fetchProductStats,
    fetchOrderStats,
    fetchCategoryCount,
    fetchRecentActivities,
    fetchVisitsStats,
    fetchTopVisited,
  };
}
