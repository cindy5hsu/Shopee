

import React, { createContext, useState, useContext, ReactNode } from "react";

// Create a context with a default value and expected type
export const SearchContext = createContext<{
  searchResults: string;
  setSearchResults: React.Dispatch<React.SetStateAction<string>>;
}>({
  searchResults: "",
  setSearchResults: () => {}
});

export function useSearch() {
  return useContext(SearchContext);
}

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchResults, setSearchResults] = useState<string>(""); // Use string type

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

