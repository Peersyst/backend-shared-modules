import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as stream from 'stream';
import * as path from 'path';
import * as fs from 'fs';
import { StorageBusinessException } from "./exception/business.exception";
import { StorageErrorCode } from "./exception/error-codes";
import { FileInformation, StorageServiceInterface } from "./storage.module";

@Injectable()
export class LocalStorageService implements StorageServiceInterface {
    private rootPath: string;

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
        this.rootPath = this.configService.get("local.rootPath");
    }

    async getFileAsBuffer(fileRelPath: string): Promise<Buffer> {
      try {
        const filePath = path.join(this.rootPath, fileRelPath);
        const buffer = fs.readFileSync(filePath);
        return Promise.resolve(buffer);
      } catch (error) {
        if (error.code === "ENOENT") {
          throw new StorageBusinessException(StorageErrorCode.FILE_NOT_FOUND);
        }
        throw error;
      }
    }

    getFileAsStream(fileRelPath: string): stream.Readable {
      const filePath = path.join(this.rootPath, fileRelPath);
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
        .on('close', () => {
          onSuccess();
        })
        .on('error', (err: Error) => {
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
