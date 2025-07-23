export class Option<T = string> {
  constructor(
    public label: string,
    public value: T,
  ) {}
}
