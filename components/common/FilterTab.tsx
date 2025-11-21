"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";

export default function FilterTab() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search by MLS, address, city, or community..."
        onSearch={handleSearch}
      />
    </div>
  );
}


