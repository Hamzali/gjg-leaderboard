export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly displayName: string,
    public readonly points: number,
    public readonly country: string,
  ) {}
}
