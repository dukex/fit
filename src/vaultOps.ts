import { FileStats, TFile, TFolder, Vault, base64ToArrayBuffer } from "obsidian";
import { FileOpRecord } from "./fitTypes";


export interface IVaultOperations {
    vault: Vault
    deleteFromLocal: (path: string) => Promise<FileOpRecord>
    writeToLocal: (path: string, content: string) => Promise<FileOpRecord>
    updateLocalFiles: (
        addToLocal: {path: string, content: string}[], deleteFromLocal: Array<string>)
        => Promise<FileOpRecord[]>
    createCopyInDir: (path: string, copyDir: string) => Promise<void>
}

type FitTFile = TFile | ConfigTFile

export class VaultOperations implements IVaultOperations {
    vault: Vault

    constructor(vault: Vault) {
        this.vault = vault
    }


    async getTFile(path: string): Promise<FitTFile> {
        const file = this.getAbstractFileByPath(path)

        if (this.isValidFile(file)) {
            return file as FitTFile
        } else {
            throw new Error(`Attempting to read ${path} from local drive as FitTFile but not successful,
            file is of type ${typeof file}.`)
        }
    }

    getAbstractFileByPath(path: string) {
        if(path.startsWith(this.vault.configDir)) {
        return new ConfigTFile(this.vault, path);
        }

        return this.vault.getAbstractFileByPath(path);
    }

    isValidFile(file: any) {
        return file && (file instanceof TFile || file instanceof ConfigTFile)
    }

    async deleteFromLocal(path: string): Promise<FileOpRecord> {
        // adopted getAbstractFileByPath for mobile compatiability
        const file = this.getAbstractFileByPath(path)
        if (this.isValidFile(file)) {
            await this.vault.delete(file as FitTFile);
            return {path, status: "deleted"}
        }
        throw new Error(`Attempting to delete ${path} from local but not successful, file is of type ${typeof file}.`);
    }

    // if checking a folder, require including the last / in the path param
    async ensureFolderExists(path: string): Promise<void> {
        // extract folder path, return empty string is no folder path is matched (exclude the last /)
        const folderPath = path.match(/^(.*)\//)?.[1] || '';
        debugger
        if (folderPath != "" && !folderPath.startsWith(".obsidian")) {
            const folder = this.getAbstractFileByPath(folderPath)
            if (!folder) {
                await this.vault.createFolder(folderPath)
            }
        }
    }


    async writeToLocal(path: string, content: string): Promise<FileOpRecord> {
        // adopted getAbstractFileByPath for mobile compatiability
        // TODO: add capability for creating folder from remote
        const file = this.getAbstractFileByPath(path)

        if (this.isValidFile(file)) {
            await this.vault.modifyBinary(file as FitTFile, base64ToArrayBuffer(content))
            return {path, status: "changed"}
        } else if (!file) {
            this.ensureFolderExists(path)
            await this.vault.createBinary(path, base64ToArrayBuffer(content))
            return {path, status: "created"}
        }
            throw new Error(`${path} writeToLocal operation unsuccessful, vault abstractFile on ${path} is of type ${typeof file}`);
    }

    async updateLocalFiles(
        addToLocal: {path: string, content: string}[],
        deleteFromLocal: Array<string>): Promise<FileOpRecord[]> {
            // Process file additions or updates
            const writeOperations = addToLocal.map(async ({path, content}) => {
                return await this.writeToLocal(path, content)
            });

            // Process file deletions
            const deletionOperations = deleteFromLocal.map(async (path) => {
                return await this.deleteFromLocal(path)
            });
            const fileOps = await Promise.all([...writeOperations, ...deletionOperations]);
            return fileOps
    }

    async createCopyInDir(path: string, copyDir = "_fit"): Promise<void> {
        const file = this.getAbstractFileByPath(path)
        if (this.isValidFile(file)) {
            const copy = await this.vault.readBinary(file as FitTFile)
            const copyPath = `${copyDir}/${path}`
            this.ensureFolderExists(copyPath)
            const copyFile = this.getAbstractFileByPath(path)
            if (this.isValidFile(copyFile)) {
                await this.vault.modifyBinary(copyFile as FitTFile, copy)
            } else if (!copyFile) {
                await this.vault.createBinary(copyPath, copy)
            } else {
                this.vault.delete(copyFile, true) // TODO add warning to let user know files in _fit will be overwritten
                await this.vault.createBinary(copyPath, copy)
            }
            await this.vault.createBinary(copyPath, copy)
        } else {
            throw new Error(`Attempting to create copy of ${path} from local drive as TFile but not successful,
            file is of type ${typeof file}.`)
        }
    }

    settingsX = true;

    async getFiles(): Promise<FitTFile[]> {
      const x = await this.vault.adapter.list(this.vault.configDir)

      return [
        ...this.vault.getFiles(),
        ...x.files.filter(x => this.settingsX).map(path => new ConfigTFile(this.vault, path))
      ]
    }
}

class ConfigTFile implements TFile {
  path: string;
  vault: Vault;

  constructor(vault : Vault, path: string){
     this.vault = vault,
    this.path = path;

  }

  cache(t: string) {
    return t;
    return this.vault.adapter.read(this.path);
  }

  stat: FileStats;
  basename: string;
  extension: string;
  name: string;
  parent: TFolder | null;
}
