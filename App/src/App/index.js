// dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// containers
import Scene from '../Containers/Scene';

// styles
import css from './app.styl';

class Application extends React.PureComponent {
    render() {
        return (
            <div className={css.Main}>
                <Scene />
            </div>
        );
    }
}

export default Application;
