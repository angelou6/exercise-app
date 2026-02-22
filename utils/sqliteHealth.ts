import { Directory, File, Paths } from "expo-file-system";

let hasValidatedSQLiteDirectory = false;

export function ensureSQLiteDirectoryHealth() {
  if (hasValidatedSQLiteDirectory) {
    return;
  }

  hasValidatedSQLiteDirectory = true;

  try {
    const sqliteDirectory = new Directory(Paths.document, "SQLite");
    const sqlitePathInfo = Paths.info(sqliteDirectory.uri);

    if (sqlitePathInfo.exists && sqlitePathInfo.isDirectory === false) {
      const invalidSQLitePathNode = new File(sqliteDirectory.uri);
      invalidSQLitePathNode.delete();
    }

    sqliteDirectory.create({ idempotent: true, intermediates: true });
  } catch (error) {
    console.error("Failed to repair SQLite directory", error);
  }
}
