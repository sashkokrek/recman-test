import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { useAppDispatch } from '@/store';
import { Input } from '@/components/ui/Input';

interface AddTaskInputProps {
  columnId: string;
}

const addTaskInputWrapperStyles = cva('px-2 pb-2');
const addTaskInputFieldStyles = cva('text-sm');

export function AddTaskInput({ columnId }: AddTaskInputProps) {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');

  const submit = () => {
    if (value.trim()) {
      dispatch({ type: 'TASK_ADD', payload: { columnId, text: value } });
      setValue('');
    }
  };

  return (
    <div className={addTaskInputWrapperStyles()}>
      <Input
        variant="bordered"
        placeholder="+ Add task…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submit();
          }
        }}
        onBlur={submit}
        className={addTaskInputFieldStyles()}
        aria-label="New task text"
      />
    </div>
  );
}
