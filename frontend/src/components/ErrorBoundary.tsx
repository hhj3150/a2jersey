import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-soil/10 text-soil-dark text-2xl">
            !
          </div>
          <h1 className="text-xl font-semibold tracking-tight-kr text-ink">
            일시적인 오류가 발생했습니다
          </h1>
          <p className="mt-3 text-sm text-mute leading-relaxed">
            페이지를 다시 불러오시면 정상적으로 보일 수 있어요.
            <br />
            계속 발생하면 잠시 후 다시 접속해 주세요.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            다시 불러오기
          </button>
        </div>
      </div>
    )
  }
}
