import type {App, TFile} from "obsidian";

export default class MetaEditParser {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    public parseFrontmatter(file: TFile): {[key: string]: any} {
        const {position, ...rest} = this.app.metadataCache.getFileCache(file).frontmatter;
        return rest;
    }

    public async parseInlineFields(file: TFile): Promise<{ [key: string]: string}> {
        const content = await this.app.vault.read(file);

        return content.split("\n").reduce((obj: {[key: string]: string}, str: string) => {
            let parts = str.split("::");

            if (parts[0] && parts[1]) {
                obj[parts[0]] = parts[1].trim();
            }
            else if (str.includes("::")) {
                obj[str.replace("::",'')] = "";
            }

            return obj;
        },  {});
    }

}
