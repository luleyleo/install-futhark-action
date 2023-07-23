import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

function getDownloadUrl(version: string): string {
  return `https://github.com/diku-dk/futhark/releases/download/v${version}/futhark-${version}-linux-x86_64.tar.xz`
}

async function download(version: string): Promise<string> {
  const downloadPath = await tc.downloadTool(getDownloadUrl(version))
  const extractPath = await tc.extractTar(downloadPath)
  const binPath = `${extractPath}/bin/futhark`
  const cachedPath = await tc.cacheFile(binPath, 'futhark', 'futhark', version)

  return cachedPath
}

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    core.info(`Installing futhark@v${version}`)

    core.startGroup('Install Furhatk')
    core.info('Checking whether a cached binary exists')

    let toolPath = tc.find('futhark', version);
    if (toolPath) {
      core.info('Found binary in cache')
    } else {
      core.info('Did not find binary in cache')
      core.info('Starting download')
      toolPath = await download(version)
      core.info('Finished download and caching')
    }
    core.info(`Adding ${toolPath} to PATH`)
    core.addPath(toolPath)
    core.endGroup()

    core.startGroup('Validate installation')
    const smokeTestResult = await exec.exec('futhark -V')
    if (smokeTestResult !== 0) {
      core.setFailed(`Smoke test returned ${smokeTestResult}`);
    }
    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
