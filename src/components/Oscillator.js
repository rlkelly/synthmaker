import React from 'react';
import PropTypes from 'prop-types';
import { AudioCtx } from './AudioContext';
import NoteScheduler from './NoteScheduler';

const STATE = {
    STOPPED: 0,
    STARTED: 1,
};

const OSCILLATOR_TYPE = {
    SINE: 'sine',
    SQUARE: 'square',
    SAWTOOTH: 'sawtooth',
    TRIANGLE: 'triangle',
    // CUSTOM: 'UNIMPLEMENTED',
};

class Oscillator extends React.Component {
    static contextType = AudioCtx;

    constructor(props, context) {
        super(props);
        this.state = {
            ctx: context,
            oscillator: context.createOscillator(),
            frequency: props.frequency,
            currentState: STATE.STOPPED,
            dead: false,
            oscillatorType: props.type,
            count: 0,
        }
        
        this.setOscillatorType(props.type);
        if (typeof props.frequency === 'number') {
            this.setFrequency(props.frequency);
        } else {
            this.setFrequency(0);
        }
        this.setDetune(props.detune);
        
        if (this.props.destination === undefined) {
            this.state.oscillator.connect(this.state.ctx.destination);
        }
        this.state.oscillator.start();
    }

    setOscillatorType = (type) => {
        this.setState({
            oscillatorType: type,
        });
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.oscillator.type = type;
    }

    getParams = () => {
        return [
            // {func: this.setFrequency, name: 'frequency', values: [0, 800]},
            // {func: this.start, name: 'start'},
            // {func: this.stop, name: 'stop'},
            {func: this.setOscillatorType, name: 'pick oscillator', inputType: 'dropdown', values: Object.values(OSCILLATOR_TYPE)},
        ]
    }

    setFrequency = (frequency) => {
        this.setState({
            frequency,
        })
        this.state.oscillator.frequency.setValueAtTime(frequency, this.state.ctx.currentTime);
    }

    start = () => {
        if (this.state.dead) {
            const oscillator = this.state.ctx.createOscillator();
            if (typeof this.props.frequency === 'number') {
                oscillator.frequency.setValueAtTime(this.props.frequency, this.state.ctx.currentTime);
            } else {
                oscillator.frequency.setValueAtTime(0, this.state.ctx.currentTime);
            }
    
            oscillator.type = this.state.oscillatorType;
            this.setState({
                oscillator: oscillator,
                dead: false,
            });
            if (this.props.destination === undefined) {
                oscillator.connect(this.context.destination);
            } else {
                // oscillator.connect(this.context.destination);
            }
            oscillator.start();
            console.log('started');
        } else {
            this.state.oscillator.start();
        }
    }

    stop = () => {
        this.state.oscillator.stop();
        this.setState({
            dead: true,
        })
    }

    trigger = () => {
        this.setState({
            count: this.state.count + 1,
        });
    }

    connect = (destination) => {
        this.state.oscillator.connect(destination);
    }

    setDetune = (detune) => {
        this.state.oscillator.detune.setValueAtTime(detune, this.state.ctx.currentTime);
    }

    disconnect() {
        // TODO: implement disconnecting nodes
    }

    numInputs() {
        return 0;
    }

    numOutputs() {
        return 1;
    }

    render() {
        return (
            <div style={{borderStyle: 'solid'}}>
                {React.cloneElement(this.props.frequency, { trigger: this.trigger, oscillator: this.state.oscillator })}
                {React.cloneElement(this.props.destination, { tick: this.state.count, source: this.state.oscillator })}

                <button onClick={this.start}>start</button>
                <button onClick={this.stop}>stop</button>
                {this.getParams().map((op) => {
                    return (
                        <>
                            <div>{op.name}</div>
                            {(op.inputType === 'dropdown') ? (
                                <select onChange={v => op.func(v.target.value)}>
                                    {op.values.map(val => <option value={val}>{val}</option>)}                                            
                                </select>
                            ) : (
                                <input
                                    type="number"
                                    onChange={v => op.func(v.target.value)}
                                    value={this.state[op.name]}
                                ></input>
                            )}
                        </>
                    )
                })}
            </div>
        )
    }
}

Oscillator.propTypes = {
    detune: PropTypes.number,
    frequency: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(NoteScheduler)]),
    type: PropTypes.instanceOf(OSCILLATOR_TYPE),
};

export default Oscillator;
export { OSCILLATOR_TYPE };
