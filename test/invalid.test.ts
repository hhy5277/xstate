import { assert } from 'chai';
import { Machine } from '../src/index';

const machine = Machine({
  type: 'parallel',
  states: {
    A: {
      initial: 'A1',
      states: {
        A1: {},
        A2: {}
      }
    },
    B: {
      initial: 'B1',
      states: {
        B1: {},
        B2: {}
      }
    }
  }
});

describe('invalid or resolved states', () => {
  it('should resolve a String state', () => {
    assert.deepEqual(machine.transition('A', 'E').value, { A: 'A1', B: 'B1' });
  });

  it('should resolve transitions from empty states', () => {
    assert.deepEqual(machine.transition({ A: {}, B: {} }, 'E').value, {
      A: 'A1',
      B: 'B1'
    });
  });

  it('should allow transitioning from valid states', () => {
    machine.transition({ A: 'A1', B: 'B1' }, 'E');
  });

  it('should reject transitioning from bad state configs', () => {
    assert.throws(() => machine.transition({ A: 'A3', B: 'B3' }, 'E'));
  });

  it('should resolve transitioning from partially valid states', () => {
    assert.deepEqual(machine.transition({ A: 'A1', B: {} }, 'E').value, {
      A: 'A1',
      B: 'B1'
    });
  });

  it("should resolve transitioning from regions that don't exist (remove region)", () => {
    assert.deepEqual(
      machine.transition({ A: 'A1', B: 'B1', Z: 'Z1' }, 'E').value,
      {
        A: 'A1',
        B: 'B1'
      }
    );
  });
});
