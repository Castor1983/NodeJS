import path from 'node:path';
import fs from 'node:fs/promises';

const dbPath = path.join(process.cwd(), 'db.json');

const reader = async ():Promise<any[]> => {
    const json = await fs.readFile(dbPath, {encoding: 'utf-8'});
    return  JSON.parse(json);
}
const writer = async (users: any[]) => {
    await fs.writeFile(dbPath, JSON.stringify(users));
}
export = {
    reader,
    writer
}