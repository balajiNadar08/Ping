import { useState, useEffect, useRef } from "react";
import "../App.css";
import NumberFlow from "@number-flow/react";

const Bandwidth = () => {
  const [duration, setDuration] = useState(null);
  const [speedInMbps, setSpeedInMbps] = useState(null);
  const [latency, setLatency] = useState(null);
  const [jitter, setJitter] = useState(null);
  const [error, setError] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);

  const TEST_RUNS = 5;
  const TEST_DELAY_MS = 500;
  const DOWNLOAD_SIZE_BYTES = 1355000; // 1.355 MB

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function runSingleTest() {
    return new Promise((resolve, reject) => {
      const URL =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Black_hole_optics.png/1200px-Black_hole_optics.png?cache=" +
        Math.random();

      const start = performance.now();
      const img = new Image();

      img.onload = () => {
        const end = performance.now();
        const timeSec = (end - start) / 1000;
        const speedMbps = (DOWNLOAD_SIZE_BYTES * 8) / timeSec / (1024 * 1024);

        resolve({
          speed: speedMbps,
          duration: timeSec,
          latency: (end - start).toFixed(0),
        });
      };

      img.onerror = () => reject("Image failed to load");

      img.src = URL;
    });
  }

  async function test() {
    setError(null);
    const speeds = [];
    const durations = [];
    const latencies = [];

    try {
      for (let i = 0; i < TEST_RUNS && isRunningRef.current; i++) {
        const { speed, duration, latency } = await runSingleTest();

        speeds.push(speed);
        durations.push(duration);
        latencies.push(Number(latency));

        setSpeedInMbps(speed.toFixed(2));
        setDuration(duration.toFixed(2));
        setLatency(latency);

        await sleep(TEST_DELAY_MS);
      }

      if (!isRunningRef.current) return;

      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;

      const totalDuration = durations.reduce((a, b) => a + b, 0);

      const jitterValue = Math.max(...speeds) - Math.min(...speeds);

      setSpeedInMbps(avgSpeed.toFixed(2));
      setDuration(totalDuration.toFixed(2));
      setJitter(jitterValue.toFixed(2));
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    isRunningRef.current = isRunning;

    if (isRunning) test();

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

        <div className="tech-meta">
          <p>RTT: {latency ?? "--"} ms</p>
          <p>Jitter: ±{jitter ?? "--"} Mb/s</p>
          <p>Payload: 1.29 MB x {TEST_RUNS}</p>
          <p>Endpoint: upload.wikimedia.org</p>
          <p>COORDS: RA 17h45m40s / DEC -29°00'28''</p>
        </div>
      </div>

      <button
        className={isRunning ? "running" : ""}
        onClick={() => setIsRunning(!isRunning)}
      >
        {!isRunning ? "Test" : "Stop"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Bandwidth;
