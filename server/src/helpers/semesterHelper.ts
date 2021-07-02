class Season {
  static SUMMER = (year: number): Season => {
    return new Season("SS", new Date(Date.UTC(year, 4, 1)));
  };

  static WINTER = (year: number): Season => {
    return new Season("WS", new Date(Date.UTC(year, 10, 1)));
  };

  readonly #abbrv: string;
  readonly #startDate: Date;
  readonly #year: number;

  constructor(abbrv: string, startDate: Date) {
    this.#abbrv = abbrv;
    this.#startDate = startDate;
    this.#year = this.#startDate.getUTCFullYear();
  }

  get abbrv() {
    return this.#abbrv;
  }

  get startDate() {
    return this.#startDate;
  }

  get year() {
    return this.#year;
  }

  toString(): string {
    return this.#abbrv + this.startDate.getUTCFullYear();
  }

  equals(otherSeason: Season): boolean {
    return this.#abbrv === otherSeason.abbrv && this.#year === otherSeason.year;
  }
}

export class Semester {
  readonly #season: Season;

  constructor(season: Season) {
    this.#season = season;
  }

  /* Navigation */

  next(): Semester {
    return Semester.getSemesterAfter(this);
  }

  previous(): Semester {
    const currentSeason: Season = this.#season;
    const currentYear: number = currentSeason.year;

    let previousYear = currentYear;
    let previousSeason = Season.SUMMER(currentYear);

    if (currentSeason.equals(Season.SUMMER(currentYear))) {
      previousYear = currentYear - 1;
      previousSeason = Season.WINTER(previousYear);
    }

    return new Semester(previousSeason);
  }

  /* Creators */

  static get(date: Date): Semester {
    const utcFullYear = date.getUTCFullYear();
    let season = Season.SUMMER(utcFullYear);

    if (date < season.startDate) {
      season = Season.WINTER(utcFullYear - 1); //WS of the previous year
    } else if (date >= Season.WINTER(utcFullYear).startDate) {
      season = Season.WINTER(utcFullYear); //WS of this year
    }

    return new Semester(season);
  }

  static getCurrent(): Semester {
    return this.get(new Date());
  }

  static getUpcoming(): Semester {
    return Semester.getSemesterAfter(Semester.getCurrent());
  }

  static getSemesterAfter(currentSemester: Semester): Semester {
    const currentSeason: Season = currentSemester.#season;
    const currentYear: number = currentSeason.year;

    let nextYear = currentYear;
    let nextSeason = Season.WINTER(currentYear);

    if (currentSeason.equals(Season.WINTER(currentYear))) {
      nextYear = currentYear + 1;
      nextSeason = Season.SUMMER(nextYear);
    }

    return new Semester(nextSeason);
  }

  /* Helpers */

  toString(): string {
    return this.#season.toString();
  }

  startDate(): Date {
    return this.#season.startDate;
  }

  static parseString(semesterString: string): Semester {
    const yearString = semesterString.match(/20[0-9]{2}$/);
    if (!yearString) throw "Semester is not a valid string. Needs to give full year.";
    const yearNumber = parseInt(yearString[0]);

    if (semesterString.includes(Season.SUMMER(yearNumber).abbrv))
      return new Semester(Season.SUMMER(yearNumber));
    else if (semesterString.includes(Season.WINTER(yearNumber).abbrv))
      return new Semester(Season.WINTER(yearNumber));
    else throw "Semester is not a valid string. Needs to indicate season.";
  }

  static sanitizeSemesterString(semesterString: string): string {
    const semester = Semester.parseString(semesterString);
    return semester.toString();
  }

  static isValidSemesterString(semesterString: string): boolean {
    try {
      Semester.parseString(semesterString);
      return true;
    } catch (e) {
      return false;
    }
  }
}
