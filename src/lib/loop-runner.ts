/**
 * Cancellable sleep sequence for decorative async animation loops.
 *
 * Only one wait is ever pending (callers await sequentially), so a single
 * timer id suffices. After stop(), the pending wait never resolves, so the
 * awaiting coroutine simply goes quiet and is garbage collected.
 */
export interface LoopRunner {
  wait: (ms: number) => Promise<void>;
  stop: () => void;
  readonly alive: boolean;
}

export function createLoopRunner(): LoopRunner {
  let timer: number | undefined;
  let alive = true;

  return {
    wait: (ms: number) => {
      if (!Number.isFinite(ms) || ms < 0) {
        throw new RangeError(`LoopRunner.wait: invalid delay ${ms}`);
      }
      return new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    },
    stop: () => {
      alive = false;
      window.clearTimeout(timer);
    },
    get alive() {
      return alive;
    },
  };
}
