import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/stores/app-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  nomination: z.string().min(1, { message: 'Please enter a nomination' }),
})

type FormValues = z.infer<typeof schema>

const NewNominationForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const socket = useAppStore.socket()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nomination: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    socket?.emit('nominate', { text: data.nomination })
    setOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          name='nomination'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomination</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full'>Create</Button>
      </form>
    </Form>
  )
}

export default NewNominationForm
