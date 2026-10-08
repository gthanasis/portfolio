// Publishes the skills in content/skills/<name>/ (the generic, public versions) to public/skills/:
//   public/skills/<name>/SKILL.md   shown inline on the blog
//   public/skills/<name>.zip        the whole folder, for skills that ship references or scripts
// Runs before `dev` and `build`; the output is generated, so public/skills is gitignored.
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { zipSync } from 'fflate'

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
  if (list.length > 1) {
    const entries = {}
    for (const f of list) {
      const { mode } = await stat(path.join(dir, f))
      // Unzips as tg-<name>/..., ready to drop into .claude/skills/. Scripts keep their exec bit.
      entries[`tg-${name}/${f.split(path.sep).join('/')}`] = [await readFile(path.join(dir, f)), { os: 3, attrs: (mode & 0o777) << 16 }]
    }
    await writeFile(path.join(target, `${name}.zip`), zipSync(entries, { level: 9, mtime: new Date('2026-01-01') }))
  }
}
console.log(`Published ${names.length} skills to public/skills`)
