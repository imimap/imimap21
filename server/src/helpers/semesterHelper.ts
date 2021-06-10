// todo : complete!
// https://github.com/imimap/imimap/blob/master/app/models/semester_helper.rb
// https://github.com/imimap/imimap/blob/master/app/models/semester.rb
class Season {
  static SUMMER = (year: number) => {
    return new Season("SS", new Date(year, 4, 1));
  };

  static WINTER = (year: number) => {
    return new Season("WS", new Date(year, 10, 1));
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

  toString() {
    return this.#abbrv + this.startDate.getUTCFullYear();
  }

  equals(otherSeason: Season) {
    return this.#abbrv === otherSeason.abbrv && this.#year === otherSeason.year;
  }
}

export class Semester {
  readonly #season: Season;

  constructor(season: Season) {
    this.#season = season;
  }

  /* Navigation */

  next() {
    return Semester.getSemesterAfter(this);
  }

  previous() {
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

  static get(date: Date) {
    const utcFullYear = date.getUTCFullYear();
    let season = Season.SUMMER(utcFullYear);

    if (date < season.startDate) {
      season = Season.WINTER(utcFullYear - 1); //WS of the previous year
    } else if (date >= Season.WINTER(utcFullYear).startDate) {
      season = Season.WINTER(utcFullYear); //WS of this year
    }

    return new Semester(season);
  }

  static getCurrent() {
    return this.get(new Date());
  }

  static getUpcoming() {
    return Semester.getSemesterAfter(Semester.getCurrent());
  }

  static getSemesterAfter(currentSemester: Semester) {
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

  toString() {
    return this.#season.toString();
  }

  startDate() {
    return this.#season.startDate;
  }
}
