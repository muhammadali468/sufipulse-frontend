"use client"
import { Layout } from '../../components/layout/Layout';
import { PageContainer } from '../../components/layout/PageContainer';
import { Section } from '../../components/layout/Section';
import { DualNameHero } from '../../components/primitives/DualNameHero';
import { Music, Filter, Search } from 'lucide-react';
// import { useReleases } from '../../hooks/useReleases';
import { useState, useMemo } from 'react';
// import { ReleaseCard } from '../../components/release/ReleaseCard';

type FilterType = 'all' | 'native' | 'legacy';
type DurationFilter = 'all' | 'short' | 'standard' | 'long';
type SubtitleFilter = 'all' | 'yes' | 'no';
type SortOrder = 'new' | 'old' | 'popular';

const ITEMS_PER_PAGE = 12;

export default function Releases() {
    // const { releases, loading, error } = useReleases();
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [subtitleFilter, setSubtitleFilter] = useState<SubtitleFilter>('all');
    const [subtitleLanguageFilter, setSubtitleLanguageFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('new');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // const years = useMemo(() => {
    //     const uniqueYears = new Set(
    //         releases.map(r => new Date(r.release_date).getFullYear())
    //     );
    //     return Array.from(uniqueYears).sort((a, b) => b - a);
    // }, [releases]);

    // const availableSubtitleLanguages = useMemo(() => {
    //     const languages = new Set<string>();
    //     releases.forEach(release => {
    //         if (release.subtitle_languages && Array.isArray(release.subtitle_languages)) {
    //             release.subtitle_languages.forEach(lang => languages.add(lang));
    //         }
    //     });
    //     return Array.from(languages).sort();
    // }, [releases]);

    // const filteredReleases = useMemo(() => {
    //     let filtered = releases.filter(release => {
    //         if (filterType === 'native' && release.source !== 'native') return false;
    //         if (filterType === 'legacy' && release.source !== 'youtube_legacy') return false;

    //         if (durationFilter !== 'all' && release.duration_seconds) {
    //             const minutes = release.duration_seconds / 60;
    //             if (durationFilter === 'short' && minutes >= 3) return false;
    //             if (durationFilter === 'standard' && (minutes < 3 || minutes > 8)) return false;
    //             if (durationFilter === 'long' && minutes <= 8) return false;
    //         }

    //         if (yearFilter !== 'all') {
    //             const releaseYear = new Date(release.release_date).getFullYear();
    //             if (releaseYear !== parseInt(yearFilter)) return false;
    //         }

    //         if (subtitleFilter !== 'all') {
    //             if (subtitleFilter === 'yes' && !release.subtitles_available) return false;
    //             if (subtitleFilter === 'no' && release.subtitles_available) return false;
    //         }

    //         if (subtitleLanguageFilter !== 'all') {
    //             if (!release.subtitle_languages || !release.subtitle_languages.includes(subtitleLanguageFilter)) {
    //                 return false;
    //             }
    //         }

    //         if (searchQuery) {
    //             const query = searchQuery.toLowerCase();
    //             return release.release_title.toLowerCase().includes(query) ||
    //                 release.description?.toLowerCase().includes(query);
    //         }

    //         return true;
    //     });

    //     if (sortOrder === 'new') {
    //         filtered.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    //     } else if (sortOrder === 'old') {
    //         filtered.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
    //     } else if (sortOrder === 'popular') {
    //         filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    //     }

    //     return filtered;
    // }, [releases, filterType, durationFilter, yearFilter, subtitleFilter, subtitleLanguageFilter, searchQuery, sortOrder]);

    // const totalPages = Math.ceil(filteredReleases.length / ITEMS_PER_PAGE);
    // const paginatedReleases = useMemo(() => {
    //     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    //     return filteredReleases.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    // }, [filteredReleases, currentPage]);

    return (
        <Layout>
            <Section className="pt-24 pb-12 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900">
                <PageContainer>
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-sm text-amber-400 uppercase tracking-wider font-medium">
                                Music Division
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                            SufiTube
                        </h1>
                        <p className="text-2xl md:text-3xl text-amber-400/90 mb-8 font-light">
                            Official Release Registry
                        </p>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-lg text-neutral-300 leading-relaxed">
                                Official registry of governed releases under institutional protocol. All productions are subject to quality assurance, creative oversight, and economic transparency standards.
                            </p>
                        </div>
                    </div>
                </PageContainer>
            </Section>

            <PageContainer>
                <div className="max-w-7xl mx-auto">

                    <div className="mb-8 space-y-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Filters</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4">
                            <div>
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => {
                                        setFilterType(e.target.value as FilterType);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
                                >
                                    <option value="all">All</option>
                                    <option value="native">Native Governed</option>
                                    <option value="legacy">Legacy Registry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Duration</label>
                                <select
                                    value={durationFilter}
                                    onChange={(e) => {
                                        setDurationFilter(e.target.value as DurationFilter);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
                                >
                                    <option value="all">All</option>
                                    <option value="short">Short (&lt; 3 min)</option>
                                    <option value="standard">Standard (3-8 min)</option>
                                    <option value="long">Long (&gt; 8 min)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Year</label>
                                <select
                                    value={yearFilter}
                                    onChange={(e) => {
                                        setYearFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
                                >
                                    <option value="all">All Years</option>
                                    {/* {years.map(year => (
                                        <option key={year} value={year.toString()}>{year}</option>
                                    ))} */}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Subtitles</label>
                                <select
                                    value={subtitleFilter}
                                    onChange={(e) => {
                                        setSubtitleFilter(e.target.value as SubtitleFilter);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
                                >
                                    <option value="all">All</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Sub Language</label>
                                <select
                                    value={subtitleLanguageFilter}
                                    onChange={(e) => {
                                        setSubtitleLanguageFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
                                    disabled={subtitleFilter === 'no'}
                                >
                                    <option value="all">All</option>
                                    {/* {availableSubtitleLanguages.map(lang => (
                                        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                    ))} */}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Sort</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => {
                                        setSortOrder(e.target.value as SortOrder);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
                                >
                                    <option value="new">New</option>
                                    <option value="old">Old</option>
                                    <option value="popular">Popular</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        placeholder="Search releases..."
                                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neutral-700 placeholder:text-neutral-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span>
                                Showing {paginatedReleases.length === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredReleases.length)} of {filteredReleases.length} releases
                            </span>
                            {totalPages > 1 && (
                                <span>Page {currentPage} of {totalPages}</span>
                            )}
                        </div> */}
                    </div>

                    {/* {loading && (
                        <div className="flex items-center justify-center min-h-96">
                            <div className="text-neutral-500">Loading releases...</div>
                        </div>
                    )} */}

                    {/* {error && (
                        <div className="flex items-center justify-center min-h-96">
                            <div className="text-neutral-500">{error}</div>
                        </div>
                    )} */}

                    {/* {!loading && !error && releases.length === 0 && (
                        <div className="flex items-center justify-center min-h-96">
                            <div className="text-center">
                                <Music className="w-16 h-16 text-neutral-700 mx-auto mb-4" strokeWidth={1} />
                                <div className="text-neutral-500">No releases published</div>
                            </div>
                        </div>
                    )} */}

                    {/* {!loading && !error && filteredReleases.length === 0 && releases.length > 0 && (
                        <div className="flex items-center justify-center min-h-96">
                            <div className="text-center">
                                <Music className="w-16 h-16 text-neutral-700 mx-auto mb-4" strokeWidth={1} />
                                <div className="text-neutral-500">No releases match your filters</div>
                            </div>
                        </div>
                    )} */}

                    {/* {!loading && !error && paginatedReleases.length > 0 && ( */}
                    <>
                        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {paginatedReleases.map((release) => (
                                    <ReleaseCard
                                        key={release.id}
                                        id={release.id}
                                        slug={release.slug}
                                        title={release.release_title}
                                        thumbnailUrl={
                                            release.source === 'youtube_legacy'
                                                ? release.thumbnail_url
                                                : release.artwork_url
                                        }
                                        source={release.source || 'native'}
                                        durationSeconds={release.duration_seconds}
                                        publishedDate={release.release_date}
                                        views={release.views}
                                        copyrightYear={release.copyright_year}
                                        youtubeVideoId={release.youtube_video_id}
                                    />
                                ))}
                            </div> */}

                        {/* {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-10 h-10 text-sm border transition-colors ${currentPage === page
                                                            ? 'border-neutral-700 bg-neutral-900 text-neutral-100'
                                                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <span key={page} className="text-neutral-600 px-2">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )} */}
                    </>

                </div>
            </PageContainer>
        </Layout>
    );
}
