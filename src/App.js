// import Context from './components/AudioContext';
import Oscillator, { OSCILLATOR_TYPE } from './components/Oscillator';
import NoteScheduler from './components/NoteScheduler';
import GainNode from './components/GainNode';
import Envelope from './components/Envelope';

function App() {
  return (
    <div className="App">

        <Oscillator
          frequency={
            <NoteScheduler
              notes={['C4', 'C4', 'G3', 'A3', 'F3', 'B3', 'B3', 'C4']}
            />
          }
          detune={26}
          type={OSCILLATOR_TYPE.TRIANGLE}
          destination={
            <GainNode
              gain={1}
              envelope={
                <Envelope
                  max={0.8}
                  attackTime={0.1}
                  releaseTime={0.9}
                />
              }
            />}
        />

        <Oscillator
          frequency={
            <NoteScheduler
              notes={['C2', 'C2', 'E2', 'E2', 'F2', 'E2', 'D2', 'C3']}
            />
          }
          detune={26}
          type={OSCILLATOR_TYPE.SINE}
          destination={
            <GainNode
              gain={1}
              envelope={
                <Envelope
                  max={1}
                  attackTime={0.35}
                  releaseTime={0.6}
                />
              }
            />}
        />
    </div>
  );
}

export default App;
