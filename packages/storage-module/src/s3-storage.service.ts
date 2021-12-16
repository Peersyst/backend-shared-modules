import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import * as stream from "stream";
import { StorageBusinessException } from "./exception/business.exception";
import { StorageErrorCode } from "./exception/error-codes";
import { FileInformation, StorageServiceInterface } from "./storage.module";

@Injectable()
export class S3StorageService implements StorageServiceInterface {
    private s3: AWS.S3;
    private bucketName: string;

    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
        AWS.config.update({
            region: this.configService.get("aws.region"),
            accessKeyId: this.configService.get("aws.accessKeyId"),
            secretAccessKey: this.configService.get("aws.secretAccessKey"),
        });
        
        this.s3 = new AWS.S3();
        this.bucketName = this.configService.get("aws.bucketName");
    }

    async getFileAsBuffer(filePath: string): Promise<Buffer> {
        const params = { Bucket: this.bucketName, Key: filePath };
        const file = await this.s3.getObject(params).promise();
        if (!file) {
            throw new StorageBusinessException(StorageErrorCode.FILE_NOT_FOUND);
        }
        return file.Body as Buffer;
    }

    getFileAsStream(filePath: string): stream.Readable {
      return this.s3.getObject({
        Bucket: this.bucketName,
        Key: filePath,
      }).createReadStream();
    }

    async storeFileFromBuffer(fileBuffer: Buffer, fileInformation: FileInformation): Promise<void> {
        const params: AWS.S3.Types.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: fileInformation.path,
            Body: fileBuffer,
        };

        if (fileInformation.mimetype) {
            params.ContentType = fileInformation.mimetype;
        }
        if (fileInformation.encoding) {
            params.ContentEncoding = fileInformation.encoding;
        }
        if (fileInformation.size) {
            params.ContentLength = fileInformation.size;
        }

        await this.s3.putObject(params).promise();
    }

    async deleteFile(filePath: string): Promise<void> {
      await this.s3.deleteObject({ Bucket: this.bucketName, Key: filePath }).promise();
    }

    async getFileSize(filePath: string): Promise<number> {
      const head = await this.s3.headObject({
        Bucket: this.bucketName,
        Key: filePath,
      }).promise();
  
      return head.ContentLength;
    }

    writeFileStream(filePath: string, onSuccess: () => void, onError: (err: Error) => void): stream.Writable {
      const pass = new stream.PassThrough();
      this.s3.upload({
        Bucket: this.bucketName,
        Key: filePath,
        Body: pass,
      }).promise()
        .then(() => {
          onSuccess();
        })
        .catch((err: Error) => {
          onError(err);
        });
      return pass;
    }
}
