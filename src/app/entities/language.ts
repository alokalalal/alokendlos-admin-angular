export class Language {
    id: number;
    name: string;
    languageCode: string;
    constructor(langaugae: Language) {
      this.id = langaugae.id
      this.name = langaugae.name;
      this.languageCode = langaugae.languageCode;
    }
  }