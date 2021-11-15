import React from 'react';
import { AudioCtx } from './AudioContext';

class Envelope extends React.Component {
    static contextType = AudioCtx;

    constructor(props, context) {
        super(props);
        this.state = {
            ctx: context,
        };
    }

    componentDidMount() {
        console.log('connect');
    }

    componentDidUpdate() {
        const now = this.state.ctx.currentTime;
        const { attackTime, releaseTime, max } = this.props;

        this.props.source.setValueAtTime(0, now);
        this.props.source.linearRampToValueAtTime(max, now + attackTime);
        this.props.source.linearRampToValueAtTime(0, now + attackTime + releaseTime);
    }

    render() {
        return (
            <div>
                ENVELOPE
            </div>
        );
    }
}

export default Envelope;
