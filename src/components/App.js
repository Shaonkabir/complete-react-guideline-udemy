import React, { Component } from 'react';
import { BrowserRouter as Router , Route, Switch } from 'react-router-dom';
import Layout from '../hoc/layout/Layout';
import BurgerBuilder from '../containers/BurgerBuilder/BurgerBuilder'
import Checkout from '../containers/Checkout/Checkout'
import Orders from '../containers/Orders/Orders';

class App extends Component {
  render() {
    return(
      <Router>
        <div>
          <Layout>
            <Switch>
              <Route exact path='/' component={BurgerBuilder} />
              <Route path='/checkout' component={Checkout} />
              <Route path='/orders' component={Orders} />
            </Switch>
          </Layout>
        </div>
      </Router>
    )
  }
}

export default App;
