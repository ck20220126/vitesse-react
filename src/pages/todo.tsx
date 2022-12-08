import { useRef, useState } from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useDoubleClick from '~/hooks/useDoubleClick'

interface TodoItem { id: string; title: string; checked?: boolean }

interface GetTodoListResult { list: TodoItem[]; success: boolean }

/* Mock 接口 */
const mockData: {
  list: TodoItem[]
} = {
  list: [],
}

const getTodoList = () => {
  return new Promise<GetTodoListResult>((resolve) => {
    setTimeout(() => {
      resolve({
        list: mockData.list,
        success: true,
      })
    }, 2000)
  })
}

const mockPostTodo: <T = unknown>(data: T) => Promise<{ data: Partial<T>; success: boolean }> = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, success: true })
    }, 1000)
  })
}
/* Mock 接口 end */

const Todo: React.FC = () => {
  const queryClient = useQueryClient()

  const [inputValue, setInputValue] = useState<string>('')
  const [editorValue, setEditorValue] = useState<string>('')
  const [editRow, setEditRow] = useState<TodoItem>()

  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodoList,
  })

  const addMutation = useMutation({
    mutationFn: mockPostTodo,
    onMutate: async (newTodo: TodoItem) => {
      await queryClient.cancelQueries(['todos'])

      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old: any) => {
        const newList: TodoItem[] = [...old?.list, newTodo]

        // Mock 数据
        mockData.list = newList

        return {
          ...old,
          list: newList,
        }
      })

      // 清除input value
      setInputValue('')

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    },
  })

  const updateMutation = useMutation({
    mutationFn: (current: TodoItem) => mockPostTodo(current),
    onMutate: async (newTodo: TodoItem) => {
      await queryClient.cancelQueries(['todos'])

      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old: any) => {
        const newVal = { ...old }
        const index = newVal.list.findIndex((item: any) => item.id === newTodo.id)
        newVal.list[index] = newTodo

        // Mock 数据
        mockData.list = newVal.list

        return newVal
      })

      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (current: TodoItem) => mockPostTodo(current),
    onMutate: async (newTodo: TodoItem) => {
      await queryClient.cancelQueries(['todos'])

      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData(['todos'], (old: any) => {
        const newVal = { ...old }
        const index = newVal.list.findIndex((item: any) => item.id === newTodo.id)
        newVal.list.splice(index, 1)

        // Mock 数据
        mockData.list = newVal.list

        return newVal
      })

      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos'])
    },
  })

  const handleToggleChecked = (current: TodoItem) => {
    updateMutation.mutate({
      ...current,
      checked: !current?.checked,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')
      addMutation.mutate({ id: nanoid(), title: inputValue } as any)
  }

  const handleEditorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditorValue(e.target.value)
  }

  const handleEditorKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editRow) {
      if (editorValue.trim())
        updateMutation.mutate({ ...editRow, title: editorValue })
      else
        deleteMutation.mutate(editRow)

      setEditRow(undefined)
    }
  }

  const todoBox = useRef(null)
  useDoubleClick(todoBox, { interval: 300 }, (event) => {
    const el = event.target as HTMLSpanElement
    const isControl = el.getAttribute('data-control')
    const id = el.getAttribute('data-id')

    if (id && isControl === 'true') {
      const current = getTodoRow(id)
      if (!current)
        return

      setEditRow(current)
      setEditorValue(current.title)
    }
  })

  function getTodoRow(id: string) {
    const _data = queryClient.getQueryData<GetTodoListResult>(['todos'])
    if (_data?.list?.length)
      return _data?.list.find(item => item.id === id)

    return null
  }

  return (
    <div className="min-h-[calc(100vh-132px)]">
      <h1 className="font-100 text-(100px [#2f9488]/50)">todos</h1>
      <div
        className="max-w-550px w-90% mx-auto shadow-xl text-left"
        uno-border="~ rounded gray-200 dark:gray-700"
      >
        <input
          value={inputValue}
          placeholder="What needs to be done?"
          className="w-full p-16px pl-24px bg-transparent dark:bg-white/5 placeholder-gray-300"
          uno-text="24px #2f9488/80"
          uno-outline="none active:none"
          onChange={handleChange}
          onKeyDown={handleKeydown}
        />
        <div ref={todoBox}>
          {data?.list?.length
            ? (
            <>
              <div>
                {data.list.map(item => (
                  <div
                    key={item.id}
                    className="relative flex items-center leading-30px"
                    uno-border="t gray-200 dark:gray-700"
                    uno-hover="bg-#2f9488/10"
                  >
                    <div onClick={handleToggleChecked.bind(this, item)} className={classNames('flex-shrink-0 mr-8px ml-16px text-24px', item.checked ? 'text-#2f9488 i-carbon-checkbox-checked' : 'i-carbon-checkbox')} />
                    <div className={classNames('flex-1 p-12px', { 'dark:bg-white/5 border-(~ solid #2f9488)': editRow?.id })}>
                      {editRow?.id === item.id
                        ? <input
                            value={editorValue}
                            className="w-full h-full bg-transparent"
                            uno-text="18px #2f9488/80"
                            uno-outline="none active:none"
                            onChange={handleEditorChange}
                            onKeyDown={handleEditorKeydown}
                            autoFocus
                          />
                        : <span data-control={true} data-id={item.id} className={classNames('line-clamp-1 text-20px', { 'line-through': item.checked })}>{item.title}</span>}
                    </div>
                    {!editRow?.id && <div onClick={() => deleteMutation.mutate(item)} className='i-carbon-close flex-shrink-0 text-22px absolute z-1 right-16px p-4px' />}
                  </div>
                ))}
              </div>
              <div className='px-16px py-12px text-gray-400' uno-border="t gray-200 dark:gray-700">{data.list.length} item left</div>
            </>
              )
            : null}
        </div>
      </div>

      <div className="mt-60px text-gray-300">
        <p>Double-click to edit a todo</p>
        <p>
          Created by{' '}
          <a
            className="text-gray-500 hover:(underline underline-offset-4 decoration-#2f9488)"
            href="https://github.com/petehunt/"
            target="_blank"
          >
            petehunt
          </a>
        </p>
      </div>
    </div>
  )
}

export default Todo
