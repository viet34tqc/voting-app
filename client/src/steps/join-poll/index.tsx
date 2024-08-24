import { Button } from '@/components/ui/button/button'
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
import { JoinPollFields, joinPollSchema } from './formSchema'
export default function CreatePoll() {
  const form = useForm<JoinPollFields>({
    resolver: zodResolver(joinPollSchema),
    defaultValues: {
      pollId: '',
      userName: '',
    },
  })

  function onSubmit(values: JoinPollFields) {
    console.log(values)
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold'>Join existing poll</h1>
        <p className='text-muted-foreground'>
          If you have an existing poll, fill out this form to join it
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            name='pollId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter code provided by the creator</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='userName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-between'>
            <Button type='button' variant='outline' onClick={() => form.reset()}>
              Reset
            </Button>
            <Button>Join</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
