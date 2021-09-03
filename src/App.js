import './App.css';
import Home from './Home.js'
import CityNode from "./CityNode.js"
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  
  return (
      <div className="app">
          <Route path='/data' component={CityNode}></Route>
          <Route exact path='/' component={Home}></Route>
      </div>
    
  );
}

export default App;
