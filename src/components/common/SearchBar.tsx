import { Input, Card, CardBody, Spinner } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllMusic, searchMusic } from "@/api/music";
import { Music } from "@/types";
import { FiMusic, FiUser } from "react-icons/fi";

export const SearchIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Music[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Keep the input in sync with the URL `search` param so the clear button appears
        const params = new URLSearchParams(location.search);
        const q = params.get('search') || '';
        setSearchTerm(q);
        if (!q) {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [location.search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayedSearch = setTimeout(async () => {
            const termRaw = searchTerm.trim();
            const term = termRaw.toLowerCase();
            if (term.length > 2) {
                setIsSearching(true);
                try {
                    // First try the dedicated search endpoint
                    const results = await searchMusic(termRaw);
                    console.debug('[SearchBar] searchMusic returned', Array.isArray(results) ? `array:${results.length}` : typeof results, results);

                    // Normalize server result: support both array response and paginated { content: [] }
                    const serverItems: Music[] = Array.isArray(results)
                        ? results
                        : (results && Array.isArray((results as any).content) ? (results as any).content : []);

                    // Always filter server results client-side to avoid backend returning everything
                    const filteredFromSearch = (serverItems).filter((m) => {
                        const name = (m.name || m.title || '').toString().toLowerCase();
                        const artist = (m.artist || '').toString().toLowerCase();
                        const genre = (m.genre || '').toString().toLowerCase();
                        return name.includes(term) || artist.includes(term) || genre.includes(term);
                    });

                    console.debug('[SearchBar] filteredFromSearch length', filteredFromSearch.length);

                    if (filteredFromSearch.length > 0) {
                        setSearchResults(filteredFromSearch);
                        setShowResults(true);
                    } else {
                        console.debug('[SearchBar] searchMusic gave no matches; falling back to fetchAllMusic');
                        // Fallback: try fetchAllMusic and then filter (covers backends that ignore the search endpoint)
                        const paginated = await fetchAllMusic(0, 50, undefined);
                        const items = Array.isArray(paginated?.content) ? paginated.content : [];
                        const filtered = items.filter((m) => {
                            const name = (m.name || m.title || '').toString().toLowerCase();
                            const artist = (m.artist || '').toString().toLowerCase();
                            const genre = (m.genre || '').toString().toLowerCase();
                            return name.includes(term) || artist.includes(term) || genre.includes(term);
                        });
                        console.debug('[SearchBar] fallback filtered length', filtered.length);
                        setSearchResults(filtered);
                        setShowResults(true);
                    }
                } catch (error) {
                    console.error('Search error (searchMusic):', error);
                    try {
                        // Final fallback: fetch all and filter client-side
                        const paginated = await fetchAllMusic(0, 50, undefined);
                        const items = Array.isArray(paginated?.content) ? paginated.content : [];
                        const filtered = items.filter((m) => {
                            const name = (m.name || m.title || '').toString().toLowerCase();
                            const artist = (m.artist || '').toString().toLowerCase();
                            const genre = (m.genre || '').toString().toLowerCase();
                            return name.includes(term) || artist.includes(term) || genre.includes(term);
                        });
                        console.debug('[SearchBar] final fallback filtered length', filtered.length);
                        setSearchResults(filtered);
                        setShowResults(true);
                    } catch (err2) {
                        console.error('Search fallback error:', err2);
                        setSearchResults([]);
                        setShowResults(false);
                    }
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const handleResultClick = (music: Music) => {
        setShowResults(false);
        setSearchTerm("");
        // Navigate to current path with search filter using the track name
        const params = new URLSearchParams(location.search);
        params.set('search', (music.name || music.title || '').toString());
        const searchString = params.toString();
        navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            setShowResults(false);
            const params = new URLSearchParams(location.search);
            params.set('search', searchTerm.trim());
            const searchString = params.toString();
            navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`);
        }
    };

    return (
        <div ref={searchRef} className="relative w-[280px] lg:w-[340px]">
            <Input
                isClearable
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onClear={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                    setShowResults(false);
                    // Remove only the `search` query param and stay on the same pathname
                    const params = new URLSearchParams(location.search);
                    params.delete('search');
                    const searchString = params.toString();
                    navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`, { replace: true });
                }}
                classNames={{
                    input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                        "bg-indigo-500/15",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focus=true]:bg-default-200/50",
                        "dark:group-data-[focus=true]:bg-default/60",
                        "cursor-text!",
                        "transition-all",
                        "duration-200",
                    ],
                }}
                placeholder="Search music, artists..."
                radius="lg"
                startContent={
                    isSearching ? (
                        <Spinner size="sm" className="text-indigo-600" />
                    ) : (
                        <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 pointer-events-none shrink-0" />
                    )
                }
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <Card className="absolute top-full mt-2 w-full max-h-96 overflow-auto z-[60] border border-indigo-200 dark:border-indigo-800">
                    <CardBody className="p-0">
                        {searchResults.slice(0, 8).map((music) => (
                            <div
                                key={music.id}
                                onClick={() => handleResultClick(music)}
                                className="flex items-center gap-3 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer transition-colors border-b border-indigo-100 dark:border-indigo-900 last:border-b-0"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                    <FiMusic className="text-indigo-600 dark:text-indigo-400" size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate text-indigo-950 dark:text-indigo-50">
                                        {music.name || music.title}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                        <FiUser size={12} />
                                        <span className="truncate">{music.artist}</span>
                                    </div>
                                </div>
                                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                    ${music.price}
                                </div>
                            </div>
                        ))}
                        {searchResults.length > 8 && (
                            <div className="p-3 text-center text-sm text-gray-500 border-t border-indigo-100 dark:border-indigo-900">
                                +{searchResults.length - 8} more results
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* No Results */}
            {showResults && searchResults.length === 0 && searchTerm.trim().length > 2 && !isSearching && (
                <Card className="absolute top-full mt-2 w-full z-[60] border border-indigo-200 dark:border-indigo-800">
                    <CardBody className="p-4 text-center text-gray-500">
                        <FiMusic size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No music found for "{searchTerm}"</p>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}