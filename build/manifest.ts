import fs from 'fs-extra'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pc from 'picocolors'
import { glob } from 'glob'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Manifest = {
  id: string
  name: string
  description: string
}

export async function main() {
  const manifests: Manifest[] = []

  try {
    // const manifests = await fs.readdir(join(__dirname, '..'), { recursive: true })
    const manifestFilePaths = await glob('**/template.json', {
      cwd: join(__dirname, '..'),
      absolute: true,
      maxDepth: 2,
    })

    for (const filePath of manifestFilePaths) {
      const manifest = await Bun.file(filePath).json()
      manifests.push(manifest)
    }

    console.debug(pc.cyan('[SUCCESS][main]: Found the following manifests:'))
    console.debug(pc.cyan(JSON.stringify(manifests, null, 2)))

    await fs.writeJSON(join(__dirname, '..', 'manifest.json'), manifests, {
      spaces: 2,
    })

    console.log(pc.green('[SUCCESS][main]: Wrote manifest to file.'))
  } catch (error) {
    console.error(`[ERROR][main]: An error has been caught:`)
    console.error(error)
  }
}

main()
  .then(() => {
    console.log(pc.green('[SUCCESS][main]: Brok has finished running.'))

    process.exit(0)
  })
  .catch(err => {
    console.error(pc.red('[ERROR][main]: Brok has encountered an uncaught error.'))
    console.error(err)

    process.exit(1)
  })
