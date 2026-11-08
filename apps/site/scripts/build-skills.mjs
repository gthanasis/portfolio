// Publishes each skill's SKILL.md from content/skills/<name>/ (the generic, public versions) to
// public/skills/<name>/SKILL.md, shown inline on the blog and downloaded as is. Skills that ship
// references or scripts link to their folder on GitHub instead: Google Safe Browsing flagged the
// zips this used to build (one held a shell script), which put a warning on the whole site.
// Runs before `dev` and `build`; the output is generated, so public/skills is gitignored.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const site = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const source = path.join(site, 'content/skills')
const target = path.join(site, 'public/skills')

async function files(dir, base = dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await files(full, base)))
    else if (!entry.name.startsWith('.')) out.push(path.relative(base, full))
  }
  return out.sort()
}

await rm(target, { recursive: true, force: true })
const names = (await readdir(source, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name)
for (const name of names) {
  const dir = path.join(source, name)
  const list = await files(dir)
  if (!list.includes('SKILL.md')) throw new Error(`content/skills/${name} has no SKILL.md`)
  await mkdir(path.join(target, name), { recursive: true })
  await writeFile(path.join(target, name, 'SKILL.md'), await readFile(path.join(dir, 'SKILL.md')))
}
console.log(`Published ${names.length} skills to public/skills`)
