import handlebars from 'handlebars';
import fs from 'fs';
import { IParseMailTemplate } from './Interfaces';

export class HandlebarsMailTemplate {
	public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
		const templateFileContent = await fs.promises.readFile(file, 'utf8');
		const parsedTemplate = handlebars.compile(templateFileContent);
		return parsedTemplate(variables);
	}
}
