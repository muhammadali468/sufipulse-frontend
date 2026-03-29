"use client"
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout/Layout';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Badge } from '../../../components/primitives/Badge';
import { Music, Lock, Calendar, Hash, Eye, ThumbsUp, MessageCircle, Clock, Share2, Copy, Facebook, Edit, FileText, Subtitles, Play, ChevronDown, X, Twitter, MessageSquare, Check, Mic, Users, PlayCircle } from 'lucide-react';
// import { useRelease } from '../../../hooks/useRelease';
// import { formatDuration } from '../../../services/youtubeSync';
import Link from 'next/link';

const LANGUAGE_OPTIONS = [
    { key: 'roman_urdu', label: 'Roman Urdu' },
    { key: 'urdu', label: 'Urdu' },
    { key: 'hindi', label: 'Hindi' },
    { key: 'arabic', label: 'Arabic' },
    { key: 'turkish', label: 'Turkish' },
    { key: 'persian', label: 'Persian (Farsi)' },
    { key: 'punjabi', label: 'Punjabi' },
    { key: 'indonesian', label: 'Indonesian' },
    { key: 'spanish', label: 'Spanish' },
    { key: 'portuguese', label: 'Portuguese' },
    { key: 'french', label: 'French' },
    { key: 'german', label: 'German' },
    { key: 'russian', label: 'Russian' },
    { key: 'bengali', label: 'Bengali' },
    { key: 'chinese', label: 'Chinese' },
    { key: 'japanese', label: 'Japanese' },
    { key: 'english', label: 'English' },
] as const;

export function Release() {
    const params = useParams();
    const slug = params?.slug as string;
    //   const { release, loading, error } = useRelease(slug || '');
    const [activeTab, setActiveTab] = useState<'overview' | 'subtitles' | 'lyrics' | 'production' | 'adopt' | 'credits'>('credits');
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [selectedSubtitleLanguage, setSelectedSubtitleLanguage] = useState<string>('');
    const [selectedLyricsLanguage, setSelectedLyricsLanguage] = useState<string>('');
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [release, setRelease] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchVideoDetails = async () => {
            try {
                const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyCw34bUCxl_8S5R8I-380YyFOLDqpWL-R4';
                const videoRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${slug}&key=${YOUTUBE_API_KEY}`
                );
                const data = await videoRes.json();

                if (!data.items || data.items.length === 0) {
                    setError("Video not found on SufiTube.");
                    setLoading(false);
                    return;
                }

                const v = data.items[0];

                const match = v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                let h = 0, m = 0, s = 0;
                if (match) {
                    h = parseInt(match[1]) || 0;
                    m = parseInt(match[2]) || 0;
                    s = parseInt(match[3]) || 0;
                }
                const totalSeconds = h * 3600 + m * 60 + s;

                setRelease({
                    id: v.id,
                    release_title: v.snippet.title,
                    release_date: v.snippet.publishedAt,
                    description: v.snippet.description,
                    source: "youtube_legacy",
                    duration_seconds: totalSeconds,
                    views: parseInt(v.statistics.viewCount || '0'),
                    likes: parseInt(v.statistics.likeCount || '0'),
                    youtube_video_id: v.id,
                    slug: v.id,
                    subtitles_available: false,
                    subtitle_languages: [],
                    lyrics: {},
                    credits: [],
                    lead_vocalists: [],
                    chorus_vocalists: [],
                    production_credits: {},
                    spotify_url: "",
                    apple_music_url: ""
                });
            } catch (err: any) {
                console.error("Error fetching release:", err);
                setError(err.message || "Failed to load release details");
            } finally {
                setLoading(false);
            }
        };

        fetchVideoDetails();
    }, [slug]);
    if (loading) {
        return (
            <Layout>
                <PageContainer>
                    <div className="max-w-5xl mx-auto flex items-center justify-center min-h-96">
                        <div className="text-neutral-500">Loading release...</div>
                    </div>
                </PageContainer>
            </Layout>
        );
    }

    if (error || !release) {
        return (
            <Layout>
                <PageContainer>
                    <div className="max-w-5xl mx-auto flex items-center justify-center min-h-96">
                        <div className="text-neutral-500">{error || 'Release not found'}</div>
                    </div>
                </PageContainer>
            </Layout>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (cents: number) => {
        return (cents / 100).toFixed(2);
    };

    const formatDuration = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatDescription = (text: string) => {
        const sections = text.split(/\n{2,}/);
        return sections.map((section, index) => {
            const lines = section.split('\n').filter(line => line.trim());
            return (
                <div key={index} className={index > 0 ? 'mt-6' : ''}>
                    {lines.map((line, lineIndex) => {
                        if (line.match(/^\d{2}:\d{2}/)) {
                            return (
                                <div key={lineIndex} className="text-neutral-400 text-base mb-1.5 font-medium">
                                    {line}
                                </div>
                            );
                        }
                        if (line.includes('Language:') || line.includes('Theme:') || line.includes('Produced under')) {
                            return (
                                <div key={lineIndex} className="text-neutral-400 text-base mb-1.5 flex items-center gap-2">
                                    {line.split('◆').map((part, i) =>
                                        i === 0 ? <span key={i}>{part}</span> : <span key={i} className="text-neutral-500">◆ {part}</span>
                                    )}
                                </div>
                            );
                        }
                        if (line.startsWith('#')) {
                            return (
                                <div key={lineIndex} className="text-neutral-500 text-sm mt-4">
                                    {line}
                                </div>
                            );
                        }
                        return (
                            <p key={lineIndex} className="text-neutral-300 text-base leading-relaxed mb-3">
                                {line}
                            </p>
                        );
                    })}
                </div>
            );
        });
    };

    const isLegacy = release.source === 'youtube_legacy';
    const writerCredits = release.credits?.filter((c: any) => c.credit_type === 'writer') || [];
    const vocalistCredits = release.credits?.filter((c: any) => c.credit_type === 'vocalist') || [];
    const producerCredits = release.credits?.filter((c: any) => c.credit_type === 'producer') || [];
    const engineerCredits = release.credits?.filter((c: any) => c.credit_type === 'engineer') || [];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => {
            setCopySuccess(false);
            setShowCopyModal(false);
        }, 2000);
    };

    const handleShare = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(release.release_title);

        const urls: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };

    const getAvailableLanguages = () => {
        if (!release.lyrics) return [];
        return Object.keys(release.lyrics).filter(key => release.lyrics![key as keyof typeof release.lyrics]);
    };

    return (
        <Layout>
            <PageContainer>
                <div className="max-w-7xl mx-auto">
                    {/* Admin Edit Button */}
                    <div className="flex justify-end mb-4">
                        <Link
                            href={`/admin/release-credits/${release.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-300 border border-neutral-800 hover:border-neutral-700 rounded transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Production Credits
                        </Link>
                    </div>

                    {/* Hero Section */}
                    <div className="mb-12">
                        {/* Badge and Title */}
                        <div className="mb-8">
                            {isLegacy ? (
                                <Badge variant="neutral" className="mb-4">
                                    Registered Release
                                </Badge>
                            ) : (
                                <Badge variant="gold" className="mb-4 gap-2">
                                    <Lock className="w-3 h-3" />
                                    Governed Release
                                </Badge>
                            )}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <h1 className="text-5xl md:text-6xl font-serif font-light text-neutral-100 leading-tight flex-1">
                                    {release.release_title}
                                </h1>
                                <Link
                                    href={`/admin/releases/${release.slug}/credits`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded transition-colors text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Production Credits
                                </Link>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(release.release_date)}</span>
                                </div>
                                {release.duration_seconds && (
                                    <>
                                        <span className="text-neutral-700">•</span>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(release.duration_seconds)}</span>
                                        </div>
                                    </>
                                )}
                                {isLegacy && release.views !== undefined && release.views > 0 && (
                                    <>
                                        <span className="text-neutral-700">•</span>
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{release.views.toLocaleString()} views</span>
                                        </div>
                                    </>
                                )}
                                {isLegacy && release.likes !== undefined && release.likes > 0 && (
                                    <>
                                        <span className="text-neutral-700">•</span>
                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{release.likes.toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Video Player - Hero Position */}
                        {(release.youtube_video_id || (release.youtube_url && !release.youtube_url.includes('PLACEHOLDER'))) ? (
                            <div className="mb-8">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-neutral-800 relative group">
                                    {!videoLoaded && (
                                        <>
                                            <img
                                                src={
                                                    release.thumbnail_url ||
                                                    `https://img.youtube.com/vi/${release.youtube_video_id || release.youtube_url?.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`
                                                }
                                                alt={release.release_title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const videoId = release.youtube_video_id || release.youtube_url?.split('v=')[1]?.split('&')[0];
                                                    if (e.currentTarget.src.includes('maxresdefault')) {
                                                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                                    } else if (e.currentTarget.src.includes('hqdefault')) {
                                                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                                                    } else if (!e.currentTarget.src.includes('default.jpg')) {
                                                        e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                                                    }
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <button
                                                    onClick={() => setVideoLoaded(true)}
                                                    className="w-20 h-20 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full shadow-2xl transform group-hover:scale-110 transition-all"
                                                    aria-label="Play video"
                                                >
                                                    <PlayCircle className="w-12 h-12 text-white" fill="white" />
                                                </button>
                                            </div>
                                            {release.duration_seconds && (
                                                <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded text-sm text-white font-medium">
                                                    {formatDuration(release.duration_seconds)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {videoLoaded && (
                                        <>
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${release.youtube_video_id || slug}?rel=0&modestbranding=1&autoplay=1&mute=1`}
                                                title={release.release_title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                className="w-full h-full"
                                            />
                                            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-xs text-neutral-400 pointer-events-none">
                                                If video doesn't load, open this page in a new tab
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video bg-neutral-900 border border-neutral-800 rounded-lg mb-8 flex items-center justify-center">
                                <div className="text-center">
                                    <Music className="w-16 h-16 text-neutral-700 mx-auto mb-4" strokeWidth={1} />
                                    <div className="text-neutral-500">Video Distribution Pending</div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            {release.youtube_video_id && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${release.youtube_video_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-900/30"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    Watch on YouTube
                                </a>
                            )}
                            <button
                                onClick={() => setShowCopyModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium rounded-lg transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Link
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium rounded-lg transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-b border-neutral-800">
                            <div className="flex gap-1 flex-wrap">
                                <button
                                    onClick={() => setActiveTab('credits')}
                                    className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'credits'
                                        ? 'text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Credits
                                    </span>
                                    {activeTab === 'credits' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('production')}
                                    className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'production'
                                        ? 'text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    Production
                                    {activeTab === 'production' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('adopt')}
                                    className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'adopt'
                                        ? 'text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    Adopt this Song
                                    {activeTab === 'adopt' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                    )}
                                </button>
                                {release.subtitles_available && release.subtitle_languages && release.subtitle_languages.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('subtitles')}
                                        className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'subtitles'
                                            ? 'text-neutral-100'
                                            : 'text-neutral-500 hover:text-neutral-300'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Subtitles className="w-4 h-4" />
                                            Subtitles
                                        </span>
                                        {activeTab === 'subtitles' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                        )}
                                    </button>
                                )}
                                {/* {getAvailableLanguages().length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('lyrics')}
                                        className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'lyrics'
                                            ? 'text-neutral-100'
                                            : 'text-neutral-500 hover:text-neutral-300'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Lyrics
                                        </span>
                                        {activeTab === 'lyrics' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                        )}
                                    </button>
                                )} */}
                                <button
                                    onClick={() => setActiveTab('lyrics')}
                                    className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'lyrics'
                                        ? 'text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Lyrics
                                    </span>
                                    {activeTab === 'lyrics' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'overview'
                                        ? 'text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    Overview
                                    {activeTab === 'overview' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100"></div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="mb-16">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && release.description && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-2xl font-medium text-neutral-100 mb-6">About This Release</h3>
                                    <div className="prose prose-invert max-w-none">
                                        <div className="text-neutral-300 leading-relaxed space-y-4 text-base">
                                            {formatDescription(release.description)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Credits Tab */}
                        {activeTab === 'credits' && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-3xl font-serif font-light text-neutral-100 mb-8">Contributors</h3>

                                    {/* Writer | Lyricist | Composer Section */}
                                    {writerCredits.length > 0 && (
                                        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <FileText className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
                                                <div className="flex-1">
                                                    <h4 className="text-2xl font-medium text-neutral-100 mb-6">Writer | Lyricist | Composer</h4>
                                                    {/* <div className="space-y-3">
                                                        {writerCredits.map(credit => (
                                                            <div key={credit.id} className="bg-neutral-950 rounded-lg px-5 py-4 border border-neutral-800">
                                                                <span className="text-neutral-200 text-lg">{credit.display_name}</span>
                                                            </div>
                                                        ))}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Vocalists Section - Database Credits */}
                                    {vocalistCredits.length > 0 && (
                                        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <Mic className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
                                                <div className="flex-1">
                                                    <h4 className="text-2xl font-medium text-neutral-100 mb-6">Vocalists</h4>
                                                    {/* <div className="space-y-3">
                                                        {vocalistCredits.map(credit => (
                                                            <div key={credit.id} className="bg-neutral-950 rounded-lg px-5 py-4 border border-neutral-800">
                                                                <span className="text-neutral-200 text-lg">{credit.display_name}</span>
                                                            </div>
                                                        ))}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Vocalists Section - Legacy JSONB Arrays (for backward compatibility) */}
                                    {vocalistCredits.length === 0 && ((release.lead_vocalists && release.lead_vocalists.length > 0) || (release.chorus_vocalists && release.chorus_vocalists.length > 0)) && (
                                        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <Mic className="w-8 h-8 text-neutral-400" strokeWidth={1.5} />
                                                <div className="flex-1">
                                                    <h4 className="text-2xl font-medium text-neutral-100 mb-6">Vocalists</h4>

                                                    {release.lead_vocalists && release.lead_vocalists.length > 0 && (
                                                        <div className="mb-6">
                                                            <span className="text-sm text-neutral-500 uppercase tracking-wide block mb-3">Lead Vocalist{release.lead_vocalists.length > 1 ? 's' : ''}</span>
                                                            {/* <div className="space-y-3">
                                                                {release.lead_vocalists.map((vocalist, idx) => (
                                                                    <div key={idx} className="bg-neutral-950 rounded-lg px-5 py-4 border border-neutral-800">
                                                                        <span className="text-neutral-200 text-lg">{vocalist}</span>
                                                                    </div>
                                                                ))}
                                                            </div> */}
                                                        </div>
                                                    )}

                                                    {release.chorus_vocalists && release.chorus_vocalists.length > 0 && (
                                                        <div className={release.lead_vocalists && release.lead_vocalists.length > 0 ? 'pt-6 border-t border-neutral-800' : ''}>
                                                            <span className="text-sm text-neutral-500 uppercase tracking-wide block mb-3">Chorus & Whisper Interlude</span>
                                                            {/* <div className="space-y-3">
                                                                {release.chorus_vocalists.map((vocalist, idx) => (
                                                                    <div key={idx} className="bg-neutral-950 rounded-lg px-5 py-4 border border-neutral-800">
                                                                        <span className="text-neutral-200 text-lg">{vocalist}</span>
                                                                    </div>
                                                                ))}
                                                            </div> */}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty State */}
                                    {writerCredits.length === 0 && vocalistCredits.length === 0 &&
                                        (!release.lead_vocalists || release.lead_vocalists.length === 0) &&
                                        (!release.chorus_vocalists || release.chorus_vocalists.length === 0) && (
                                            <div className="text-center py-12">
                                                <Users className="w-16 h-16 text-neutral-700 mx-auto mb-4" strokeWidth={1} />
                                                <p className="text-neutral-500 text-lg">No contributor credits available yet</p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}

                        {/* Adopt this Song Tab */}
                        {activeTab === 'adopt' && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-3xl font-serif font-light text-neutral-100 mb-4">A Guidebook for Well-Wishers</h3>
                                    <p className="text-neutral-400 text-lg leading-relaxed mb-12">
                                        If this kalam has moved you, and you wish to help it reach others quietly and with grace, this guide will show you how to use Google Ads to support its spread — without noise, without pressure, and with full control over your contribution.
                                    </p>

                                    {/* What You Need Before You Begin */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">What You Need Before You Begin</h4>
                                        <p className="text-neutral-300 mb-4">You only need four things:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                                <span className="text-xl">1.</span>
                                                <span className="text-neutral-300">A Google account (Gmail)</span>
                                            </div>
                                            <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                                <span className="text-xl">2.</span>
                                                <span className="text-neutral-300">A payment method (card or bank)</span>
                                            </div>
                                            <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                                <span className="text-xl">3.</span>
                                                <span className="text-neutral-300">A YouTube link (channel or song)</span>
                                            </div>
                                            <div className="flex items-start gap-3 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                                                <span className="text-xl">4.</span>
                                                <span className="text-neutral-300">A quiet intention</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signing In to Google Ads */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Signing In to Google Ads (From Zero)</h4>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">1.</span>
                                                <span className="text-neutral-300">Open your browser</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">2.</span>
                                                <span className="text-neutral-300">Go to Google Ads</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">3.</span>
                                                <span className="text-neutral-300">Sign in with your Google (Gmail) account</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">4.</span>
                                                <span className="text-neutral-300">Click Start now</span>
                                            </div>
                                        </div>
                                        <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-5">
                                            <p className="text-amber-200/90 font-medium mb-2">When prompted about "Smart campaigns":</p>
                                            <ul className="space-y-1 text-amber-100/80 ml-4">
                                                <li>• Scroll down</li>
                                                <li>• Click <strong>Switch to Expert Mode</strong></li>
                                            </ul>
                                            <p className="text-amber-100/70 text-sm mt-3 italic">This gives you full control and avoids automated mistakes.</p>
                                        </div>
                                    </div>

                                    {/* Creating Your Google Ads Account */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Creating Your Google Ads Account</h4>
                                        <p className="text-neutral-300 mb-4">If this is your first time, Google will ask about your goal.</p>
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 mb-4">
                                            <p className="text-neutral-200 font-medium mb-3">Choose:</p>
                                            <p className="text-neutral-300 italic">Create a campaign without a goal's guidance</p>
                                        </div>
                                        <p className="text-neutral-300 mb-3">Enter:</p>
                                        <ul className="space-y-2 ml-4 text-neutral-300">
                                            <li>• <strong>Business name:</strong> SufiPulse Supporter (or any name you prefer)</li>
                                            <li>• <strong>Website:</strong> paste the SufiPulse channel or video link</li>
                                        </ul>
                                        <p className="text-neutral-400 mt-4">Submit and continue.</p>
                                    </div>

                                    {/* Setting Up Billing */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Setting Up Billing (Your Contribution)</h4>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">1.</span>
                                                <span className="text-neutral-300">In Google Ads, open <strong>Tools & Settings</strong></span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">2.</span>
                                                <span className="text-neutral-300">Click <strong>Billing</strong></span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">3.</span>
                                                <span className="text-neutral-300">Choose <strong>Settings</strong></span>
                                            </div>
                                        </div>
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 mb-4">
                                            <p className="text-neutral-200 font-medium mb-3">Fill in:</p>
                                            <ul className="space-y-2 text-neutral-300">
                                                <li>• Country</li>
                                                <li>• Time zone (choose carefully, cannot be changed)</li>
                                                <li>• Currency (USD recommended)</li>
                                            </ul>
                                        </div>
                                        <p className="text-neutral-300 mb-3">Add a payment method:</p>
                                        <ul className="space-y-2 ml-4 text-neutral-300 mb-4">
                                            <li>• Credit or debit card</li>
                                            <li>• Or bank account</li>
                                        </ul>
                                        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-5">
                                            <p className="text-blue-200 font-medium mb-2">Optional but recommended:</p>
                                            <p className="text-blue-100/80">• Set a monthly spending limit</p>
                                            <p className="text-blue-100/70 text-sm mt-3 italic">Your payment details remain private. SufiPulse never sees them.</p>
                                        </div>
                                    </div>

                                    {/* Choosing What You Will Promote */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Choosing What You Will Promote</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                                                <p className="text-neutral-200 font-medium mb-3">To promote the channel</p>
                                                <p className="text-neutral-400 text-sm mb-2">Use:</p>
                                                <code className="block bg-neutral-950 px-3 py-2 rounded text-sm text-blue-400 font-mono break-all">
                                                    https://youtube.com/@sufipulse-usa
                                                </code>
                                            </div>
                                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                                                <p className="text-neutral-200 font-medium mb-3">To promote this kalam</p>
                                                <p className="text-neutral-400 text-sm mb-2">Copy this video's YouTube link:</p>
                                                {release.youtube_video_id && (
                                                    <code className="block bg-neutral-950 px-3 py-2 rounded text-sm text-blue-400 font-mono break-all">
                                                        https://www.youtube.com/watch?v={release.youtube_video_id}
                                                    </code>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-neutral-400 text-sm mt-4 italic text-center">Both are equally valid.</p>
                                    </div>

                                    {/* Creating Your First Campaign */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Creating Your First Campaign</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">1.</span>
                                                <span className="text-neutral-300">Click <strong>New Campaign</strong></span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">2.</span>
                                                <div className="flex-1">
                                                    <p className="text-neutral-300 mb-2">Choose goal:</p>
                                                    <ul className="ml-4 space-y-1 text-neutral-400">
                                                        <li>◦ Brand awareness and reach</li>
                                                        <li>OR</li>
                                                        <li>◦ Product and brand consideration</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">3.</span>
                                                <div className="flex-1">
                                                    <p className="text-neutral-300 mb-2">Campaign type:</p>
                                                    <p className="ml-4 text-neutral-400">◦ Video</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">4.</span>
                                                <div className="flex-1">
                                                    <p className="text-neutral-300 mb-2">Campaign subtype:</p>
                                                    <p className="ml-4 text-neutral-400">◦ Custom video campaign</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">5.</span>
                                                <div className="flex-1">
                                                    <p className="text-neutral-300 mb-2">Ad format:</p>
                                                    <p className="ml-4 text-neutral-400">◦ Skippable in-stream ad</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-neutral-400 mt-4">Continue.</p>
                                    </div>

                                    {/* Budget and Bidding */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Budget and Bidding (Gentle by Design)</h4>
                                        <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
                                            <p className="text-green-200 font-medium mb-4">Recommended starting point:</p>
                                            <ul className="space-y-2 text-green-100/90">
                                                <li>• <strong>Daily budget:</strong> $5–$10</li>
                                                <li>• <strong>Bidding strategy:</strong> Maximum CPV</li>
                                                <li>• <strong>Max CPV:</strong> $0.01–$0.03</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Location and Language Selection */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Location and Language Selection</h4>
                                        <p className="text-neutral-300 mb-6">Keep this simple.</p>
                                        <div className="space-y-4">
                                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                                                <p className="text-neutral-200 font-medium mb-3">South Asia</p>
                                                <ul className="space-y-2 text-neutral-300 text-sm">
                                                    <li>• <strong>Countries:</strong> India, Pakistan, Bangladesh</li>
                                                    <li>• <strong>Languages:</strong> Urdu, Hindi, Punjabi, Bengali</li>
                                                </ul>
                                            </div>
                                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                                                <p className="text-neutral-200 font-medium mb-3">Middle East</p>
                                                <ul className="space-y-2 text-neutral-300 text-sm">
                                                    <li>• <strong>Countries:</strong> UAE, Saudi Arabia, Turkey</li>
                                                    <li>• <strong>Languages:</strong> Arabic, Turkish, Persian</li>
                                                </ul>
                                            </div>
                                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                                                <p className="text-neutral-200 font-medium mb-3">Western listeners</p>
                                                <ul className="space-y-2 text-neutral-300 text-sm">
                                                    <li>• <strong>Countries:</strong> USA, Canada, Europe</li>
                                                    <li>• <strong>Language:</strong> English</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <p className="text-neutral-400 text-sm mt-4 italic">You do not need to cover the world at once.</p>
                                    </div>

                                    {/* Adding the Video */}
                                    <div className="mb-12">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Adding the Video</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">1.</span>
                                                <span className="text-neutral-300">Paste the YouTube link</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">2.</span>
                                                <span className="text-neutral-300">Select <strong>In-stream ad</strong></span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="text-neutral-500 font-medium">3.</span>
                                                <div className="flex-1">
                                                    <p className="text-neutral-300 mb-2">Call to action:</p>
                                                    <ul className="ml-4 space-y-1 text-neutral-400">
                                                        <li>◦ "Watch"</li>
                                                        <li>◦ "Listen"</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Publishing and Letting It Be */}
                                    <div className="mb-8">
                                        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Publishing and Letting It Be</h4>
                                        <ul className="space-y-3 text-neutral-300">
                                            <li>• Review settings</li>
                                            <li>• Click <strong>Publish</strong></li>
                                        </ul>
                                        <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-6 mt-6">
                                            <p className="text-purple-200 mb-2">Google usually approves within a few hours.</p>
                                            <p className="text-purple-100/90 mb-3">Let the campaign run for at least 3 days without changes.</p>
                                            <p className="text-purple-100/70 italic">Silence is not failure here.</p>
                                        </div>
                                    </div>

                                    {/* Closing */}
                                    <div className="border-t border-neutral-800 pt-8 mt-8">
                                        <p className="text-neutral-400 text-center leading-relaxed">
                                            This is an act of quiet support. Your contribution helps this kalam reach hearts that need it, and you remain unseen in the process — as it should be.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Subtitles Tab */}
                        {activeTab === 'subtitles' && release.subtitles_available && release.subtitle_languages && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-xl font-medium text-neutral-100 mb-6">Select Subtitle Language</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                                        {release.subtitle_languages.map((lang: any) => {
                                            const langLabel = LANGUAGE_OPTIONS.find(opt => opt.key === lang)?.label || lang.toUpperCase();
                                            return (
                                                <button
                                                    key={lang}
                                                    onClick={() => setSelectedSubtitleLanguage(lang)}
                                                    className={`px-5 py-3 rounded-lg border font-medium transition-all ${selectedSubtitleLanguage === lang
                                                        ? 'bg-neutral-700 border-neutral-600 text-white shadow-lg'
                                                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                                                        }`}
                                                >
                                                    {langLabel}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {selectedSubtitleLanguage && release.lyrics?.[selectedSubtitleLanguage as keyof typeof release.lyrics] && (
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mt-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Subtitles className="w-5 h-5 text-neutral-400" />
                                                <h4 className="text-lg font-medium text-neutral-100">
                                                    {LANGUAGE_OPTIONS.find(opt => opt.key === selectedSubtitleLanguage)?.label || selectedSubtitleLanguage.toUpperCase()} Subtitles
                                                </h4>
                                            </div>
                                            <div className="text-neutral-300 whitespace-pre-line leading-relaxed text-base">
                                                {release.lyrics[selectedSubtitleLanguage as keyof typeof release.lyrics]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Lyrics Tab */}
                        {/* {activeTab === 'lyrics' && getAvailableLanguages().length > 0 && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-xl font-medium text-neutral-100 mb-6">Select Lyrics Language</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                                        {getAvailableLanguages().map((lang) => {
                                            const langLabel = LANGUAGE_OPTIONS.find(opt => opt.key === lang)?.label || lang.toUpperCase();
                                            return (
                                                <button
                                                    key={lang}
                                                    onClick={() => setSelectedLyricsLanguage(lang)}
                                                    className={`px-5 py-3 rounded-lg border font-medium transition-all ${selectedLyricsLanguage === lang
                                                        ? 'bg-neutral-700 border-neutral-600 text-white shadow-lg'
                                                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                                                        }`}
                                                >
                                                    {langLabel}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {selectedLyricsLanguage && release.lyrics?.[selectedLyricsLanguage as keyof typeof release.lyrics] && (
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mt-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <FileText className="w-5 h-5 text-neutral-400" />
                                                <h4 className="text-lg font-medium text-neutral-100">
                                                    {LANGUAGE_OPTIONS.find(opt => opt.key === selectedLyricsLanguage)?.label || selectedLyricsLanguage.toUpperCase()} Lyrics
                                                </h4>
                                            </div>
                                            <div className="text-neutral-300 whitespace-pre-line leading-relaxed text-base font-serif">
                                                {release.lyrics[selectedLyricsLanguage as keyof typeof release.lyrics]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} */}

                        {activeTab === 'lyrics' && getAvailableLanguages().length > 0 && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-xl font-medium text-neutral-100 mb-6">Select Lyrics Language</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                                        {getAvailableLanguages().map((lang) => {
                                            const langLabel = LANGUAGE_OPTIONS.find(opt => opt.key === lang)?.label || lang.toUpperCase();
                                            return (
                                                <button
                                                    key={lang}
                                                    onClick={() => setSelectedLyricsLanguage(lang)}
                                                    className={`px-5 py-3 rounded-lg border font-medium transition-all ${selectedLyricsLanguage === lang
                                                        ? 'bg-neutral-700 border-neutral-600 text-white shadow-lg'
                                                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
                                                        }`}
                                                >
                                                    {langLabel}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {selectedLyricsLanguage && release.lyrics?.[selectedLyricsLanguage as keyof typeof release.lyrics] && (
                                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mt-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <FileText className="w-5 h-5 text-neutral-400" />
                                                <h4 className="text-lg font-medium text-neutral-100">
                                                    {LANGUAGE_OPTIONS.find(opt => opt.key === selectedLyricsLanguage)?.label || selectedLyricsLanguage.toUpperCase()} Lyrics
                                                </h4>
                                            </div>
                                            <div className="text-neutral-300 whitespace-pre-line leading-relaxed text-base font-serif">
                                                {release.lyrics[selectedLyricsLanguage as keyof typeof release.lyrics]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                        {/* Recording & Production Tab */}
                        {activeTab === 'production' && release.production_credits && (
                            <div className="pt-8">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8">
                                    <h3 className="text-2xl font-medium text-neutral-100 mb-8">Recording & Production</h3>

                                    {release.production_credits.studio_name && (
                                        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl">🎛️</span>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-neutral-100 mb-2">Recording Studio</h4>
                                                    <p className="text-xl text-neutral-300 font-medium mb-3">{release.production_credits.studio_name}</p>
                                                    {release.production_credits.studio_description && (
                                                        <p className="text-neutral-500 italic leading-relaxed">{release.production_credits.studio_description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {release.production_credits.lead_engineer && (
                                        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl">🎚️</span>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-neutral-100 mb-4">Engineering</h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <span className="text-sm text-neutral-500">Lead Engineer</span>
                                                            <p className="text-lg text-neutral-300 font-medium">{release.production_credits.lead_engineer}</p>
                                                        </div>

                                                        {release.production_credits.engineering_crew && release.production_credits.engineering_crew.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t border-neutral-800">
                                                                <span className="text-sm text-neutral-500 block mb-3">Engineering Crew</span>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {release.production_credits.engineering_crew.map((member: any, idx: any) => (
                                                                        <div key={idx} className="flex justify-between items-center bg-neutral-950 rounded px-4 py-2">
                                                                            <span className="text-neutral-300">{member.name}</span>
                                                                            <span className="text-sm text-neutral-600">{member.role}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {release.production_credits.music_director && (
                                                            <div className="mt-4 pt-4 border-t border-neutral-800">
                                                                <span className="text-sm text-neutral-500">Music Director</span>
                                                                <p className="text-lg text-neutral-300 font-medium">{release.production_credits.music_director}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {release.production_credits.instrumentalists && release.production_credits.instrumentalists.length > 0 && (
                                        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl">🎸</span>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-neutral-100 mb-4">Instrumentalists</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {release.production_credits.instrumentalists.map((musician: any, idx: any) => (
                                                            <div key={idx} className="flex justify-between items-center bg-neutral-950 rounded px-4 py-3">
                                                                <span className="text-neutral-300">{musician.name}</span>
                                                                <span className="text-sm text-neutral-600">{musician.instrument}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {release.production_credits.creative_direction_by && (
                                        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                                            <div className="flex items-start gap-4">
                                                <span className="text-3xl">🎨</span>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-neutral-100 mb-2">Creative Direction & Media</h4>
                                                    <p className="text-lg text-neutral-300 font-medium">{release.production_credits.creative_direction_by}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Streaming Links - Below Tabs */}
                    {!isLegacy && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-serif font-light text-neutral-100 mb-8">Streaming Platforms</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                                    <span className="text-neutral-300">Spotify</span>
                                    <span className="text-sm text-neutral-500">{release.spotify_url ? 'Available' : 'Distribution Pending'}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                                    <span className="text-neutral-300">Apple Music</span>
                                    <span className="text-sm text-neutral-500">{release.apple_music_url ? 'Available' : 'Distribution Pending'}</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Economic Transparency - Below Tabs */}
                    {!isLegacy && (
                        <section className="mb-16">
                            <h2 className="text-2xl font-serif font-light text-neutral-100 mb-8">Economic Transparency</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                                    <div className="text-sm text-neutral-500 mb-2">Royalty Split</div>
                                    <div className="text-xl text-neutral-100">{release.royalty_split_percentage || 0}%</div>
                                </div>
                                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                                    <div className="text-sm text-neutral-500 mb-2">Royalty Agreements</div>
                                    <div className="text-xl text-neutral-100">{release.royalty_agreements?.length || 0} agreement{release.royalty_agreements?.length !== 1 ? 's' : ''}</div>
                                </div>
                                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                                    <div className="text-sm text-neutral-500 mb-2">Revenue Records</div>
                                    <div className="text-xl text-neutral-100">{release.revenue_records?.length || 0} transaction{release.revenue_records?.length !== 1 ? 's' : ''}</div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Copy Link Modal */}
                {showCopyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowCopyModal(false)}>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-medium text-neutral-100">Copy Link</h3>
                                <button
                                    onClick={() => setShowCopyModal(false)}
                                    className="text-neutral-500 hover:text-neutral-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 mb-6">
                                <p className="text-sm text-neutral-400 break-all">{window.location.href}</p>
                            </div>
                            <button
                                onClick={handleCopyLink}
                                disabled={copySuccess}
                                className={`w-full py-3 rounded-lg font-medium transition-all ${copySuccess
                                    ? 'bg-green-900/30 border border-green-800 text-green-400'
                                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100'
                                    }`}
                            >
                                {copySuccess ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check className="w-5 h-5" />
                                        Copied to Clipboard
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Copy className="w-5 h-5" />
                                        Copy to Clipboard
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-medium text-neutral-100">Share</h3>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="text-neutral-500 hover:text-neutral-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="w-full flex items-center gap-4 p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-left"
                                >
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Facebook className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-neutral-100 font-medium">Facebook</div>
                                        <div className="text-sm text-neutral-500">Share on Facebook</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="w-full flex items-center gap-4 p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-left"
                                >
                                    <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center">
                                        <Twitter className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-neutral-100 font-medium">Twitter</div>
                                        <div className="text-sm text-neutral-500">Share on Twitter</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="w-full flex items-center gap-4 p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-left"
                                >
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-neutral-100 font-medium">WhatsApp</div>
                                        <div className="text-sm text-neutral-500">Share on WhatsApp</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        </Layout>
    );
}

export default Release;
