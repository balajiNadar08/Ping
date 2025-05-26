import { useState, useEffect, useRef } from "react";
import "../App.css";
import NumberFlow from "@number-flow/react";
import Footer from "./Footer.jsx";

const Bandwidth = () => {
  const [duration, setDuration] = useState(null);
  const [speedInMbps, setSpeedInMbps] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(true);

  async function test() {
    const URL =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Black_hole_optics.png/1200px-Black_hole_optics.png?rand=" +
      Math.random();
    const downloadSize = 1355000;

    setIsTesting(true);
    setError(null);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const start = performance.now();

    let download = new Image();
    download.src = URL;

    download.onload = function () {
      const end = performance.now();
      const timeDuration = (end - start) / 1000;
      const speed = (downloadSize * 8) / timeDuration / (1024 * 1024);

      setDuration(timeDuration);
      setSpeedInMbps(speed.toFixed(2));
      setIsTesting(false);
    };

    await sleep(3000);

    download.onerror = function () {
      setError("Failed to load test image");
      setIsTesting(false);
    };

    if (isRunningRef.current) {
      test();
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
        <p>
          Speed: <NumberFlow className="speed" value={speedInMbps} /> Mbps
        </p>
        <p>
          Duration: <NumberFlow className="duration" value={duration} />s
        </p>
      </div>

      <button onClick={() => setIsRunning(!isRunning)}>
        {!isRunning ? "Test" : "Stop"}
      </button>

      {error ? <p>{error}</p> : null}

      <Footer />
    </div>
  );
};

export default Bandwidth;
