import { fileURLToPath, URL } from 'node:url'
import { exec } from 'child_process'


export class Unzip {
    private static async get7zPath() {
        // 判断系统 如果是 Ubuntu
        if (process.platform === 'linux') {
            return '7z'
        }

        let dbfile = fileURLToPath(new URL('.//libs/7z/7z.exe', import.meta.url));
        // console.log(dbfile);
        return dbfile
    }

    public static async unzip(zipPath: string, destPath: string) {
        const _7zPath = await this.get7zPath();
        return new Promise((resolve, reject) => {
            exec(`${_7zPath} x -y ${zipPath} -o${destPath}`, (err: any, stdout: any, stderr: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(stdout)
                }
            });
        })
    }

}