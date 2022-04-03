import { StrictMode } from 'react'
import WebFont from 'webfontloader'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './app/app'


WebFont.load({
  google: {
    families: ['Lato']
  }
})

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
