export class Option<T = string> {
  constructor(
    public value: T,
    public label: string,
  ) {}
}
