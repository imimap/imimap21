export default class Language {
  id: string;

  name: string;

  nativeName: string;

  constructor(id: string, name: string, nativeName: string) {
    this.id = id;
    this.name = name;
    this.nativeName = nativeName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parseFromAPIResponseData(key: string, data: any): Language {
    return new Language(key, data.name, data.nativeName);
  }

  public prettyPrint(): string {
    return `${this.name} (${this.nativeName})`;
  }
}
