import React, { useState, useEffect, useRef } from 'react';
import './App.css';
const initialState = {
	sessionTime: 25,
	breakTime: 5,
	showSettings: false
};

const audioUrl = 'https://freesound.org/data/previews/66/66951_634166-lq.mp3';

function App() {
	// Hooks
	const [status, setStatus] = useState('default');
	const [pomodoroTimer, setPomodoroTimer] = useState();
	const [sessionTime, setSessionTime] = useState(initialState.sessionTime);
	const [breakTime, setBreakTime] = useState(initialState.breakTime);
	const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
	const [showSettings, setShowSettings] = useState(initialState.showSettings);
	const [minuteScaleWidth, setWidth] = useState(0);

	// References
	const container = useRef(null);
	const sound = useRef(null);

	// Constants
	const units = [50, 55, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 0, 5, 10];
	const scaleStyle = { transform: `translateX(${-(minuteScaleWidth / 60 * Math.floor(timeLeft))}px)` };
	const formatedTime = ('0' + Math.floor(timeLeft / 60)).slice(-2) + ':' + ('0' + timeLeft % 60).slice(-2);
	const isRunning = status === 'session' || status === 'break';
	const statusStyle = status;

	// Material-Ui icons
	const iReset = <i className="material-icons">autorenew</i>;
	const iSettings = <i className="material-icons">settings</i>;
	const iArrowUp = <i className="material-icons">arrow_upward</i>;
	const iArrowDown = <i className="material-icons">arrow_downward</i>;
	const iCheck = <i className="material-icons">check</i>;
	const iPlay = <i className="material-icons">play_arrow</i>;
	const iPause = <i className="material-icons">pause</i>;
	const iAdd = <i className="material-icons">add</i>;
	const iSubstract = <i className="material-icons">remove</i>;

	// UseEffect
	useEffect(
		() => {
			// container.current.offsetWidth === 400 ? setWidth(398 / 20) : setWidth(container.current.offsetWidth / 20);
			setWidth(container.current.offsetWidth / 20);
		},
		[container]
	);

	useEffect(() => setTimeLeft(sessionTime * 60), [sessionTime]);

	useEffect(
		() => {
			if (pomodoroTimer && !isRunning) {
				setPomodoroTimer();
				clearInterval(pomodoroTimer);
			} else if (!pomodoroTimer && isRunning) {
				// eslint-disable-next-line no-use-before-define
				setPomodoroTimer(
					setInterval(() => {
						setTimeLeft((timeLeft) => {
							return timeLeft - 1;
						});
					}, 1000)
				);
			}
		},
		[isRunning, pomodoroTimer]
	);

	useEffect(
		() => {
			if (timeLeft <= 0 && isRunning) {
				sound.current.play();
				setStatus(status === 'session' ? 'break' : 'session');
				setTimeLeft(status === 'session' ? breakTime * 60 : sessionTime * 60);
			}
		},
		[timeLeft, isRunning, pomodoroTimer, sessionTime, breakTime, status]
	);

	// Functions
	const handleStartStop = () => {
		// if (status.includes('pause')) setTimeLeft(timeLeft - 1);
		if (status === 'default') setStatus('session');
		if (status === 'session') setStatus('session-pause');
		if (status === 'session-pause') setStatus('session');
		if (status === 'break') setStatus('break-pause');
		if (status === 'break-pause') setStatus('break');
	};

	const handleReset = () => {
		sound.current.pause();
		sound.current.currentTime = 0;
		setStatus('default');
		setSessionTime(initialState.sessionTime);
		setBreakTime(initialState.breakTime);
		setTimeLeft(sessionTime * 60);
	};

	const handleSettingsReset = () => {
		setSessionTime(initialState.sessionTime);
		setBreakTime(initialState.breakTime);
		setTimeLeft(sessionTime * 60);
	};

	const handleFlip = () => {
		setShowSettings(!showSettings);
	};

	return (
		<div className="App">
			{/* App-header */}
			<header className="header">
				<div className="header-container">
					<div className="header-logo">
						<span className="logo-text-first">
							POM<strong className="tomato">
								<span role="img" aria-label="tomato emoji">
									&#127813;
								</span>
							</strong>DORO
						</span>CLOCK
					</div>
				</div>
			</header>
			{/* End App-header */}

			{/* main */}
			<main className="App-main" ref={container}>
				{/* main-front */}
				<div className={`main-side main-front ${status} ${showSettings ? 'hide' : ''} `}>
					<div className="main-header">
						<button className="reset-btn" id="reset" onClick={handleReset}>
							{iReset}
						</button>
						<div className="main-header-content">
							<div id="session-label" className="session-label">
								<span>Session</span> <span>{sessionTime} min</span>
							</div>
							<div id="break-label" className="session-label">
								<span>Break</span> <span>{breakTime} min</span>
							</div>
						</div>
						<button className="settings-btn" onClick={handleFlip} disabled={status !== 'default'}>
							{iSettings}
						</button>
					</div>

					<div className="main-body">
						<div className="timer-display">
							<div className="timer-label" id="timer-label">
								{status !== 'default' ? status.toUpperCase() : 'Click Button To Start'}
							</div>
							<div className="timer-time-left" id="time-left">
								{formatedTime}
							</div>
							<audio id="beep" src={audioUrl} ref={sound} />
						</div>
						<div className="timer-scale-display">
							<div className={`time-scale-display-shadow  ${status}-shadow`} />
							<div className="timer-scale-arrow">&#9660;</div>
							<div className="timer-scale-container" style={scaleStyle}>
								{units.map((unit, i) => (
									<div key={i} className="timer-scale-unit">
										<div className="timer-scale-strokes">
											<div />
											<div />
											<div />
											<div />
											<div />
										</div>
										<div
											className="timer-scale-label"
											style={{
												transform: unit < 10 ? 'translateX(-3px)' : 'translateX(-8px)'
											}}
										>
											{unit}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="main-footer">
						<button className="timer-btn" id="start_stop" onClick={handleStartStop}>
							{!isRunning ? iPlay : iPause}
						</button>
					</div>
				</div>{' '}
				{/* End main-front */}
				{/* main-back */}
				<div className={`main-side main-back ${!showSettings ? 'hide' : ''}`}>
					<div className="main-header">
						<button
							className="reset-btn"
							onClick={handleSettingsReset}
							disabled={sessionTime === initialState.sessionTime && breakTime === initialState.breakTime}
						>
							{iReset}
						</button>
						<div className="main-header-content">Settings</div>
						<button onClick={handleFlip} className="big">
							{iCheck}
						</button>
					</div>

					<div className="main-body">
						<div className="settings">
							<div className="settings-label">Work</div>
							<div className="settings-action">
								<button
									className="settings-button"
									id="session-increment"
									onClick={() => sessionTime < 60 && setSessionTime(sessionTime + 1)}
								>
									{iAdd}
								</button>
								<input
									className="settings-input"
									id="session-length"
									type="number"
									value={sessionTime}
									onChange={(e) =>
										e.target.value > 0 &&
										e.target.value < 60 &&
										setSessionTime(Number(e.target.value))}
								/>
								<button
									className="settings-button"
									id="session-decrement"
									onClick={() => sessionTime > 1 && setSessionTime(sessionTime - 1)}
								>
									{iSubstract}
								</button>
							</div>
						</div>

						<div className="settings">
							<div className="settings-label">Break</div>
							<div className="settings-action">
								<button
									className="settings-button"
									id="break-increment"
									onClick={() => breakTime < 60 && setBreakTime(breakTime + 1)}
								>
									{iAdd}
								</button>
								<input
									className="settings-input"
									id="break-length"
									type="number"
									value={breakTime}
									onChange={(e) =>
										e.target.value >= 0 &&
										e.target.value < 60 &&
										setBreakTime(Number(e.target.value))}
								/>
								<button
									className="settings-button"
									id="break-decrement"
									onClick={() => breakTime > 1 && setBreakTime(breakTime - 1)}
								>
									{iSubstract}
								</button>
							</div>
						</div>
					</div>
				</div>{' '}
				{/* End main-back */}
			</main>
		</div>
	);
}

export default App;
