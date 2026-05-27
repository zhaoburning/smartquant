import { Component, PropsWithChildren } from 'react'
import { AppProvider } from '@/store'
import { useAppRouter } from '@/router'
import './app.scss'

class App extends Component<PropsWithChildren<any>> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return (
      <AppProvider>
        <useAppRouter />
      </AppProvider>
    )
  }
}

export default App
