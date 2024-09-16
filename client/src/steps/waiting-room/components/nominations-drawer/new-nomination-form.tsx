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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  nomination: z.string().min(1, { message: 'Please enter a nomination' }),
})

const NewNominationForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nomination: '',
    },
  })

  return (
    <Form {...form}>
      <form className='space-y-3'>
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
