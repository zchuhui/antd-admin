import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    /* {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    }, {
      path: '/user',
      models: () => [import('./models/user')],
      component: () => import('./routes/user/'),
    }, {
      path: '/user/:id', 
      models: () => [import('./models/user/detail')],
      component: () => import('./routes/user/detail/'),
    }, {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, {
      path: '/request',
      component: () => import('./routes/request/'),
    }, {
      path: '/UIElement/iconfont',
      component: () => import('./routes/UIElement/iconfont/'),
    }, {
      path: '/UIElement/search',
      component: () => import('./routes/UIElement/search/'),
    }, {
      path: '/UIElement/dropOption',
      component: () => import('./routes/UIElement/dropOption/'),
    }, {
      path: '/UIElement/layer',
      component: () => import('./routes/UIElement/layer/'),
    }, {
      path: '/UIElement/dataTable',
      component: () => import('./routes/UIElement/dataTable/'),
    }, {
      path: '/UIElement/editor',
      component: () => import('./routes/UIElement/editor/'),
    }, {
      path: '/chart/lineChart',
      component: () => import('./routes/chart/lineChart/'),
    }, {
      path: '/chart/barChart',
      component: () => import('./routes/chart/barChart/'),
    }, {
      path: '/chart/areaChart',
      component: () => import('./routes/chart/areaChart/'),
    }, {
      path: '/post',
      models: () => [import('./models/post')],
      component: () => import('./routes/post/'),
    }, */
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    }, 
    /* {
      path: '/home',
      models: () => [import('./models/home')],
      component: () => import('./routes/home/'),
    },
    {
      path: '/goods',
      models: () => [import('./models/goods')],
      component: () => import('./routes/goods/'),
    },
    {
      path: '/goods/relevance', 
      models: () => [import('./models/goods/relevance')],
      component: () => import('./routes/goods/relevance/'),
    },
    {
      path: '/goods/relevance/:sku', 
      models: () => [import('./models/goods/relevance')],
      component: () => import('./routes/goods/relevance/'),
    }, */
    {
      path: '/goods/detail/:sku', 
      models: () => [import('./models/goods/detail')],
      component: () => import('./routes/goods/detail/'), 
    },
    {
      path: '/rival/new',
      models: () => [import('./models/rival')],
      component: () => import('./routes/rival/new/'),
    },
    {
      path: '/rival/view',
      models: () => [import('./models/rival')],
      component: () => import('./routes/rival/new/view'),
    },
    {
      path: '/rival/view/:name',
      models: () => [import('./models/rival')],
      component: () => import('./routes/rival/new/view'),
    },
    {
      path: '/rival/hot',
      models: () => [import('./models/rival/hot/sort')],
      component: () => import('./routes/rival/hot/sort/'),
    },
    {
      path: '/rival/hot/price',
      models: () => [import('./models/rival/hot/price')],
      component: () => import('./routes/rival/hot/price/'),
    },
    {
      path: '/rival/hot/rank',
      models: () => [import('./models/rival/hot/rank')],
      component: () => import('./routes/rival/hot/rank/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/home" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
