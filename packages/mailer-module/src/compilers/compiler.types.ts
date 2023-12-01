export interface CompilerParams {
    /**
     * The directory where are the templates stored.
     */
    templateDir: string;
}

export type TemplateData = Record<string, any>;

export interface CompileOptions {
    /**
     * Filename of the target template (needs to be stored in CompilerParams["templateDir"])
     */
    templateName?: string;
    /**
     * Data needed to compile the template
     */
    data?: TemplateData;
}

export interface ICompiler {
    compileTemplate(options: CompileOptions): Promise<string>;
}
