import React from 'react';
import { AudioCtx } from './AudioContext';
import { NOTES } from '../constants/Notes';

class NoteScheduler extends React.Component {
    static contextType = AudioCtx;

    constructor(props, context) {
        super(props);
        let source = new ConstantSourceNode(context, {offset: 200});
        this.state = {
            ctx: context,
            nextNoteTime: 0.0,
            tempo: 60.0,
            lookahead: 5.0,
            scheduleAheadTime: 0.01,
            currentNote: 0,
            source,
            notes: props.notes,
        }
        source.start();
    }

    componentDidMount() {
        this.startScheduler();
    }

    componentWillUnmount() {
        clearTimeout(this.state.timerId);
    }

    componentDidUpdate() {
        this.state.source.connect(this.props.oscillator.frequency);
    }

    startScheduler = () => {
        if (this.state.nextNoteTime < this.state.ctx.currentTime + this.state.scheduleAheadTime ) {
            this.scheduleNote(this.state.currentNote, this.state.nextNoteTime);
            this.nextNote();
        }
        const timerID = window.setTimeout(this.startScheduler, this.state.lookahead);
        this.setState({
            timerID,
        });
    }

    nextNote = () => {
        const secondsPerBeat = 60.0 / this.state.tempo;
        this.setState({
            nextNoteTime: this.state.nextNoteTime + secondsPerBeat,
            currentNote: (this.state.currentNote + 1) % this.state.notes.length,
        });
    }

    scheduleNote = (beatNumber, time) => {
        // play note or update
        this.props.trigger();
        this.state.source.offset.setValueAtTime(
            NOTES[this.state.notes[beatNumber]],
            this.state.ctx.currentTime
        );
    }

    render() {
        return (
            <div>
                <p> NOTES:  {this.state.notes.join(', ') }</p>
            </div>
        )
    }
}

export default NoteScheduler;
