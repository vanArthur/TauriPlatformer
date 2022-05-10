import * as core from '@actions/core'
import { getOctokit, context } from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'
import fs from 'fs'

interface Release {
  id: number
  uploadUrl: string
  htmlUrl: string
}

interface GitHubReleaseAsset {
  id: number
  name: string
  state: string
  size: number
  browser_download_url: string
}

interface GitHubRelease {
  id: number
  upload_url: string
  html_url: string
  tag_name: string
  assets: GitHubReleaseAsset[]
}

function allReleases(
  github: InstanceType<typeof GitHub>
): AsyncIterableIterator<{ data: GitHubRelease[] }> {
  const params = { per_page: 100, ...context.repo }
  return github.paginate.iterator(
    github.rest.repos.listReleases.endpoint.merge(params)
  )
}


function getAssetPlatform(platform: string, fileName: string): string | null {
	// macOS
	if (
		(fileName.includes(".app.tar.gz") || fileName.includes(".dmg")) &&
		platform === "darwin"
	) {
		return 'darwin'
	}

	// Windows
	if (fileName.includes('.msi') && platform === "win32") {
		return 'win64'
	}

  // Linux
	if ((fileName.includes('AppImage') || fileName.includes("deb")) && platform === "linux") {
		return 'linux'
	}

  return null
}


export default async function createRelease(
  tagName: string,
  releaseName: string,
  body?: string,
  commitish?: string,
  draft = true,
  prerelease = true
): Promise<Release> {
  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error('GITHUB_TOKEN is required')
  }

  // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
  const github = getOctokit(process.env.GITHUB_TOKEN)

  // Get owner and repo from context of payload that triggered the action
  const { owner, repo } = context.repo

  const bodyPath = core.getInput('body_path', { required: false })
  let bodyFileContent = null
  if (bodyPath !== '' && !!bodyPath) {
    try {
      bodyFileContent = fs.readFileSync(bodyPath, { encoding: 'utf8' })
    } catch (error) {
      core.setFailed(error.message)
    }
  }

  let release: GitHubRelease | null = null
  try {
    // you can't get a an existing draft by tag
    // so we must find one in the list of all releases
    if (draft) {
      console.log(`Looking for a draft release with tag ${tagName}...`)
      for await (const response of allReleases(github)) {
        let releaseWithTag = response.data.find(
          release => release.tag_name === tagName
        )
        if (releaseWithTag) {
          release = releaseWithTag
          console.log(
            `Found draft release with tag ${tagName} on the release list.`
          )
          // Remove all assets from the existing release
          for (const asset of release.assets) {
            if (getAssetPlatform(process.platform, asset.name)) {
              console.log(
                `Deleting asset ${asset.name} from the existing draft release`
              )
              await github.rest.repos.deleteReleaseAsset({
                asset_id: asset.id,
                owner,
                repo,
              })
            }
          }
          break
        }
      }
      if (!release) {
        throw new Error('release not found')
      }
    } else {
      const foundRelease = await github.rest.repos.getReleaseByTag({
        owner,
        repo,
        tag: tagName
      })
      release = foundRelease.data
      console.log(`Found release with tag ${tagName}.`)
    }
  } catch (error) {
    if (error.status === 404 || error.message === 'release not found') {
      console.log(`Couldn't find release with tag ${tagName}. Creating one.`)
      const createdRelease = await github.rest.repos.createRelease({
        owner,
        repo,
        tag_name: tagName,
        name: releaseName,
        body: bodyFileContent || body,
        draft,
        prerelease,
        target_commitish: commitish || context.sha
      })

      release = createdRelease.data
    } else {
      console.log(
        `⚠️ Unexpected error fetching GitHub release for tag ${tagName}: ${error}`
      )
      throw error
    }
  }

  if (!release) {
    throw new Error('Release not found or created.')
  }

  return {
    id: release.id,
    uploadUrl: release.upload_url,
    htmlUrl: release.html_url
  }
}
