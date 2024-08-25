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
import { toast } from '@/components/ui/toast/use-toast'
import { useAppStepsStore } from '@/stores/app-steps-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { JoinPollFields, joinPollSchema } from './form-schema'
import { useJoinPoll } from './mutations/use-join-poll'
export default function CreatePoll() {
  const setCurrentStep = useAppStepsStore.use.setCurrentStep()
  const { mutate: joinPoll, isPending } = useJoinPoll()
  const form = useForm<JoinPollFields>({
    resolver: zodResolver(joinPollSchema),
    defaultValues: {
      pollId: '',
      userName: '',
    },
  })

  function onSubmit(values: JoinPollFields) {
    joinPoll(values, {
      onSuccess: () => {
        toast({
          title: 'Joined poll successfully',
        })
      },
      onError: (error) => {
        toast({
          title: 'Failed to join poll',
          description: error.message,
        })
      },
    })
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
            <Button disabled={isPending}>Join</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
