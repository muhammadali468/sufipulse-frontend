"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '../../components/layout/Layout';
import { PageContainer } from '../../components/layout/PageContainer';
import { Section } from '../../components/layout/Section';
import { Calendar, Clock, Tag, User, ArrowLeft, Eye, BookOpen, Share2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  reading_time_minutes: number;
  featured: boolean;
  published_at: string;
  tags: string[];
  view_count: number;
  author_id: string;
  author_name?: string;
}

export default function LiteraryArticle() {
  const loading = false;

  const article: Article = {
    id: "1",
    title: "The Silent Symphony: finding God in the pause",
    subtitle: "An exploration of silence as a spiritual medium in modern Sufi practice",
    slug: "silent-symphony",
    category: "reflective_essay",
    content: "Silence is not the absence of sound, but rather the canvas upon which the Divine speaks. In today's chaotic landscape, finding true silence is akin to discovering water in a desert...\n\nWhen we pause to observe the spaces between our thoughts, we encounter the vastness of our own being. This is where reflection transforms into revelation. Historically, Sufis have considered seclusion (khalwa) as a necessary retreat, not to escape the world, but to return to it with a clarified heart.\n\nTake the breath, for example. The moment between inhalation and exhalation is a profound pause. In that brief suspension, one can find a stillness that transcends time, and a gentle reminder of the eternal presence of the Creator.",
    excerpt: "Silence is not the absence of sound, but rather the canvas upon which the Divine speaks. In today's chaotic landscape, finding true silence...",
    reading_time_minutes: 5,
    featured: true,
    published_at: "2025-08-16T10:00:00Z",
    tags: ["Silence", "Meditation", "Modern Spirituality"],
    view_count: 3450,
    author_id: "a1",
    author_name: "Yusuf Al-Amin"
  };

  const relatedArticles: Article[] = [
    {
      id: "2",
      title: "The Architecture of the Heart",
      subtitle: "Building inner sanctuaries",
      slug: "architecture-of-the-heart",
      category: "reflective_essay",
      content: "...",
      excerpt: "Building an inner sanctuary requires patience and a deep understanding of our own foundations...",
      reading_time_minutes: 4,
      featured: false,
      published_at: "2025-07-20T10:00:00Z",
      tags: ["Heart", "Growth"],
      view_count: 1205,
      author_id: "a2",
      author_name: "Zainab Rumi"
    },
    {
      id: "3",
      title: "Navigating the Ego",
      subtitle: "Practical steps in daily life",
      slug: "navigating-ego",
      category: "reflective_essay",
      content: "...",
      excerpt: "The ego is not a monster to be slain, but a companion to be guided. Here are some reflections on practical ways...",
      reading_time_minutes: 6,
      featured: false,
      published_at: "2025-06-15T10:00:00Z",
      tags: ["Ego", "Practice"],
      view_count: 2340,
      author_id: "a1",
      author_name: "Yusuf Al-Amin"
    }
  ];

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <Section className="pt-24 pb-20">
          <PageContainer>
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          </PageContainer>
        </Section>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <Section className="pt-24 pb-20">
          <PageContainer>
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-6">Article not found</p>
              <Link
                href="/literary-journal"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Literary Journal
              </Link>
            </div>
          </PageContainer>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Section className="pt-24 pb-8">
        <PageContainer>
          <Link
            href="/literary-journal"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Literary Journal
          </Link>

          <article className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-sm font-medium mb-6">
              <Tag className="w-4 h-4" />
              {formatCategory(article.category)}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl md:text-2xl text-neutral-300 mb-8 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400 pb-6 border-b border-neutral-800/50 mb-8">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-neutral-300">{article.author_name}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.reading_time_minutes} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {article.view_count.toLocaleString()} views
              </span>
              <button
                onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors ml-auto"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            <div className="prose prose-lg prose-invert prose-amber max-w-none">
              <div className="text-neutral-200 leading-[1.8] text-lg whitespace-pre-wrap font-serif">
                {article.content}
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-neutral-800/50">
                <h3 className="text-sm font-medium text-neutral-400 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-neutral-900/50 border border-neutral-800 hover:border-amber-400/30 text-neutral-300 text-sm rounded-lg transition-all hover:bg-neutral-900/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </PageContainer>
      </Section>

      {relatedArticles.length > 0 && (
        <Section className="py-12 pb-20 border-t border-neutral-800/50 bg-gradient-to-b from-transparent to-neutral-900/20">
          <PageContainer>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-400/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Continue Reading
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link
                  key={related.id}
                  href={`/literary-journal/${related.slug}`}
                  className="group block bg-neutral-900/30 border border-neutral-800 rounded-lg p-6 hover:border-amber-400/30 hover:bg-neutral-900/50 transition-all hover:shadow-lg hover:shadow-amber-400/5 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className="px-2 py-1 bg-amber-400/10 border border-amber-400/20 rounded text-amber-400 text-xs font-medium">
                      {formatCategory(related.category)}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {related.title}
                  </h3>

                  <p className="text-neutral-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {related.excerpt}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(related.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {related.reading_time_minutes} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </PageContainer>
        </Section>
      )}
    </Layout>
  );
}
