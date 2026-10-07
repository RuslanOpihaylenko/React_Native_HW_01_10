import * as SQLite from "expo-sqlite";
import { IBook } from "../interfaces/IBook";

export class DbSqliteService {
  private static instance: DbSqliteService | null = null;

  private static initPromise:
    Promise<DbSqliteService> | null = null;

  private db!: SQLite.SQLiteDatabase;

  private constructor() {}


  public static async getInstance(): Promise<DbSqliteService> {
    if (DbSqliteService.instance) {
      return DbSqliteService.instance;
    }

    if (!DbSqliteService.initPromise) {
      DbSqliteService.initPromise = (async () => {
        const service = new DbSqliteService();

        service.db =
          await SQLite.openDatabaseAsync(
            "library.db"
          );

        console.log(
          "База даних відкрита"
        );

        DbSqliteService.instance = service;

        return service;
      })();
    }

    return DbSqliteService.initPromise;
  }

  public async createTable(
    tableName: string,
    columns: string
  ): Promise<void> {

    await this.db.execAsync(
      `CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`
    );

    console.log(
      `Таблиця ${tableName} створена або вже існує`
    );
  }

  public async execute(
    query: string,
    params: SQLite.SQLiteBindParams = []
  ): Promise<SQLite.SQLiteRunResult> {

    console.log(
      "SQL:",
      query,
      "PARAMS:",
      params
    );

    return await this.db.runAsync(
      query,
      params
    );
  }



  public async getOne<T>(
    query: string,
    params: SQLite.SQLiteBindParams = []
  ): Promise<T | null> {

    return await this.db.getFirstAsync<T>(
      query,
      params
    );
  }

  public async getAll<T>(
    query: string,
    params: SQLite.SQLiteBindParams = []
  ): Promise<T[]> {

    return await this.db.getAllAsync<T>(
      query,
      params
    );
  }

  public async getBooks(): Promise<IBook[]> {

    return await this.getAll<IBook>(
      "SELECT * FROM books ORDER BY title"
    );
  }

  public async searchBooks(
    searchText: string
  ): Promise<IBook[]> {

    const text =
      `%${searchText.trim()}%`;

    return await this.getAll<IBook>(
      `
      SELECT *
      FROM books
      WHERE title LIKE ?
         OR author LIKE ?
      ORDER BY title
      `,
      [text, text]
    );
  }

  public async addBook(
    book: IBook
  ): Promise<void> {

    await this.execute(
      `
      INSERT INTO books
      (id, title, author)
      VALUES (?, ?, ?)
      `,
      [
        book.id,
        book.title,
        book.author,
      ]
    );
  }


  public async updateBook(
    book: IBook
  ): Promise<void> {

    await this.execute(
      `
      UPDATE books
      SET title = ?,
          author = ?
      WHERE id = ?
      `,
      [
        book.title,
        book.author,
        book.id,
      ]
    );
  }


  public async deleteBook(
    id: string
  ): Promise<void> {

    await this.execute(
      `
      DELETE FROM books
      WHERE id = ?
      `,
      [id]
    );
  }

  public async deleteAllBooks(): Promise<void> {

    await this.execute(
      "DELETE FROM books"
    );
  }
}
