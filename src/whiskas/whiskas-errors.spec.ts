import { WhiskasErrors } from './whiskas-errors';

describe('WhiskasErrors', () => {
  it('should be defined', () => {
    expect(new WhiskasErrors()).toBeDefined();
  });
});
