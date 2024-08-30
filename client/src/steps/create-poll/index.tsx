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
import { toast } from '@/components/ui/toast/use-toast'
import { accessTokenConfig } from '@/lib/utils'
import { useAppStore } from '@/stores/app-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreatePollFields, createPollSchema } from './form-schema'
import { useCreatePoll } from './mutations/use-create-poll'

export default function CreatePoll() {
  const setCurrentStep = useAppStore.setCurrentStep()
  const updatePoll = useAppStore.updatePoll()

  const form = useForm<CreatePollFields>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      topic: '',
      votesPerVoter: 1,
      userName: '',
    },
  })

  const { mutate: createPoll, isPending } = useCreatePoll()

  function onSubmit(values: CreatePollFields) {
    createPoll(values, {
      onSuccess: (data) => {
        toast({
          title: 'Created poll successfully',
        })
        updatePoll(data.poll)
        accessTokenConfig.set(data.accessToken)
        setCurrentStep('waitingRoom')
      },
      onError: (error) => {
        toast({
          title: 'Failed to create poll',
          description: error.message,
        })
      },
    })
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold'>Create a New Poll</h1>
        <p className='text-muted-foreground'>Fill out the form below to create a new poll.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            name='topic'
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
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
