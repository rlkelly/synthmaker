import React from 'react';
import { AudioCtx } from './AudioContext';

class GainNode extends React.Component {
    static contextType = AudioCtx;

    constructor(props, context) {
        super(props);
        const gain = context.createGain();
        this.state = {
            gain,
            gainAmount: props.gain,
            ctx: context,
            tick: 0,
        };
        gain.gain.value = props.gain;
        gain.connect(context.destination);
    }

    componentDidMount() {
        this.props.source.connect(this.state.gain);
    }

    componentDidUpdate() {
        this.props.source.connect(this.state.gain);
    }

    changeGain = (val) => {        
        this.state.gain.gain.setValueAtTime(val, this.state.ctx.currentTime);
        this.setState({
            gainAmount: val,
        })
    }

    render() {
        return (
            <div>
                {React.cloneElement(this.props.envelope, {tick: this.props.tick, source: this.state.gain.gain})}
                {/* <input
                    type="range"
                    min="0" max="1" step="0.1"
                    onChange={e => this.changeGain(e.target.value)}
                    value={this.state.gainAmount}
                ></input> */}
                <p>GAIN: {this.state.gain.gain.value}</p>
            </div>
        );
    }
}

export default GainNode;
