import { useState, useEffect, useRef } from "react";
import "../App.css";
import NumberFlow from "@number-flow/react";

const Bandwidth = () => {
  const [duration, setDuration] = useState(null);
  const [speedInMbps, setSpeedInMbps] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(true);

  const TEST_RUNS = 5;
  const TEST_DELAY_MS = 500;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function runSingleTest() {
    return new Promise((resolve, reject) => {
      const URL =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Black_hole_optics.png/1200px-Black_hole_optics.png?cache=" +
        Math.random();

      const downloadSize = 1355000; // bytes (approx)

      const start = performance.now();
      const img = new Image();

      img.onload = () => {
        const end = performance.now();
        const duration = (end - start) / 1000;
        const speed = (downloadSize * 8) / duration / (1024 * 1024);

        resolve({ speed, duration });
      };

      img.onerror = () => reject("Image failed to load");

      img.src = URL;
    });
  }

  async function test() {
    setIsTesting(true);
    setError(null);

    const speeds = [];
    const durations = [];

    try {
      for (let i = 0; i < TEST_RUNS && isRunningRef.current; i++) {
        const { speed, duration } = await runSingleTest();

        speeds.push(speed);
        durations.push(duration);

        // Optional: show latest run live
        setSpeedInMbps(speed.toFixed(2));
        setDuration(duration.toFixed(2));

        await sleep(TEST_DELAY_MS);
      }

      if (!isRunningRef.current) return;

      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

      const totalDuration = durations.reduce((a, b) => a + b, 0);

      setSpeedInMbps(avgSpeed.toFixed(2));
      setDuration(totalDuration.toFixed(2));
    } catch (err) {
      setError(err);
    } finally {
      setIsTesting(false);
    }
  }

  useEffect(() => {
    isRunningRef.current = isRunning;

    if (isRunning) {
      test();
    }

    return () => {
      isRunningRef.current = false;
    };
  }, [isRunning]);

  return (
    <div className="container">
      <div className="display">
        <p className="label">Speed</p>
        <p className="value speed">
          <NumberFlow value={speedInMbps} /> <span className="unit">Mb/s</span>
        </p>

        <p className="label subtle">Data Transfer Time</p>
        <p className="value duration">
          <NumberFlow value={duration} /> <span className="unit">s</span>
        </p>
      </div>

      <button
        className={isRunning ? "running" : ""}
        onClick={() => setIsRunning(!isRunning)}
      >
        {!isRunning ? "Test" : "Stop"}
      </button>

      {error ? <p>{error}</p> : null}
    </div>
  );
};

export default Bandwidth;
