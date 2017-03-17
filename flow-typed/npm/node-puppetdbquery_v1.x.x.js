// @flow
declare module 'node-puppetdbquery' {
  declare class puppetdbquery {
    static parse(query: string): ?Array<mixed>,
  }

  declare module.exports: Class<puppetdbquery>;
}
