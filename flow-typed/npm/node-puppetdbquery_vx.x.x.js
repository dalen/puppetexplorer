// @flow
declare module 'node-puppetdbquery' {
  declare type query = string | query[];

  declare class puppetdbquery {
    static parse(query: string): ?query,
  }

  declare module.exports: Class<puppetdbquery>;
}
