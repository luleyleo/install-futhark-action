import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'

function getDownloadUrl(version: string): string {
    return `https://github.com/diku-dk/futhark/releases/download/v${version}/futhark-${version}-linux-x86_64.tar.xz`
}

export async function download(version: string): Promise<string> {
    const downloadPath = await tc.downloadTool(getDownloadUrl(version))
    const extractPath = await tc.extractTar(downloadPath, undefined, 'x')
    const binPath = `${extractPath}/futhark-${version}-linux-x86_64/bin/futhark`
    const cachedPath = await tc.cacheFile(binPath, 'futhark', 'futhark', version)

    return cachedPath
}

export async function smokeTest(explicitPath = ''): Promise<number> {
    if (explicitPath !== '') {
        explicitPath = `${explicitPath}/`
    }

    return exec.exec(`${explicitPath}futhark -V`)
}
