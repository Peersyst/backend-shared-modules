import { Inject, Injectable } from "@nestjs/common";
import * as stream from "stream";
import * as path from "path";
import * as fs from "fs";
import { StorageBusinessException } from "./exception/business.exception";
import { StorageErrorCode } from "./exception/error-codes";
import { FileInformation, StorageServiceInterface } from "./storage.module";
import { STORAGE_MODULE_OPTIONS } from "./storage.constants";
import { StorageModuleOptions } from "./storage.module";

@Injectable()
export class LocalStorageService implements StorageServiceInterface {
    private rootPath: string;

    constructor(@Inject(STORAGE_MODULE_OPTIONS)  private readonly config: StorageModuleOptions) {
        this.rootPath = config.rootPath;
    }

    async getFileAsBuffer(fileRelPath: string): Promise<Buffer> {
      const filePath = path.join(this.rootPath, fileRelPath);
      if (!fs.existsSync(filePath)) {
        throw new StorageBusinessException(StorageErrorCode.FILE_NOT_FOUND);
      }

      const buffer = fs.readFileSync(filePath);
      return buffer;
    }

    async getFileAsStream(fileRelPath: string): Promise<stream.Readable> {
      const filePath = path.join(this.rootPath, fileRelPath);
      if (!fs.existsSync(filePath)) {
        throw new StorageBusinessException(StorageErrorCode.FILE_NOT_FOUND);
      }
      return fs.createReadStream(filePath);
    }

    async storeFileFromBuffer(fileBuffer: Buffer, fileInformation: FileInformation): Promise<void> {
      this.checkDirExists(fileInformation.path);
      const filePath = path.join(this.rootPath, fileInformation.path);
      return fs.writeFileSync(filePath, fileBuffer);
    }

    async deleteFile(fileRelPath: string): Promise<void> {
      const filePath = path.join(this.rootPath, fileRelPath);
      if (fs.existsSync(filePath)) {
        return fs.unlinkSync(filePath);
      }
    }

    async getFileSize(fileRelPath: string): Promise<number> {
      const filePath = path.join(this.rootPath, fileRelPath);
      const stats = fs.statSync(filePath);
      return stats.size;
    }

    writeFileStream(fileRelPath: string, onSuccess: () => void, onError: (err: Error) => void): stream.Writable {
      this.checkDirExists(fileRelPath);
      const filePath = path.join(this.rootPath, fileRelPath);

      return fs.createWriteStream(filePath)
        .on("close", () => {
          onSuccess();
        })
        .on("error", (err: Error) => {
          onError(err);
        });
    }

    private checkDirExists(filePath) {
      const fileDir = path.dirname(path.join(this.rootPath, filePath));
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
    }
}
