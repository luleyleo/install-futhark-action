import { tmpdir } from 'os'
import { expect, test } from '@jest/globals'
import { download, smokeTest } from '../src/utils'

test('can download futhark 0.25.2', async () => {
  process.env.RUNNER_TOOL_CACHE = process.env.RUNNER_TOOL_CACHE || tmpdir()
  process.env.RUNNER_TEMP = process.env.RUNNER_TEMP || tmpdir()

  const file = await download('0.25.2')
  const result = await smokeTest(file)

  expect(result).toBe(0)
})
