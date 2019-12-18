export class ScoreSubmitedEvent {
  constructor(
    public readonly userId: string,
    public readonly scoreWorth: number,
    public readonly timestamp: number,
  ) {}
}
