
import { OpenAI } from 'openai'
import { NestorClient } from '@nestor/client'

const nestorClient = new NestorClient({ logger: null })

setTimeout(async () => {

  // init
  const openai = new OpenAI()

  // prompt
  const user_input = 'Create a playlist of the songs played at The National concert in Chicago on 24 September 2024'

  // build messages
  const messages: any[] = [
    { role: 'system', content: 'You are a helpful assistant. You answer questions using tools that are made available to you. If the tools provided do no allow you to answer the question say it without making up things.' },
    { role: 'user', content: user_input }
  ]

  // log
  console.log('** PROMPTING... ***')

  // now iterate
  while (true) {

    // build payload
    let payload: OpenAI.ChatCompletionCreateParams = {
      model: 'gpt-4o',
      messages: messages,
    }

    // add tools
    const tools = await nestorClient.list()
    if (tools.length > 0) {
      payload.tools = tools
      payload.tool_choice = 'auto'
    }

    // initialize
    const completion = await openai.chat.completions.create(payload)
    
    // get completion
    const completionResponse = completion.choices[0].message
    //console.log(completionResponse)

    // check tool calls
    if (completionResponse.tool_calls) {

      const results: any[] = []
      
      for (const toolCall of completionResponse.tool_calls) {

        // get attrs
        const id = toolCall.id
        let name = toolCall.function.name
        const parameters = JSON.parse(toolCall.function.arguments)

        // sometime the llm prefixes the name with 'function' or 'functions'
        name = name.replace(/^functions?/, '')

        // call the tool
        console.log(`  - Calling tool...`)
        const response = await nestorClient.call(name, parameters)
        //console.log('-> Got', JSON.stringify(response))

        // build message
        results.push({
          role: 'tool',
          name: name,
          content: JSON.stringify(response),
          tool_call_id: id
        })

      }

      // now add messages to the queue
      messages.push({ role: 'assistant', tool_calls: completionResponse.tool_calls })
      messages.push(...results)


    } else {

      // we should be done!
      const completion_text = completion.choices[0].message.content
      console.log(completion_text)
      process.exit(0)
    
    }
  }

}, 1000)
