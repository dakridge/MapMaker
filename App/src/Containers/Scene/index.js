// dependencies
import React from 'react';

// controllers
import SceneControllerA from './controller-a';
import SceneControllerB from './controller-b';

// style
import css from './css.styl';

class Scene extends React.PureComponent {
    state = {
        isLazy: false,
    }

    constructor(props) {
        super(props);

        this.canvasContainer = React.createRef();
    }

    componentDidMount() {
        if (window.location.search === '?lazy=true') {
            this.sceneController = new SceneControllerB(this.canvasContainer.current);
            return;
        }

        this.sceneController = new SceneControllerA(this.canvasContainer.current);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isLazy !== prevState.isLazy) {
            //
        }
    }

    handleChange() {
        this.setState({ isLazy: !this.state.isLazy });
    }

    render() {
        console.log(css);

        return (
            <div>
                <div className={css.Main} style={{ width: 1000, height: 800, border: '1px solid #ddd' }}>
                    <div className={css.Container} ref={this.canvasContainer} />
                </div>

                {/* <button onClick={this.handleChange}>Change</button> */}
            </div>
        );
    }
}

export default Scene;
