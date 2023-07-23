import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { download, smokeTest } from './utils'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    core.info(`Installing futhark@v${version}`)

    core.startGroup('Install Futhark')
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
    const smokeTestResult = await smokeTest()
    if (smokeTestResult) {
      core.setFailed(`Smoke test returned ${smokeTestResult}`);
    }
    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
