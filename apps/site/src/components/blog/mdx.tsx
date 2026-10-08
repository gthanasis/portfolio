import { Children, isValidElement, useId, type ComponentProps, type ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { renderCode } from '@/lib/code'
import { SkillSourceToggle } from './SkillSourceToggle'

// Blocks available in every post without importing them.

/** Numbered note in the right margin on wide screens; tap the number to open it inline on narrow ones. */
export function Sidenote({ children }: { children: ReactNode }) {
  const id = useId()
  return (
    <>
      <label htmlFor={id} className="sn-ref" aria-label="Show sidenote" />
      <input type="checkbox" id={id} className="sn-toggle" />
      <small className="sidenote">{children}</small>
    </>
  )
}

/** The one line a reader should remember. */
export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="pull">
      <blockquote>{children}</blockquote>
      {cite && <figcaption>{cite}</figcaption>}
    </figure>
  )
}

/** Image or diagram with a caption. `wide` lets it run into the margin. */
export function Figure({ src, alt, caption, wide, children }: { src?: string; alt?: string; caption?: ReactNode; wide?: boolean; children?: ReactNode }) {
  return (
    <figure className={wide ? 'fig wide' : 'fig'}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export serves images as files */}
      {src ? <img src={src} alt={alt ?? ''} loading="lazy" /> : children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** The short version, for readers who stop after the first screen. */
export function Takeaways({ title = 'TL;DR', children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="takeaways" aria-label={title}>
      <p className="takeaways-head">{title}</p>
      <div className="takeaways-body">{children}</div>
    </aside>
  )
}

/** A tangent that should not break the flow. */
export function Aside({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="aside">
      {title && <p className="aside-title">{title}</p>}
      {children}
    </aside>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>
}

/**
 * Section header for one item in a catalogue post: the item's mono name, then its `## heading`
 * and a one-line tagline written inside as markdown, so the heading keeps its anchor.
 * `needs` lists what the skill expects to be installed or set up.
 * When content/skills/<name>/ exists, its SKILL.md can be shown, and it downloads as the file, or as a zip
 * when the skill ships references or scripts (both published by scripts/build-skills.mjs).
 */
export async function Skill({ name, needs, children }: { name: string; needs?: string[]; children: ReactNode }) {
  const slug = name.replace(/^tg:/, '')
  const dir = path.join(process.cwd(), 'content/skills', slug)
  const source = await readFile(path.join(dir, 'SKILL.md'), 'utf8').catch(() => null)
  // What the zip adds beside SKILL.md, by top-level name: ['references', 'scripts'], or ['REFERENCE.md'].
  const extras = source === null ? [] : (await readdir(dir)).filter((f) => f !== 'SKILL.md' && !f.startsWith('.')).sort()
  const zipped = extras.length > 0
  return (
    <div className="sk-head">
      <span className="sk-name">{name}</span>
      {children}
      {needs && needs.length > 0 && (
        <p className="sk-needs">
          <span>needs</span> {needs.join(' · ')}
        </p>
      )}
      {source !== null && (
        <SkillSourceToggle
          id={`source-${slug}`}
          href={zipped ? `/skills/${slug}.zip` : `/skills/${slug}/SKILL.md`}
          filename={zipped ? `tg-${slug}.zip` : `tg-${slug}-SKILL.md`}
          extras={extras}
          lines={source.trimEnd().split('\n').length}
        >
          <div dangerouslySetInnerHTML={{ __html: await renderCode(source, 'md', `${name}/SKILL.md`) }} />
        </SkillSourceToggle>
      )}
    </div>
  )
}

/** Overview card listing <SkillRow>s, with the site's mono header strip. Groups are <SkillGroup> rows. */
export function SkillList({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  const count = Children.toArray(children).filter((c) => isValidElement(c) && c.type === SkillRow).length
  return (
    <figure className="sk-list">
      <div className="loop-head">
        <span>
          <b>{title}</b> · {count} skills
        </span>
        {meta && <span>{meta}</span>}
      </div>
      <ul>{children}</ul>
    </figure>
  )
}

export function SkillGroup({ children }: { children: ReactNode }) {
  return <li className="sk-group">{children}</li>
}

export function SkillRow({ name, href, children }: { name: string; href: string; children: ReactNode }) {
  return (
    <li>
      <a href={href}>
        <code>{name}</code>
        <span>{children}</span>
      </a>
    </li>
  )
}

// Wide tables scroll inside their own box instead of widening the page.
function Table(props: ComponentProps<'table'>) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  Sidenote,
  PullQuote,
  Figure,
  Takeaways,
  Aside,
  Kbd,
  Skill,
  SkillList,
  SkillGroup,
  SkillRow,
  table: Table,
}
