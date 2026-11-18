export interface TodoItem {
  id: string
  userId: string
  title: string
  done: boolean
}

export interface TodoSavePayload {
  id: string | null
  title: string
}
