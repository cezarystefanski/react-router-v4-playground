import React, { Component, PropTypes as RPT } from 'react';
import { BrowserRouter as Router, Route, NavLink, Switch, Link, Redirect, Prompt } from 'react-router-dom';
import './App.css';

const contactStyle = {
  border: '1px solid #ee1155',
  borderRadius: '3px'
};

const isActiveFunc = (match, location) => {
  console.info(match, location); // eslint-disable-line
  return match;
};

const isSchool = (match, location) => location.pathname.indexOf('school') !== -1;

const BottomMenu = () => (
  <nav>
    <NavLink exact activeClassName="active" to="/">home</NavLink>
    <br />
    <NavLink activeClassName="active" replace to="/about">about</NavLink>
    <br />
    <NavLink
      exact
      isActive={isActiveFunc}
      activeClassName="active"
      activeStyle={contactStyle}
      to={{
        pathname: '/contact',
        search: 'someId=070072772'
      }}
    >
      contact
    </NavLink>
    <br />
    <NavLink activeClassName="active" to="/contact/home">contact home</NavLink>
    <br />
    <NavLink activeClassName="active" to="/contact/work">contact work</NavLink>
    <br />
    <NavLink activeClassName="active" isActive={isSchool} to={`/contact/school/${Date.now()}`}>contact school</NavLink>
    <br />
    <NavLink activeClassName="active" to="/does-not-exist">does not exist</NavLink>
    <br />
    <NavLink activeClassName="active" to="/does-not-exist-2">does not exist 2</NavLink>
    <br />
    <NavLink activeClassName="active" to="/menu">menu</NavLink>
    <br />
    <NavLink activeClassName="active" to="/some-new-site">redirect to about</NavLink>
    <br />
    <NavLink activeClassName="active" to="/protected">logged in area</NavLink>
    <br />
    <NavLink activeClassName="active" to="/form">form</NavLink>
  </nav>
);

const Menu = () => (
  <div>
    <h1>Menu</h1>
    <Link to="/menu/food">food</Link>
    <span>&nbsp;</span>
    <Link to="/menu/drinks">drinks</Link>
    <span>&nbsp;</span>
    <Link to="/menu/sides">sides</Link>
    <Route
      path="/menu/:type"
      render={({ match }) => (
        <h3>Here are some {match.params.type}</h3>
      )}
    />
  </div>
);

const Home = (props) => {
  const { loggedIn, changeLoginStatus } = props;
  const logged = 'loggedIn';
  const notLogged = 'notLoggedIn';

  const onRadioChange = () => {
    const checkedValue = document.querySelector('input[name="loggedin"]:checked').value;
    if (checkedValue !== loggedIn.toString()) {
      changeLoginStatus(checkedValue);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <form onChange={onRadioChange}>
        <input type="radio" name="loggedin" value="false" id={notLogged} defaultChecked={!loggedIn} />
        <label htmlFor={notLogged}>Not Logged In</label>
        <br />
        <input type="radio" name="loggedin" value="true" id={logged} defaultChecked={loggedIn} />
        <label htmlFor={logged}>Logged In</label>
      </form>
    </div>
  );
};

const HomeContent = () => (
  <Route
    exact
    path="/"
    render={() => (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Error explicabo maxime doloribus laboriosam numquam illum unde placeat voluptatem sint!
        Nemo amet cum molestias, odio, ducimus blanditiis est quidem tenetur veniam.
      </p>
    )}
  />
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    };
    this.changeLoginStatus = this.changeLoginStatus.bind(this);
  }

  changeLoginStatus(isLogged) {
    this.setState({
      loggedIn: isLogged === 'true'
    });
  }

  render() {
    return <RouteMap loggedIn={this.state.loggedIn} changeLoginStatus={this.changeLoginStatus} />;
  }
}

class Form extends Component {
  constructor() {
    super();
    this.state = {
      dirty: false
    };
    this.setDirty = this.setDirty.bind(this);
  }

  setDirty() {
    this.setState({
      dirty: true
    });
  }

  render() {
    return (
      <div>
        <h1>Form</h1>
        <input type="text" onInput={this.setDirty} />
        <Prompt
          when={this.state.dirty}
          message="Data will be lost!"
        />
      </div>
    );
  }
}

const RouteMap = props => (
  <Router>
    <div>
      <div className="hero">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Home
                loggedIn={props.loggedIn}
                changeLoginStatus={props.changeLoginStatus}
              />
            )}
          />
          <Route
            path="/about" children={({ match }) => match && (
              <div>
                <h1>About</h1>
              </div>
            )}
          />
          {/* Won't get rendered because of Switch in place */}
          <Route path="/about" render={() => <p>This is some about content</p>} />
          <Route
            path="/contact/:place?/:date?" render={({ match, location }) => {
              const dateFromParam = match.params.place === 'school' ?
                new Date(parseInt(match.params.date, 10)).toString() :
                null;
              const id = new URLSearchParams(location.search).get('someId');
              const idPara = id ?
                <p>{id}</p> :
                null;
              return (
                <header>
                  <h1>Contact {match.params.place || 'normal'}</h1>
                  <h2>{dateFromParam}</h2>
                  {idPara}
                </header>
              );
            }}
          />
          <Route path="/menu" component={Menu} />
          <Route
            path="/protected"
            render={() => (
              props.loggedIn ?
                <h1>Welcome, you have logged in</h1> :
                <Redirect to="/" />
            )}
          />
          <Route path="/form" component={Form} />
          <Route render={() => <h1>404 Page not found</h1>} />
        </Switch>
        <HomeContent />
        {/* This is out of Switch, so it will render */}
        <Route path="/about" render={() => <p>This is some about content</p>} />
        <Route
          path="/some-new-site"
          render={() => (
            <Redirect to="/about" />
          )}
        />
      </div>
      <BottomMenu />
    </div>
  </Router>
);

RouteMap.propTypes = {
  loggedIn: RPT.bool,
  changeLoginStatus: RPT.func
};

Home.propTypes = {
  loggedIn: RPT.bool,
  changeLoginStatus: RPT.func
};

export default App;
