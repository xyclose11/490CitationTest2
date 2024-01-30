import { useState } from "react";

export default function Search() {
    const [query, setQuery] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        console.log();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            required>
            </input>
            <button type="submit">Search</button>
        </form>
    )
}