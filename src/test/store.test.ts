import { describe, expect, it, vi } from "vitest";
import { checkNisn, createSeed, startCountdown } from "@/lib/store";

describe("aturan simulasi", () => {
  it("menolak NISN yang sudah memilih", () => {
    const r = checkNisn(createSeed(), "0081234501");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("voted");
  });
  it("menerima NISN yang belum memilih", () => {
    expect(checkNisn(createSeed(), "0081234502").ok).toBe(true);
  });
  it("hitung mundur 5 detik lalu kembali ke login", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const ticks: number[] = [];
    startCountdown(5, (n) => ticks.push(n), done);
    vi.advanceTimersByTime(4000);
    expect(done).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(done).toHaveBeenCalledOnce();
    expect(ticks).toEqual([5, 4, 3, 2, 1, 0]);
    vi.useRealTimers();
  });
});
