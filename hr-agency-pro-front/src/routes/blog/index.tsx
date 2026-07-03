import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { blogPosts, type BlogPost } from '../../data/blogData'

export const Route = createFileRoute('/blog/')({
  component: BlogPage,
})

const VIEW = { once: true, margin: '-60px' } as const

function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
      <Tag size={10} />
      {label}
    </span>
  )
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <motion.a
      href={`/blog/${post.slug}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="group mb-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl lg:flex-row"
    >
      {/* Image */}
      <div className="aspect-video w-full shrink-0 overflow-hidden lg:aspect-auto lg:w-2/5">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-8 lg:p-10">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((t) => <TagBadge key={t} label={t} />)}
        </div>

        <h2 className="mb-4 text-2xl font-bold leading-snug text-[#0f2447] transition-colors duration-200 group-hover:text-sky-600 lg:text-3xl">
          {post.title}
        </h2>

        <p className="mb-6 text-base leading-relaxed text-slate-500">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="size-9 rounded-full object-cover" />
            <span className="text-sm font-medium text-slate-600">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Calendar size={14} />
            {post.date}
          </div>
        </div>
      </div>
    </motion.a>
  )
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.a
      href={`/blog/${post.slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((t) => <TagBadge key={t} label={t} />)}
        </div>

        <h3 className="mb-3 text-lg font-bold leading-snug text-[#0f2447] transition-colors duration-200 group-hover:text-sky-600">
          {post.title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <img src={post.author.avatar} alt={post.author.name} className="size-8 rounded-full object-cover" />
            <span className="text-xs font-medium text-slate-600">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={12} />
            {post.date}
          </div>
        </div>
      </div>
    </motion.a>
  )
}

function BlogPage() {
  const [query, setQuery] = useState('')

  const featured = blogPosts.find((p) => p.featured)
  const rest = blogPosts.filter((p) => !p.featured)

  const filtered = query
    ? blogPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : null

  const showFeatured = !query && featured
  const gridPosts = filtered ?? rest

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-50 to-sky-50/40 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-4xl font-extrabold tracking-tight text-[#0f2447] lg:text-5xl"
            >
              RemoteHero Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-10 text-lg text-slate-500"
            >
              Expert insights on remote hiring, management, and working with global talent
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="relative mx-auto max-w-2xl"
            >
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-5 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </motion.div>
          </div>
        </section>

        {/* ── Articles ─────────────────────────────────────────────────── */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">

            {/* Featured article */}
            {showFeatured && <FeaturedCard post={featured!} />}

            {/* No results */}
            {filtered && filtered.length === 0 && (
              <p className="py-16 text-center text-slate-400">No articles found for "{query}"</p>
            )}

            {/* Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            )}

          </div>
        </section>

        {/* ── Newsletter CTA ───────────────────────────────────────────── */}
        <section className="bg-sky-50 px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <h2 className="mb-1 text-xl font-bold text-[#0f2447]">
                  Get remote hiring insights in your inbox
                </h2>
                <p className="text-sm text-slate-500">
                  Join our newsletter for the latest articles, guides, and resources.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full max-w-md gap-3 lg:w-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 lg:w-64"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f2447] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  Subscribe <ArrowRight size={15} />
                </button>
              </form>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
