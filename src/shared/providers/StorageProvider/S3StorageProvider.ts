import aws, { S3 } from 'aws-sdk';
import path from 'path';
import uploadConfig from '../../../config/upload';
import mime from 'mime';
import { fs } from 'mz';

export default class S3StorageProvider {
	private client: S3;
	constructor() {
		this.client = new aws.S3({
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
			},
		});
	}
	public async saveFile(file: string): Promise<string> {
		const originalPath = path.resolve(uploadConfig.tmpFolder, file);

		const ContentType = mime.getType(originalPath);
		if (!ContentType) {
			throw new Error('File not found');
		}

		try {
			console.log('save');
			const fileContent = await fs.promises.readFile(originalPath);

			const response = await this.client
				.putObject({
					Bucket: uploadConfig.config.aws.bucket,
					Key: file,
					ACL: 'public-read',
					Body: fileContent,
					ContentType,
				})
				.promise();
			console.log(response);

			await fs.promises.unlink(originalPath);

			return `https://gamesstore.s3.amazonaws.com/${file}`;
		} catch (e: any) {
			console.log(e);
			throw new Error(e);
		}
	}
	public async deleteFile(fileName: string): Promise<void> {
		console.log('del');
		await this.client
			.deleteObject({
				Bucket: uploadConfig.config.aws.bucket,
				Key: fileName,
			})
			.promise()
			.catch(() => {
				throw new Error(`Error deleting`);
			});
	}
}
