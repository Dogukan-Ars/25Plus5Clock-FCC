import { useEffect, useState } from 'react'
import './App.css'
import { DisplayState } from './helpers'
import TimeSetter from './TimeSetter';
import Display from './Display';

const defaultBreakLength = 5 * 60
const defaultSessionLength = 25 * 60
const min = 60
const max = 60 * 60
const interval = 60

function App() {
  const [play, setPlay] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1500)
  const [breakLength, setBreakLength] = useState(defaultBreakLength)
  const [sessionLength, setSessionLength] = useState(defaultSessionLength)
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionLength,
    timeType: "Session",
    timerRunning: false,
  })

  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [breakStarted, setBreakStarted] = useState(false);
  let timerID: number; // Declare timerID outside the useEffect

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (timeLeft > 0 && play) {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }
    }, 1000)

    setTimeoutId(timeoutId);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeLeft, play]);

  useEffect(() => {
    if (!displayState.timerRunning) {
      clearInterval(timerID); // Clear the interval when timer stops
    } else {
      timerID = window.setInterval(decrementDisplay, 1000); // Assign the interval ID
    }

    return () => {
      clearInterval(timerID); // Clear the interval when component unmounts
    }
  }, [displayState.timerRunning])

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2
      audio.play().catch((err) => console.log(err))
      setDisplayState((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakLength : sessionLength,
      }))

      setBreakStarted(true);
    }
  }, [displayState, breakLength, sessionLength])

  const reset = () => {
    clearTimeout(timeoutId); // Clear the countdown timeout
    clearInterval(timerID); // Clear the interval for decrementing the display

    // Reset the state values
    setBreakLength(defaultBreakLength)
    setSessionLength(defaultSessionLength)
    setDisplayState({
      time: defaultSessionLength,
      timeType: "Session",
      timerRunning: false,
    })

    setBreakStarted(false); // Reset the breakStarted state

    const audio = document.getElementById("beep") as HTMLAudioElement
    audio.pause()
    audio.currentTime = 0
  }

  const startStop = () => {
    setPlay((prevPlay) => !prevPlay)
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }))
  }

  const changeBreakLength = (time: number) => {
    if (displayState.timerRunning) return
    setBreakLength(time)
  }

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: prev.time - 1,
    }))
  }

  const changeSessionLength = (time: number) => {
    if (displayState.timerRunning) return
    setSessionLength(time)
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    })
  }

  return (
    <>
      <h2>25 + 5 Clock</h2>
      <div className="break-session-length">

        <div className='break'>
          <h3 id="break-label">Break Length</h3>
          <TimeSetter
            time={breakLength}
            setTime={changeBreakLength}
            min={min}
            max={max}
            interval={interval}
            type='break'
          />
        </div>

        <div className='session'>
          <h3 id="session-label">Session Length</h3>
          <TimeSetter
            time={sessionLength}
            setTime={changeSessionLength}
            min={min}
            max={max}
            interval={interval}
            type='session'
          />
        </div>
      </div>

      <Display
        displayState={displayState}
        breakStarted={breakStarted}
        reset={reset}
        startStop={startStop}
      />

      <audio id='beep' src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />

    </>
  )
}

export default App
