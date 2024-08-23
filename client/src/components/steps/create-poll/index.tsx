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
import { CreatePollFields, createPollSchema } from './formSchema'
export default function CreatePoll() {
  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      pollTopic: '',
      votesPerVoter: 1,
      userName: '',
    },
  })

  function onSubmit(values: CreatePollFields) {
    console.log(values)
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold'>Create a New Poll</h1>
        <p className='text-muted-foreground'>Fill out the form below to create a new poll.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            name='pollTopic'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poll Topic</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='votesPerVoter'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votes Per Voter</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name=''
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
            <Button>Create</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
