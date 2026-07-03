import { useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, Link2, Tag, User } from 'lucide-react'
import { PublicNavbar } from '../../components/landing/PublicNavbar'
import { Footer } from '../../components/landing/Footer'
import { blogPosts, type ContentBlock } from '../../data/blogData'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug)
    if (!post) throw notFound()
    return post
  },
})

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="mb-4 mt-12 border-l-[3px] border-sky-400 pl-4 text-2xl font-bold text-sky-700">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={i} className="mb-3 mt-8 text-xl font-semibold text-sky-600">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p key={i} className="mb-4 text-base leading-relaxed text-slate-600">
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul key={i} className="mb-4 space-y-2 pl-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-base text-slate-600">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'ul-labeled':
      return (
        <ul key={i} className="mb-4 space-y-3 pl-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-base text-slate-600">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500" />
              <span>
                <span className="font-semibold text-[#0f2447]">{item.label}:</span>{' '}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )
  }
}

function BlogPostPage() {
  const post = Route.useLoaderData()
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-10">

          {/* Back link */}
          <motion.a
            href="/blog"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-sky-600"
          >
            <ArrowLeft size={15} /> Back to all articles
          </motion.a>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-[#0f2447] lg:text-4xl"
          >
            {post.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mb-5 flex flex-wrap items-center gap-4 text-sm text-slate-500"
          >
            <span className="flex items-center gap-1.5">
              <User size={14} /> {post.author.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {post.date}
            </span>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {post.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                <Tag size={10} /> {t}
              </span>
            ))}
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 overflow-hidden rounded-2xl"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-72 w-full object-cover lg:h-96"
            />
          </motion.div>

          {/* Content */}
          {post.content ? (
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.28 }}
            >
              {post.content.map((block, i) => renderBlock(block, i))}
            </motion.article>
          ) : (
            <p className="text-slate-400 italic">Content coming soon.</p>
          )}

          {/* Share */}
          <div className="mt-16 border-t border-slate-100 pt-10">
            <p className="mb-5 text-sm font-medium text-slate-400">Share this article</p>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-sky-300 hover:text-sky-600"
              >
                <FacebookIcon />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-sky-300 hover:text-sky-600"
              >
                <TwitterIcon />
              </a>
              <button
                onClick={handleCopy}
                aria-label="Copy link"
                className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-sky-300 hover:text-sky-600"
              >
                <Link2 size={15} />
              </button>
            </div>
            {copied && (
              <p className="mt-3 text-xs font-medium text-sky-600">Link copied!</p>
            )}
          </div>

          {/* Author card */}
          <div className="mt-8 flex items-start gap-5 rounded-2xl bg-slate-50 p-6">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="size-14 shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="mb-1 text-base font-bold text-[#0f2447]">{post.author.name}</p>
              <p className="text-sm leading-relaxed text-slate-500">
                This article was written by a RemoteHero team member, providing expert insights about remote work and global hiring practices.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
