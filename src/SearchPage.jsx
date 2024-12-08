import React, { useState } from "react";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const mockData = [
    {
      title: "Tech Trends 2024",
      category: "tech",
      description: "Latest trends in technology.",
    },
    {
      title: "Healthy Living",
      category: "health",
      description: "Tips for a healthy lifestyle.",
    },
    {
      title: "Exploring Europe",
      category: "travel",
      description: "Top destinations in Europe.",
    },
    {
      title: "AI Revolution",
      category: "tech",
      description: "Impact of AI on industries.",
    },
  ];

  const filteredResults = mockData.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesQuery = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="search-container">
      <h1 className="search-title">Search Blog</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button>🔍</button>
      </div>
      <div className="filter">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="health">Health</option>
          <option value="travel">Travel</option>
        </select>
      </div>
      <div className="results">
        {filteredResults.length > 0 ? (
          filteredResults.map((item, index) => (
            <div key={index} className="result-item">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
