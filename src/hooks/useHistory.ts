import { useState, useEffect } from "react";
import { HistoryEntry } from "@/components/HistoryList";

const STORAGE_KEY = "nibe-history";

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveEntry = (entry: Omit<HistoryEntry, "id">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now(),
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const deleteEntry = (id: number) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    saveEntry,
    deleteEntry,
    clearHistory,
  };
};
