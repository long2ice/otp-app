import * as SQLite from "expo-sqlite";
// @ts-ignore
import { TOTP, URI } from "otpauth/dist/otpauth.esm.js";
import { DBOTP } from "./types/otp";

const db = SQLite.openDatabase("tinyotp.db");

export function createTable() {
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists otp (id integer primary key not null, uri text, created_at timestamp default current_timestamp);"
    );
  });
}

export function addOTP(totp: TOTP) {
  db.transaction((tx) => {
    tx.executeSql("insert into otp (uri) values (?)", [totp.toString()]);
  });
}
export function deleteOTP(id: number) {
  db.transaction((tx) => {
    tx.executeSql("delete from otp where id = ?", [id]);
  });
}
export function getOTPList(value?: string) {
  return new Promise<DBOTP[]>((resolve, reject) => {
    db.transaction((tx) => {
      let sql;
      if (value !== "" && value !== undefined) {
        sql = `select * from otp where uri like '%${value}%'`;
      } else {
        sql = "select * from otp";
      }
      tx.executeSql(sql, [], (_, { rows: { _array } }) => {
        resolve(_array.map((item) => ({ ...item, otp: URI.parse(item.uri) })));
      });
    });
  });
}
