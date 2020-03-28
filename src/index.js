import React,{useEffect} from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import GameFrame from './containers/GamePlay';
import HomePage from './containers/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import HowToPlay from './containers/HowToPlay';


import store from './store';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.css';
import './mystyles.css';
import {createAction} from "redux-actions";

const NotFound = () => (
  <div className="center-all">
    <div>Page Not Found</div>
    <div>
      Return to&nbsp;
      <Link to="/">Home</Link>
    </div>
  </div>
);

const Home = () => <div>
  <Header />
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route path="/how-to-play" component={HowToPlay} />
    <Route path="*" component={NotFound} />
  </Switch>
  <Footer />
</div>;

const Game = () => {
  useEffect(()=>{
    const socket = socketIOClient("http://be6a5494.ngrok.io");
    window.socket = socket
    socket.on('connected',(color)=>{
      console.log(color)
      store.dispatch({type:"UPDATE_BOARD_SETTINGS",payload:{color}})
    })
    socket.on("action_received_gameData",(action)=>{
      // action.fromSocket = true

      store.dispatch({type:"fromSocket",payload:action})
    })

  },[])
  return (<Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/play" component={GameFrame} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  </Provider>
  );
};


render(<Game />, document.getElementById('root'));
registerServiceWorker();
