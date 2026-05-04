import { createSignal } from "solid-js";
import { packageKey } from "../utils/packageUtils";

export function usePackageStore() {
  const [selectedPackages, setSelectedPackages] = createSignal(new Set());
  const [packages, setPackages] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [refreshing, setRefreshing] = createSignal(false);
  const [usingLocalData, setUsingLocalData] = createSignal(false);
  const [version, setVersion] = createSignal(null);

  const API_BASE = "/api/v1";

  const fetchPackagesData = async () => {
    try {
      const response = await fetch("./fixtures/packages.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching packages data:", error);
      throw error;
    }
  };

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      setError(error.message);
      throw error;
    }
  };

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData("/packages");
      setPackages(data);
      setSelectedPackages(new Set());
      setUsingLocalData(false);
    } catch (error) {
      console.warn("API not available, fetching from fixtures");
      try {
        const data = await fetchPackagesData();
        setPackages(data);
        setUsingLocalData(true);
      } catch (fallbackError) {
        console.error("Failed to fetch packages data:", fallbackError);
        setError("Failed to load packages data");
        setPackages([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshPackages = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await fetchData("/reload");
      setPackages(data);
      setSelectedPackages(new Set());
      setUsingLocalData(false);
    } catch (error) {
      console.warn("API not available, fetching from fixtures");
      try {
        const data = await fetchPackagesData();
        setPackages(data);
        setUsingLocalData(true);
      } catch (fallbackError) {
        console.error("Failed to fetch packages data:", fallbackError);
        setError("Failed to load packages data");
        setPackages([]);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const loadVersion = async () => {
    try {
      const data = await fetchData("/version");
      setVersion(data);
    } catch (error) {
      console.warn("Failed to fetch version info:", error);
      setError("Failed to load version info");
    }
  };

  const togglePackage = (pkg) => {
    const newSelected = new Set(selectedPackages());
    const key = packageKey(pkg);

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedPackages(newSelected);
  };

  const resetSelection = () => setSelectedPackages(new Set());

  const outdatedPackages = () => {    
    return packages().flatMap(c => c.packages).filter(pkg => pkg.outdated);
  };

  return {
    packages,
    loading,
    error,
    refreshing,
    usingLocalData,
    selectedPackages,
    loadPackages,
    refreshPackages,
    resetSelection,
    togglePackage,
    version,
    loadVersion,
    outdatedPackages,
  };
}
