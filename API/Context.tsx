import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { getNewsAPI, getSourceAPI } from "./api";

interface NewsContextType {
  news: any;
  setCategory: (category: string) => void;
  index: number;
  setIndex: (index: number) => void;
  setSource: (source: string | undefined) => void;
  darkTheme: boolean;
  setDarkTheme: (theme: boolean) => void;
  fetchNews: (reset?: string) => Promise<void>;
}

export const NewsContext = createContext<NewsContextType | undefined>(undefined);

interface ContextProps {
  children: ReactNode;
}

const Context: React.FC<ContextProps> = ({ children }) => {
  const [news, setNews] = useState<any>([]);
  const [category, setCategory] = useState<string>("general");
  const [source, setSource] = useState<string | undefined>();
  const [index, setIndex] = useState<number>(1);
  const [darkTheme, setDarkTheme] = useState<boolean>(true);

  const fetchNews = async (reset: string = category) => {
    const { data } = await axios.get(getNewsAPI(reset));
    setNews(data);
    setIndex(1);
  };

  const fetchNewsfromSource = async () => {
    try {
      if (!source) return;
      const { data } = await axios.get(getSourceAPI(source));
      setNews(data);
      setIndex(1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  useEffect(() => {
    fetchNewsfromSource();
  }, [source]);

  return (
    <NewsContext.Provider
      value={{
        news,
        setCategory,
        index,
        setIndex,
        setSource,
        darkTheme,
        setDarkTheme,
        fetchNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export default Context;
