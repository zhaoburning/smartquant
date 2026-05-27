import { Component, PropsWithChildren } from 'react'
import { useAppRouter } from '@/router'
import './app.scss'

class App extends Component<PropsWithChildren<any>> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return (
      <useAppRouter />
    )
  }
}

export default App
